'use client'

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { restaurantService } from "@/lib/services";
import StepIndicator from "./StepIndicator";
import Step1Images from "./Step1Images";
import Step2Hours from "./Step2Hours";
import Step3Bank from "./Step3Bank";
import Step4Success from "./Step4Success";
import { Skeleton } from "@/components/ui/Skeleton";
import { useNotifications } from "@/components/ui/Notification";

interface SetupData {
  profileImage: string | null;
  bannerImage: string | null;
  profileFile: File | null;
  bannerFile: File | null;
  is24Hours: boolean | null;
  openTime: string;
  closeTime: string;
  bankAccount: string;
}

const initialSetupData: SetupData = {
  profileImage: null,
  bannerImage: null,
  profileFile: null,
  bannerFile: null,
  is24Hours: null,
  openTime: "",
  closeTime: "",
  bankAccount: "",
};

export default function SetupContent() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const notifications = useNotifications();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [setupData, setSetupData] = useState<SetupData>(initialSetupData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkingSetup, setCheckingSetup] = useState(true);

  // Check auth and setup status
  useEffect(() => {
    const checkSetupStatus = async () => {
      if (authLoading) return;
      
      if (!isAuthenticated) {
        router.push('/');
        return;
      }

      try {
        // Check if setup is already completed
        const response = await restaurantService.getSetupStatus();
        if (response.success && response.data?.completed) {
          router.push('/dashboard');
          return;
        }
      } catch {
        // If API fails, check session storage fallback
        const setupCompleted = sessionStorage.getItem('setupCompleted');
        if (setupCompleted) {
          router.push('/dashboard');
          return;
        }
      }
      
      setCheckingSetup(false);
    };

    checkSetupStatus();
  }, [isAuthenticated, authLoading, router]);

  const handleProfileChange = useCallback((image: string | null) => {
    setSetupData(prev => ({ ...prev, profileImage: image }));
  }, []);

  const handleBannerChange = useCallback((image: string | null) => {
    setSetupData(prev => ({ ...prev, bannerImage: image }));
  }, []);

  const handleIs24HoursChange = useCallback((value: boolean | null) => {
    setSetupData(prev => ({ ...prev, is24Hours: value }));
  }, []);

  const handleOpenTimeChange = useCallback((value: string) => {
    setSetupData(prev => ({ ...prev, openTime: value }));
  }, []);

  const handleCloseTimeChange = useCallback((value: string) => {
    setSetupData(prev => ({ ...prev, closeTime: value }));
  }, []);

  const handleBankAccountChange = useCallback((value: string) => {
    setSetupData(prev => ({ ...prev, bankAccount: value }));
  }, []);

  const handleComplete = useCallback(async () => {
    setIsSubmitting(true);

    try {
      // Submit setup data to API
      await restaurantService.completeSetup({
        is24Hours: setupData.is24Hours,
        openTime: setupData.openTime,
        closeTime: setupData.closeTime,
        bankAccount: setupData.bankAccount,
      });

      // Upload images if provided
      if (setupData.profileFile) {
        await restaurantService.uploadLogo(setupData.profileFile);
      }
      if (setupData.bannerFile) {
        await restaurantService.uploadBanner(setupData.bannerFile);
      }

      // Mark setup as completed in session storage (fallback)
      sessionStorage.setItem('setupCompleted', 'true');
      sessionStorage.setItem('restaurantData', JSON.stringify(setupData));

      notifications.success(
        "Амжилттай!",
        "Тохиргоо амжилттай дууслаа"
      );

      // Navigate to dashboard
      router.push('/dashboard');
    } catch (err) {
      notifications.error(
        "Алдаа гарлаа",
        err instanceof Error ? err.message : "Тохиргоо хадгалахад алдаа гарлаа"
      );
      setIsSubmitting(false);
    }
  }, [setupData, router, notifications]);

  const getStepTitle = useCallback(() => {
    switch (currentStep) {
      case 1: return "Алхам 1";
      case 2: return "Алхам 2";
      case 3: return "Алхам 3";
      case 4: return "Алхам дууслаа!";
      default: return "Алхам 1";
    }
  }, [currentStep]);

  // Loading state while checking auth/setup
  if (authLoading || checkingSetup) {
    return (
      <div className="container max-w-[1100px] mx-auto px-4 py-8">
        {/* Step indicator skeleton */}
        <div className="flex items-center justify-center gap-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="w-10 h-10 rounded-full" />
              {i < 4 && <Skeleton className="w-16 h-1" />}
            </div>
          ))}
        </div>
        
        {/* Content skeleton */}
        <div className="bg-white rounded-2xl p-8">
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="grid grid-cols-2 gap-8">
            <Skeleton className="h-48 rounded-xl" />
            <Skeleton className="h-48 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
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
          onProfileChange={handleProfileChange}
          onBannerChange={handleBannerChange}
          onNext={() => setCurrentStep(2)}
        />
      )}

      {currentStep === 2 && (
        <Step2Hours
          is24Hours={setupData.is24Hours}
          openTime={setupData.openTime}
          closeTime={setupData.closeTime}
          onIs24HoursChange={handleIs24HoursChange}
          onOpenTimeChange={handleOpenTimeChange}
          onCloseTimeChange={handleCloseTimeChange}
          onNext={() => setCurrentStep(3)}
        />
      )}

      {currentStep === 3 && (
        <Step3Bank
          bankAccount={setupData.bankAccount}
          onBankAccountChange={handleBankAccountChange}
          onNext={() => setCurrentStep(4)}
        />
      )}

      {currentStep === 4 && (
        <Step4Success 
          onComplete={handleComplete}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
}
