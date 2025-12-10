'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DashboardContent from "@/components/dashboard/DashboardContent";
import { PageLoadingSkeleton } from "@/components/ui/Skeleton";

export default function DashboardPage() {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const loggedIn = sessionStorage.getItem('adminLoggedIn');
        if (!loggedIn) {
            router.push('/');
            return;
        }
        
        const setupCompleted = sessionStorage.getItem('setupCompleted');
        if (!setupCompleted) {
            router.push('/setup');
            return;
        }
        
        setIsLoggedIn(true);
        setIsChecking(false);
    }, [router]);

    if (isChecking) {
        return (
            <DashboardLayout>
                <PageLoadingSkeleton />
            </DashboardLayout>
        );
    }

    if (!isLoggedIn) {
        return null;
    }

    return (
        <DashboardLayout>
            <DashboardContent />
        </DashboardLayout>
    );
}
