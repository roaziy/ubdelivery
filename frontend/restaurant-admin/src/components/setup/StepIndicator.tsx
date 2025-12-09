'use client'

interface StepIndicatorProps {
    currentStep: number;
    totalSteps?: number;
    title: string;
}

export default function StepIndicator({ currentStep, totalSteps = 4, title }: StepIndicatorProps) {
    return (
        <div className="text-center mb-8">
            <h1 className="text-xl font-bold mb-6">{title}</h1>
            
            <div className="flex items-center justify-center gap-0">
                {Array.from({ length: totalSteps }, (_, i) => {
                    const stepNum = i + 1;
                    const isCompleted = stepNum < currentStep;
                    const isCurrent = stepNum === currentStep;
                    
                    return (
                        <div key={stepNum} className="flex items-center">
                            {/* Step Circle */}
                            <div 
                                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-colors
                                    ${isCompleted || isCurrent 
                                        ? 'border-mainGreen text-mainGreen' 
                                        : 'border-gray-300 text-gray-400'
                                    }
                                `}
                            >
                                {stepNum}
                            </div>
                            
                            {/* Connector Line */}
                            {stepNum < totalSteps && (
                                <div 
                                    className={`w-16 md:w-24 h-0.5 transition-colors
                                        ${isCompleted ? 'bg-mainGreen' : 'bg-gray-300'}
                                    `}
                                />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
