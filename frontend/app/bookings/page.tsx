'use client';

import { useAuth } from '@/app/context/auth-context';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/app/components/ui/button";
import { Plus } from 'lucide-react';
import BookingList from '@/app/components/Bookings/BookingList';
import BookingChart from '@/app/components/Bookings/BookingChart';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/app/components/ui/tabs";

export default function BookingsView() {
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/auth');
        }
    }, [isAuthenticated, router]);

    if (!isAuthenticated) {
        return null; // Don't render anything while redirecting
    }

    return (
        <div className="container mx-auto py-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Your Bookings</h1>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
                <Tabs defaultValue="list" className="w-full">
                    <TabsList>
                        <TabsTrigger value="list">List</TabsTrigger>
                        <TabsTrigger value="chart">Chart</TabsTrigger>
                    </TabsList>
                    <TabsContent value="list">
                        <BookingList />
                    </TabsContent>
                    <TabsContent value="chart">
                        <BookingChart />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}