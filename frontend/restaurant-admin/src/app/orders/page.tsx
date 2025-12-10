'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import OrdersContent from "@/components/orders/OrdersContent";
import { PageLoadingSkeleton } from "@/components/ui/Skeleton";

export default function OrdersPage() {
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
            <OrdersContent />
        </DashboardLayout>
    );
}
