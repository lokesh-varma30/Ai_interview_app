import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Upload, FileText, AlertCircle, Loader2 } from 'lucide-react';
import { RootState } from '../../store';
import { uploadResume, generateQuestions } from '../../store/slices/interviewSlice';
import { validateFile } from '../../services/resumeParser';

const ResumeUpload: React.FC = () => {
  const dispatch = useDispatch();
  const { isLoading, error, extractedData, currentCandidate } = useSelector(
    (state: RootState) => state.interview
  );

  const handleFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validation = validateFile(file);
    if (!validation.isValid) {
      alert(validation.error);
      return;
    }

    try {
      const result = await dispatch(uploadResume(file)).unwrap();
      // Auto-generate questions after successful upload
      if (result.resumeData.text) {
        dispatch(generateQuestions(result.resumeData.text));
      }
    } catch (error) {
      console.error('Failed to upload resume:', error);
    }
  }, [dispatch]);

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();

    const file = event.dataTransfer.files[0];
    if (file) {
      const validation = validateFile(file);
      if (!validation.isValid) {
        alert(validation.error);
        return;
      }

      dispatch(uploadResume(file));
    }
  }, [dispatch]);

  if (currentCandidate && currentCandidate.questions.length > 0) {
    return null; // Don't show upload when questions are ready
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          AI-Powered Interview Assistant
        </h1>
        <p className="text-lg text-gray-600">
          Upload your resume to begin the interview process
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isLoading
              ? 'border-gray-200 bg-gray-50'
              : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
          }`}
        >
          {isLoading ? (
            <div className="flex flex-col items-center">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
              <p className="text-gray-600 font-medium">Processing your resume...</p>
              <p className="text-sm text-gray-500 mt-2">
                This may take a few moments
              </p>
            </div>
          ) : (
            <>
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Upload Your Resume
              </h3>
              <p className="text-gray-600 mb-4">
                Drag and drop your resume here, or click to select
              </p>
              <input
                type="file"
                accept=".pdf,.docx"
                onChange={handleFileSelect}
                className="hidden"
                id="resume-upload"
                disabled={isLoading}
              />
              <label
                htmlFor="resume-upload"
                className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer"
              >
                Choose File
              </label>
              <p className="text-sm text-gray-500 mt-3">
                Supported formats: PDF, DOCX (Max 10MB)
              </p>
            </>
          )}
        </div>
      </div>

      {extractedData && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <FileText className="w-6 h-6 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Resume Processed Successfully
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <div className="bg-gray-50 rounded px-3 py-2">
                {extractedData.name || 'Not found'}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="bg-gray-50 rounded px-3 py-2">
                {extractedData.email || 'Not found'}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <div className="bg-gray-50 rounded px-3 py-2">
                {extractedData.phone || 'Not found'}
              </div>
            </div>
          </div>
          
          {(!extractedData.name || !extractedData.email || !extractedData.phone) && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                Some information couldn't be automatically extracted. The AI will ask for missing details during the interview.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ResumeUpload;