import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Clock, AlertCircle } from 'lucide-react';
import { RootState } from '../../store';
import { updateTimer } from '../../store/slices/interviewSlice';
import { formatTime } from '../../utils/helpers';

const Timer: React.FC = () => {
  const dispatch = useDispatch();
  const { timeRemaining, isQuestionActive } = useSelector((state: RootState) => state.interview);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isQuestionActive && timeRemaining > 0) {
      interval = setInterval(() => {
        dispatch(updateTimer());
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isQuestionActive, timeRemaining, dispatch]);

  if (!isQuestionActive && timeRemaining === 0) {
    return null;
  }

  const isWarning = timeRemaining <= 30;
  const isCritical = timeRemaining <= 10;

  return (
    <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg border ${
      isCritical 
        ? 'bg-red-50 border-red-200 text-red-700'
        : isWarning 
        ? 'bg-yellow-50 border-yellow-200 text-yellow-700'
        : 'bg-blue-50 border-blue-200 text-blue-700'
    }`}>
      {isCritical ? (
        <AlertCircle className="w-5 h-5 animate-pulse" />
      ) : (
        <Clock className="w-5 h-5" />
      )}
      <span className={`font-mono text-lg font-semibold ${
        isCritical ? 'animate-pulse' : ''
      }`}>
        {formatTime(timeRemaining)}
      </span>
      <span className="text-sm">
        {isCritical ? 'Time almost up!' : 'remaining'}
      </span>
    </div>
  );
};

export default Timer;