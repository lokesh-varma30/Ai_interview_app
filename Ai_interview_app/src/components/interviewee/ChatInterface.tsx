import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Send, User, Bot } from 'lucide-react';
import { RootState } from '../../store';
import { updateCandidateInfo, startInterview, startQuestion } from '../../store/slices/interviewSlice';

const ChatInterface: React.FC = () => {
  const dispatch = useDispatch();
  const { currentCandidate, extractedData } = useSelector((state: RootState) => state.interview);
  
  const [currentStep, setCurrentStep] = useState<'name' | 'email' | 'phone' | 'ready'>('name');
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Array<{
    type: 'bot' | 'user';
    content: string;
    timestamp: Date;
  }>>([]);

  useEffect(() => {
    if (extractedData) {
      // Check what information is missing and start the conversation
      const missingInfo = [];
      if (!extractedData.name) missingInfo.push('name');
      if (!extractedData.email) missingInfo.push('email');
      if (!extractedData.phone) missingInfo.push('phone');

      if (missingInfo.length === 0) {
        // All info available, can start interview
        setMessages([{
          type: 'bot',
          content: Hello ${extractedData.name}! I've successfully extracted your information from your resume. Are you ready to begin the interview?,
          timestamp: new Date()
        }]);
        setCurrentStep('ready');
      } else {
        // Ask for missing information
        setMessages([{
          type: 'bot',
          content: Hello! I've processed your resume but need some additional information. Let's start with your ${missingInfo[0]}.,
          timestamp: new Date()
        }]);
        setCurrentStep(missingInfo[0] as any);
      }
    }
  }, [extractedData]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // Add user message
    const newUserMessage = {
      type: 'user' as const,
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMessage]);

    // Process the input based on current step
    if (currentStep === 'name') {
      dispatch(updateCandidateInfo({ name: inputValue }));
      
      const nextStep = !extractedData?.email ? 'email' : !extractedData?.phone ? 'phone' : 'ready';
      
      setTimeout(() => {
        setMessages(prev => [...prev, {
          type: 'bot',
          content: nextStep === 'ready' 
            ? Great! Now I have all your information. Are you ready to begin the interview?
            : Thanks ${inputValue}! Now, what's your ${nextStep} address?,
          timestamp: new Date()
        }]);
        setCurrentStep(nextStep as any);
      }, 500);
    } 
    else if (currentStep === 'email') {
      dispatch(updateCandidateInfo({ email: inputValue }));
      
      const nextStep = !extractedData?.phone ? 'phone' : 'ready';
      
      setTimeout(() => {
        setMessages(prev => [...prev, {
          type: 'bot',
          content: nextStep === 'ready'
            ? Perfect! Now I have all your information. Are you ready to begin the interview?
            : Great! And what's your phone number?,
          timestamp: new Date()
        }]);
        setCurrentStep(nextStep as any);
      }, 500);
    }
    else if (currentStep === 'phone') {
      dispatch(updateCandidateInfo({ phone: inputValue }));
      
      setTimeout(() => {
        setMessages(prev => [...prev, {
          type: 'bot',
          content: Excellent! Now I have all your information. Are you ready to begin the interview?,
          timestamp: new Date()
        }]);
        setCurrentStep('ready');
      }, 500);
    }
    else if (currentStep === 'ready') {
      if (inputValue.toLowerCase().includes('yes') || inputValue.toLowerCase().includes('ready')) {
        setTimeout(() => {
          setMessages(prev => [...prev, {
            type: 'bot',
            content: Great! Let's start your React/Node.js interview. You'll answer 6 questions of varying difficulty. Good luck!,
            timestamp: new Date()
          }]);
          
          // Start the interview after a brief delay
          setTimeout(() => {
            dispatch(startInterview());
            dispatch(startQuestion());
          }, 2000);
        }, 500);
      } else {
        setTimeout(() => {
          setMessages(prev => [...prev, {
            type: 'bot',
            content: No problem! Take your time. Just let me know when you're ready to start by typing "yes" or "ready".,
            timestamp: new Date()
          }]);
        }, 500);
      }
    }

    setInputValue('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getPlaceholder = () => {
    switch (currentStep) {
      case 'name': return 'Enter your full name...';
      case 'email': return 'Enter your email address...';
      case 'phone': return 'Enter your phone number...';
      case 'ready': return 'Type "yes" when you\'re ready to start...';
      default: return 'Type your message...';
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4">
        <div className="flex items-center space-x-3">
          <div className="bg-white bg-opacity-20 rounded-full p-2">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">AI Assistant</h2>
            <p className="text-blue-100 text-sm">Let's collect your information</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="h-96 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}}
          >
            <div className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${
              message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}>
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                message.type === 'user' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {message.type === 'user' ? (
                  <User className="w-4 h-4" />
                ) : (
                  <Bot className="w-4 h-4" />
                )}
              </div>
              <div className={`rounded-lg px-4 py-2 ${
                message.type === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}>
                <p className="text-sm">{message.content}</p>
                <p className={`text-xs mt-1 ${
                  message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={getPlaceholder()}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;