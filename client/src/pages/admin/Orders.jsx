import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../utils/api';

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await api.get('/api/orders');
                setOrders(res.data);
            } catch (error) {
                console.error('Failed to fetch orders', error);
            }
        };
        fetchOrders();
    }, []);

    const getStatusStyle = (status) => {
        switch (status) {
            case 'CONFIRMED': return 'bg-green-500 text-white hover:bg-green-600 border-transparent shadow';
            case 'QUOTATION': return 'bg-yellow-500 text-white hover:bg-yellow-600 border-transparent shadow';
            case 'PENDING': return 'bg-secondary text-secondary-foreground hover:bg-secondary/80 border-transparent';
            default: return 'bg-primary text-primary-foreground hover:bg-primary/80 border-transparent shadow';
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Orders Dashboard</h2>
                <p className="text-muted-foreground mt-1">View all platform orders and quotations.</p>
            </div>

            <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
                <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                        <thead className="[&_tr]:border-b bg-muted/50">
                            <tr className="border-b transition-colors hover:bg-muted/50/50">
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Order ID</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Customer</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Total Price</th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {orders.length === 0 ? (
                                <tr className="border-b transition-colors hover:bg-muted/50/50">
                                    <td colSpan={5} className="p-4 text-center h-24 text-muted-foreground align-middle">No orders found.</td>
                                </tr>
                            ) : orders.map(o => (
                                <tr key={o.id} className="border-b transition-colors hover:bg-muted/50">
                                    <td className="p-4 align-middle font-medium">#{o.id}</td>
                                    <td className="p-4 align-middle text-muted-foreground">{new Date(o.createdAt).toLocaleString()}</td>
                                    <td className="p-4 align-middle">
                                        <div className="font-medium">{o.user?.name}</div>
                                        <div className="text-xs text-muted-foreground">{o.user?.email}</div>
                                    </td>
                                    <td className="p-4 align-middle">
                                        <div className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${getStatusStyle(o.status)}`}>
                                            {o.status}
                                        </div>
                                    </td>
                                    <td className="p-4 align-middle text-right font-semibold">
                                        ${parseFloat(o.totalPrice).toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
}
