import { Question } from '../types';
import { SAMPLE_QUESTIONS, QUESTION_DIFFICULTIES } from '../utils/constants';
import { v4 as uuidv4 } from 'uuid';

// Mock AI service - in production, this would call actual AI APIs like OpenAI
export const aiService = {
  generateQuestions: async (resumeText: string): Promise<Question[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const questions: Question[] = [];
    
    // Generate questions for each difficulty level
    Object.entries(QUESTION_DIFFICULTIES).forEach(([difficulty, config]) => {
      const availableQuestions = SAMPLE_QUESTIONS[difficulty as keyof typeof SAMPLE_QUESTIONS];
      
      for (let i = 0; i < config.count; i++) {
        const randomIndex = Math.floor(Math.random() * availableQuestions.length);
        questions.push({
          id: uuidv4(),
          question: availableQuestions[randomIndex],
          difficulty: difficulty as 'Easy' | 'Medium' | 'Hard',
          timeLimit: config.timeLimit,
        });
      }
    });
    
    return questions;
  },

  evaluateAnswer: async (question: string, answer: string, timeSpent: number): Promise<{ score: number; feedback: string }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock evaluation logic - in production, this would use AI to evaluate
    const answerLength = answer.trim().length;
    const hasKeywords = /react|component|javascript|node|api|function|state|hook/i.test(answer);
    
    let baseScore = 5;
    
    // Adjust score based on answer length
    if (answerLength > 200) baseScore += 2;
    else if (answerLength > 100) baseScore += 1;
    else if (answerLength < 20) baseScore -= 2;
    
    // Adjust score based on keywords
    if (hasKeywords) baseScore += 1;
    
    // Adjust score based on time spent (bonus for using most of the time)
    const timeRatio = timeSpent / 60; // assume 60s average
    if (timeRatio > 0.7) baseScore += 0.5;
    
    // Add some randomness to simulate AI variability
    const randomAdjustment = (Math.random() - 0.5) * 2;
    const finalScore = Math.max(0, Math.min(10, baseScore + randomAdjustment));
    
    const score = Math.round(finalScore * 10) / 10;
    
    const feedback = generateFeedback(score, answerLength, hasKeywords);
    
    return { score, feedback };
  },

  generateFinalSummary: async (questions: Question[]): Promise<{ score: number; summary: string }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const answeredQuestions = questions.filter(q => q.score !== undefined);
    const totalScore = answeredQuestions.reduce((sum, q) => sum + q.score!, 0);
    const averageScore = totalScore / answeredQuestions.length;
    
    const score = Math.round(averageScore * 10) / 10;
    
    const summary = generateSummary(score, answeredQuestions);
    
    return { score, summary };
  }
};

const generateFeedback = (score: number, answerLength: number, hasKeywords: boolean): string => {
  const feedbacks = [];
  
  if (score >= 8) {
    feedbacks.push("Excellent answer!");
  } else if (score >= 6) {
    feedbacks.push("Good response with solid understanding.");
  } else if (score >= 4) {
    feedbacks.push("Fair answer, but could be improved.");
  } else {
    feedbacks.push("Needs improvement.");
  }
  
  if (answerLength < 20) {
    feedbacks.push("Consider providing more detailed explanations.");
  } else if (answerLength > 300) {
    feedbacks.push("Try to be more concise while maintaining depth.");
  }
  
  if (!hasKeywords) {
    feedbacks.push("Include more technical terms relevant to the question.");
  }
  
  return feedbacks.join(" ");
};

const generateSummary = (score: number, questions: Question[]): string => {
  const easyQuestions = questions.filter(q => q.difficulty === 'Easy');
  const mediumQuestions = questions.filter(q => q.difficulty === 'Medium');
  const hardQuestions = questions.filter(q => q.difficulty === 'Hard');
  
  const easyAvg = easyQuestions.reduce((sum, q) => sum + (q.score || 0), 0) / easyQuestions.length;
  const mediumAvg = mediumQuestions.reduce((sum, q) => sum + (q.score || 0), 0) / mediumQuestions.length;
  const hardAvg = hardQuestions.reduce((sum, q) => sum + (q.score || 0), 0) / hardQuestions.length;
  
  let summary = Overall Score: ${score}/10\n\n;
  
  if (score >= 8) {
    summary += "Outstanding performance! The candidate demonstrated excellent knowledge of React and Node.js concepts. ";
  } else if (score >= 6) {
    summary += "Good performance overall. The candidate shows solid understanding with room for improvement in some areas. ";
  } else if (score >= 4) {
    summary += "Average performance. The candidate has basic understanding but needs significant improvement. ";
  } else {
    summary += "Below expectations. The candidate needs substantial development in React and Node.js fundamentals. ";
  }
  
  summary += \n\nBreakdown:\n;
  summary += • Easy Questions: ${easyAvg.toFixed(1)}/10\n;
  summary += • Medium Questions: ${mediumAvg.toFixed(1)}/10\n;
  summary += • Hard Questions: ${hardAvg.toFixed(1)}/10;
  
  return summary;
};