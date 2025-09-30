import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';
import { ResumeData } from '../types';
import { extractEmailFromText, extractPhoneFromText, extractNameFromText } from '../utils/helpers';

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = //cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js;

export const parseResume = async (file: File): Promise<ResumeData> => {
  let text = '';
  
  if (file.type === 'application/pdf') {
    text = await parsePDF(file);
  } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    text = await parseDOCX(file);
  } else {
    throw new Error('Unsupported file format. Please upload a PDF or DOCX file.');
  }

  const name = extractNameFromText(text);
  const email = extractEmailFromText(text);
  const phone = extractPhoneFromText(text);

  return {
    text,
    name,
    email,
    phone,
  };
};

const parsePDF = async (file: File): Promise<string> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      fullText += pageText + '\n';
    }

    return fullText;
  } catch (error) {
    throw new Error('Failed to parse PDF file. Please make sure the file is not corrupted.');
  }
};

const parseDOCX = async (file: File): Promise<string> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  } catch (error) {
    throw new Error('Failed to parse DOCX file. Please make sure the file is not corrupted.');
  }
};

export const validateFile = (file: File): { isValid: boolean; error?: string } => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Please upload a PDF or DOCX file only.'
    };
  }

  if (file.size > maxSize) {
    return {
      isValid: false,
      error: 'File size must be less than 10MB.'
    };
  }

  return { isValid: true };
};