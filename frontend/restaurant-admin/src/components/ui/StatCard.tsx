'use client'

interface StatCardProps {
    title: string;
    value: number | string;
    change?: number;
    isCurrency?: boolean;
    subtitle?: string;
    valueColor?: string;
}

export default function StatCard({ 
    title, 
    value, 
    change, 
    isCurrency = true,
    subtitle,
    valueColor = 'text-mainBlack'
}: StatCardProps) {
    const isPositive = change !== undefined && change >= 0;
    
    const formattedValue = typeof value === 'number' 
        ? (isCurrency ? `${value.toLocaleString()}₮` : value.toLocaleString())
        : value;
    
    return (
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
            <p className="text-sm text-gray-500 mb-1">{title}</p>
            <p className={`text-2xl font-bold ${valueColor}`}>
                {formattedValue}
            </p>
            {change !== undefined && (
                <p className={`text-xs ${isPositive ? 'text-mainGreen' : 'text-red-500'}`}>
                    {isPositive ? '+' : ''}{change}%
                </p>
            )}
            {subtitle && (
                <p className="text-xs text-gray-500">{subtitle}</p>
            )}
        </div>
    );
}
