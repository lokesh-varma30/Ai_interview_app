export const QUESTION_DIFFICULTIES = {
  Easy: { timeLimit: 20, count: 2 },
  Medium: { timeLimit: 60, count: 2 },
  Hard: { timeLimit: 120, count: 2 },
} as const;

export const TOTAL_QUESTIONS = 6;

export const SAMPLE_QUESTIONS = {
  Easy: [
    "What is the difference between let, const, and var in JavaScript?",
    "Explain the concept of props in React components.",
    "What is the purpose of the useState hook in React?",
    "How do you handle events in React?",
    "What is the difference between null and undefined in JavaScript?"
  ],
  Medium: [
    "Explain the React component lifecycle methods and their purposes.",
    "How would you optimize a React application's performance?",
    "Describe the differences between REST and GraphQL APIs.",
    "How do you handle state management in a large React application?",
    "Explain the concept of middleware in Express.js and provide an example."
  ],
  Hard: [
    "Design and implement a custom React hook for handling complex async operations with caching.",
    "How would you implement server-side rendering (SSR) in a React application and what are the trade-offs?",
    "Explain the event loop in Node.js and how it handles asynchronous operations.",
    "Design a scalable microservices architecture for an e-commerce platform.",
    "How would you implement real-time communication between multiple clients in a Node.js application?"
  ]
};

export const STORAGE_KEYS = {
  INTERVIEW_STATE: 'interviewAssistant_interviewState',
  CANDIDATES: 'interviewAssistant_candidates',
  UI_STATE: 'interviewAssistant_uiState',
} as const;