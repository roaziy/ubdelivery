'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";

interface SettingsTabsProps {
    activeTab: 'settings' | 'history' | 'terms';
    onTabChange: (tab: 'settings' | 'history' | 'terms') => void;
}

export default function SettingsTabs({ activeTab, onTabChange }: SettingsTabsProps) {
    return (
        <div className="flex flex-wrap justify-center gap-2 mb-8">
            <button
                onClick={() => onTabChange('settings')}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-colors ${
                    activeTab === 'settings'
                        ? 'bg-mainGreen text-white'
                        : 'bg-[#D8D9D7] text-gray-700 hover:bg-[#C0C1BF]'
                }`}
            >
                Тохиргоо
            </button>
            <button
                onClick={() => onTabChange('history')}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-colors ${
                    activeTab === 'history'
                        ? 'bg-mainGreen text-white'
                        : 'bg-[#D8D9D7] text-gray-700 hover:bg-[#C0C1BF]'
                }`}
            >
                Түүх
            </button>
            <button
                onClick={() => onTabChange('terms')}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-colors ${
                    activeTab === 'terms'
                        ? 'bg-mainGreen text-white'
                        : 'bg-[#D8D9D7] text-gray-700 hover:bg-[#C0C1BF]'
                }`}
            >
                Үйлчилгээний нөхцөл
            </button>
        </div>
    );
}
