'use client'

interface Step3BankProps {
    bankAccount: string;
    onBankAccountChange: (value: string) => void;
    onNext: () => void;
}

export default function Step3Bank({ 
    bankAccount, 
    onBankAccountChange, 
    onNext 
}: Step3BankProps) {
    
    const canProceed = bankAccount.length > 0;

    // Mask the bank account for display (show first 2 chars, rest as asterisks)
    const getMaskedAccount = (account: string) => {
        if (account.length <= 2) return account;
        return account.slice(0, 2) + '*'.repeat(account.length - 2);
    };

    return (
        <div className="flex flex-col min-h-[500px]">
            <div className="flex-1 flex flex-col items-center justify-center max-w-[500px] mx-auto w-full">
                {/* Title */}
                <p className="text-center font-medium mb-8">
                    Компаний дансаа оруулна уу...
                </p>

                {/* Bank Account Input */}
                <div className="w-full">
                    <label className="block text-center text-sm font-medium mb-2">
                        Данс
                    </label>
                    <input
                        type="text"
                        value={bankAccount}
                        onChange={(e) => onBankAccountChange(e.target.value)}
                        placeholder="MN76002600160516..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-full text-center outline-none focus:border-mainGreen transition-colors"
                    />
                </div>
            </div>

            {/* Next Button */}
            <div className="flex justify-center mt-8">
                <button
                    onClick={onNext}
                    disabled={!canProceed}
                    className={`px-8 py-3 rounded-full font-medium transition-colors
                        ${canProceed 
                            ? 'bg-mainGreen text-white hover:bg-green-600' 
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }
                    `}
                >
                    Үргэлжүүлэх
                </button>
            </div>
        </div>
    );
}
