import { format } from 'date-fns';

export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return ${minutes}:${remainingSeconds.toString().padStart(2, '0')};
};

export const formatDate = (dateString: string): string => {
  return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
};

export const getScoreColor = (score: number): string => {
  if (score >= 8) return 'text-green-600';
  if (score >= 6) return 'text-yellow-600';
  if (score >= 4) return 'text-orange-600';
  return 'text-red-600';
};

export const getScoreBadgeColor = (score: number): string => {
  if (score >= 8) return 'bg-green-100 text-green-800';
  if (score >= 6) return 'bg-yellow-100 text-yellow-800';
  if (score >= 4) return 'bg-orange-100 text-orange-800';
  return 'bg-red-100 text-red-800';
};

export const calculateFinalScore = (questions: any[]): number => {
  const answeredQuestions = questions.filter(q => q.score !== undefined);
  if (answeredQuestions.length === 0) return 0;
  
  const totalScore = answeredQuestions.reduce((sum, q) => sum + q.score, 0);
  return Math.round((totalScore / answeredQuestions.length) * 10) / 10;
};

export const extractEmailFromText = (text: string): string | undefined => {
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
  const match = text.match(emailRegex);
  return match ? match[0] : undefined;
};

export const extractPhoneFromText = (text: string): string | undefined => {
  const phoneRegex = /(\+?1?[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/;
  const match = text.match(phoneRegex);
  return match ? match[0] : undefined;
};

export const extractNameFromText = (text: string): string | undefined => {
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  // Try to find the first line that looks like a name (2-4 words, proper case)
  for (const line of lines.slice(0, 5)) {
    const words = line.split(/\s+/);
    if (words.length >= 2 && words.length <= 4) {
      const isLikelyName = words.every(word => 
        word.length > 1 && 
        word[0] === word[0].toUpperCase() &&
        !/[0-9@]/.test(word) &&
        word.length < 20
      );
      if (isLikelyName) {
        return line;
      }
    }
  }
  
  return undefined;
};