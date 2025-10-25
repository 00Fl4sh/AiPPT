import React from 'react';
import { CheckCircle, Circle, Loader2 } from 'lucide-react';

interface StepByStepProgressProps {
  currentStep: number;
  totalSteps: number;
  currentSlide?: {
    title: string;
    type: string;
  };
  isComplete: boolean;
}

const StepByStepProgress: React.FC<StepByStepProgressProps> = ({
  currentStep,
  totalSteps,
  currentSlide,
  isComplete
}) => {
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-700">
          {isComplete ? 'Presentation Complete!' : 'Generating Presentation...'}
        </h3>
        <span className="text-xs text-gray-500">
          {currentStep} of {totalSteps} slides
        </span>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      
      {/* Current Slide Info */}
      {currentSlide && !isComplete && (
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
          <span>Creating: {currentSlide.title}</span>
        </div>
      )}
      
      {/* Step Indicators */}
      <div className="flex space-x-2 mt-3">
        {Array.from({ length: totalSteps }, (_, index) => (
          <div key={index} className="flex items-center">
            {index < currentStep ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : index === currentStep - 1 && !isComplete ? (
              <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
            ) : (
              <Circle className="w-5 h-5 text-gray-300" />
            )}
          </div>
        ))}
      </div>
      
      {isComplete && (
        <div className="mt-3 text-sm text-green-600 font-medium">
          ✅ All slides generated successfully!
        </div>
      )}
    </div>
  );
};

export default StepByStepProgress;
