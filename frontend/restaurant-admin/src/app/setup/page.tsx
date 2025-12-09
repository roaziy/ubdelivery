'use client'

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/header/Header";
import StepIndicator from "@/components/setup/StepIndicator";
import Step1Images from "@/components/setup/Step1Images";
import Step2Hours from "@/components/setup/Step2Hours";
import Step3Bank from "@/components/setup/Step3Bank";
import Step4Success from "@/components/setup/Step4Success";

interface SetupData {
    profileImage: string | null;
    bannerImage: string | null;
    is24Hours: boolean | null;
    openTime: string;
    closeTime: string;
    bankAccount: string;
}

export default function SetupPage() {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [setupData, setSetupData] = useState<SetupData>({
        profileImage: null,
        bannerImage: null,
        is24Hours: null,
        openTime: "",
        closeTime: "",
        bankAccount: ""
    });

    useEffect(() => {
        // Check if admin is logged in
        const loggedIn = sessionStorage.getItem('adminLoggedIn');
        if (!loggedIn) {
            router.push('/');
            return;
        }
        
        // Check if setup is already completed
        const setupCompleted = sessionStorage.getItem('setupCompleted');
        if (setupCompleted) {
            router.push('/dashboard');
            return;
        }
        
        setIsLoggedIn(true);
    }, [router]);

    const handleComplete = () => {
        // Save setup data (in real app, send to API)
        sessionStorage.setItem('setupCompleted', 'true');
        sessionStorage.setItem('restaurantData', JSON.stringify(setupData));
        
        // Navigate to dashboard
        router.push('/dashboard');
    };

    const getStepTitle = () => {
        switch (currentStep) {
            case 1: return "Алхам 1";
            case 2: return "Алхам 2";
            case 3: return "Алхам 3";
            case 4: return "Алхам дууслаа!";
            default: return "Алхам 1";
        }
    };

    if (!isLoggedIn) {
        return null;
    }

    return (
        <div className="min-h-screen bg-backgroundGreen flex flex-col">
            <Header />
            
            <main className="flex-1 py-8">
                <div className="container max-w-[1100px] mx-auto px-4">
                    {/* Step Indicator */}
                    <StepIndicator 
                        currentStep={currentStep} 
                        title={getStepTitle()} 
                    />

                    {/* Step Content */}
                    {currentStep === 1 && (
                        <Step1Images
                            profileImage={setupData.profileImage}
                            bannerImage={setupData.bannerImage}
                            onProfileChange={(image) => setSetupData(prev => ({ ...prev, profileImage: image }))}
                            onBannerChange={(image) => setSetupData(prev => ({ ...prev, bannerImage: image }))}
                            onNext={() => setCurrentStep(2)}
                        />
                    )}

                    {currentStep === 2 && (
                        <Step2Hours
                            is24Hours={setupData.is24Hours}
                            openTime={setupData.openTime}
                            closeTime={setupData.closeTime}
                            onIs24HoursChange={(value) => setSetupData(prev => ({ ...prev, is24Hours: value }))}
                            onOpenTimeChange={(value) => setSetupData(prev => ({ ...prev, openTime: value }))}
                            onCloseTimeChange={(value) => setSetupData(prev => ({ ...prev, closeTime: value }))}
                            onNext={() => setCurrentStep(3)}
                        />
                    )}

                    {currentStep === 3 && (
                        <Step3Bank
                            bankAccount={setupData.bankAccount}
                            onBankAccountChange={(value) => setSetupData(prev => ({ ...prev, bankAccount: value }))}
                            onNext={() => setCurrentStep(4)}
                        />
                    )}

                    {currentStep === 4 && (
                        <Step4Success onComplete={handleComplete} />
                    )}
                </div>
            </main>
        </div>
    );
}
