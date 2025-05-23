"use client"

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAuth } from '@/app/context/auth-context';

interface Booking {
    _id: string;
    event: {
      _id: string;
      title: string;
      price: number;
    };
    user: {
      _id: string;
      email: string;
    };
    createdAt: string;
}

interface PriceCategory {
    name: string;
    count: number;
    totalValue: number;
}

export default function BookingChart() {
    const { token, userId } = useAuth();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [chartData, setChartData] = useState<PriceCategory[]>([]);

    useEffect(() => {
        const fetchBookingsData = async () => {
            if (!token) return;
            
            try {
                // First fetch all events to get their details
                const eventsResponse = await fetch('http://localhost:8000/graphql', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        query: `
                            query {
                                events {
                                    _id
                                    title
                                    price
                                }
                            }
                        `
                    }),
                });
                
                const eventsData = await eventsResponse.json();
                
                if (eventsData.errors) {
                    throw new Error('Failed to load events data');
                }
                
                // Create a map of events for quick lookup
                const eventsMap: Record<string, any> = {};
                eventsData.data.events.forEach((event: any) => {
                    eventsMap[event._id] = event;
                });
                
                // Get user bookings from localStorage
                const userBookings: Booking[] = [];
                const storedBookingsStr = localStorage.getItem('userBookings');
                
                if (storedBookingsStr) {
                    const storedBookings = JSON.parse(storedBookingsStr);
                    
                    storedBookings.forEach((booking: any) => {
                        if (booking && booking.event && eventsMap[booking.event._id]) {
                            const eventDetails = eventsMap[booking.event._id];
                            
                            userBookings.push({
                                _id: booking._id,
                                event: {
                                    _id: booking.event._id,
                                    title: booking.event.title || eventDetails.title,
                                    price: eventDetails.price || 0
                                },
                                user: booking.user || {
                                    _id: userId,
                                    email: 'you@example.com'
                                },
                                createdAt: booking.createdAt
                            });
                        }
                    });
                }
                
                setBookings(userBookings);
                processBookingsForChart(userBookings);
                
            } catch (err) {
                console.error('Error fetching booking data:', err);
            }
        };

        fetchBookingsData();
    }, [token, userId]);

    const processBookingsForChart = (bookings: Booking[]) => {
        const categories: Record<string, PriceCategory> = {
            'Cheap (0-100)': { name: 'Cheap (0-100)', count: 0, totalValue: 0 },
            'Medium (100-200)': { name: 'Medium (100-200)', count: 0, totalValue: 0 },
            'Expensive (200-500)': { name: 'Expensive (200-500)', count: 0, totalValue: 0 },
            'Luxury (above 500)': { name: 'Luxury (above 500)', count: 0, totalValue: 0 },
        };

        bookings.forEach(booking => {
            const price = booking.event?.price || 0;

            if (price <= 100) {
                categories['Cheap (0-100)'].count++;
                categories['Cheap (0-100)'].totalValue += price;
            } else if (price <= 200) {
                categories['Medium (100-200)'].count++;
                categories['Medium (100-200)'].totalValue += price;
            } else if (price <= 500) {
                categories['Expensive (200-500)'].count++;
                categories['Expensive (200-500)'].totalValue += price;
            } else {
                categories['Luxury (above 500)'].count++;
                categories['Luxury (above 500)'].totalValue += price;
            }
        });

        setChartData(Object.values(categories));
    };
    
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Booking Distribution by Price Range</h2>
            
            {bookings.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    No bookings available to display chart
                </div>
            ) : (
                <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip 
                                formatter={(value, name) => {
                                    return name === 'count' ? 
                                        [`${value} bookings`, 'Number of Bookings'] : 
                                        [`$${value}`, 'Total Value'];
                                }}
                            />
                            <Legend />
                            <Bar dataKey="count" name="Number of Bookings" fill="#8884d8" />
                            <Bar dataKey="totalValue" name="Total Value ($)" fill="#82ca9d" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {chartData.map((category) => (
                    <div key={category.name} className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-medium">{category.name}</h3>
                        <p className="text-2xl font-bold">{category.count}</p>
                        <p className="text-sm text-gray-500">Total value: ${category.totalValue}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}