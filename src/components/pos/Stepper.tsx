import React from 'react';

interface StepperProps {
  steps: string[];
  activeIndex: number;
  onStepClick?: (index: number) => void;
}

const Stepper: React.FC<StepperProps> = ({ steps, activeIndex, onStepClick }) => {
  return (
    <ol className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6">
      {steps.map((label, idx) => {
        const active = idx === activeIndex;
        const completed = idx < activeIndex;
        return (
          <li key={idx} className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onStepClick && onStepClick(idx)}
              className={[
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
                completed && 'bg-green-100 text-green-700 border border-green-200',
                active && !completed && 'bg-blue-600 text-white',
                !active && !completed && 'bg-gray-100 text-gray-600'
              ].filter(Boolean).join(' ')}
            >
              {completed ? '✓' : idx + 1}
            </button>
            <span className={[
              'text-sm font-medium',
              active ? 'text-gray-900' : 'text-gray-600'
            ].join(' ')}>
              {label}
            </span>
          </li>
        );
      })}
    </ol>
  );
};

export default Stepper;
