'use client'

interface ToggleSwitchProps {
    isOn: boolean;
    onToggle: () => void;
    size?: 'sm' | 'md';
}

export default function ToggleSwitch({ isOn, onToggle, size = 'md' }: ToggleSwitchProps) {
    const sizeClasses = {
        sm: { track: 'w-10 h-5', thumb: 'w-3 h-3 top-1', offset: 'right-1', offsetOff: 'left-1' },
        md: { track: 'w-12 h-6', thumb: 'w-4 h-4 top-1', offset: 'right-1', offsetOff: 'left-1' },
    };

    const { track, thumb, offset, offsetOff } = sizeClasses[size];

    return (
        <button
            type="button"
            onClick={onToggle}
            className={`${track} rounded-full transition-colors relative ${
                isOn ? 'bg-mainGreen' : 'bg-gray-300'
            }`}
        >
            <span 
                className={`absolute ${thumb} bg-white rounded-full transition-all ${
                    isOn ? offset : offsetOff
                }`} 
            />
        </button>
    );
}
