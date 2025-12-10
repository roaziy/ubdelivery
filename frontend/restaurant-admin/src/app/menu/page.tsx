'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import MenuContent from "@/components/menu/MenuContent";
import { PageLoadingSkeleton } from "@/components/ui/Skeleton";

export default function MenuPage() {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const loggedIn = sessionStorage.getItem('adminLoggedIn');
        if (!loggedIn) {
            router.push('/');
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
            <MenuContent />
        </DashboardLayout>
    );
}

