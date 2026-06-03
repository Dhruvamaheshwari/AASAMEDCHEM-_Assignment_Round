import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, PackageCheck } from 'lucide-react';
import api from '../../utils/api';

export default function MyQuotations() {
    const [quotations, setQuotations] = useState([]);
    const [orders, setOrders] = useState([]);
    const [isPlacing, setIsPlacing] = useState(null);

    const fetchQuotations = async () => {
        try {
            const res = await api.get('/api/orders/my-quotations');
            setQuotations(res.data);
        } catch (error) {
            console.error('Failed to fetch quotations', error);
        }
    };

    const fetchOrders = async () => {
        try {
            const res = await api.get('/api/orders/my-orders');
            setOrders(res.data);
        } catch (error) {
            console.error('Failed to fetch orders', error);
        }
    };

    useEffect(() => {
        fetchQuotations();
        fetchOrders();
    }, []);

    const handlePlaceOrder = async (id) => {
        setIsPlacing(id);
        try {
            await api.post(`/api/orders/${id}/place`);
            fetchQuotations();
            fetchOrders();
        } catch (error) {
            console.error('Failed to place order', error);
            alert(error.response?.data?.error || 'Failed to place order (check stock).');
        } finally {
            setIsPlacing(null);
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Order Management</h2>
                <p className="text-muted-foreground mt-1">Review your pending quotes and track confirmed orders.</p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
                {/* Quotations List */}
                <div className="rounded-xl border bg-card text-card-foreground shadow-sm border-warning/20">
                    <div className="flex flex-col space-y-1.5 p-6 bg-warning/5 rounded-t-xl border-b pb-4">
                        <h3 className="text-xl font-semibold leading-none tracking-tight flex items-center gap-2">
                            <Clock className="w-5 h-5 text-yellow-500" />
                            Pending Quotations
                        </h3>
                        <p className="text-sm text-muted-foreground">Awaiting your confirmation to fulfill stock.</p>
                    </div>
                    <div className="relative w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm">
                            <thead className="[&_tr]:border-b bg-muted/50">
                                <tr className="border-b transition-colors hover:bg-muted/50/50">
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">ID</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Total Price</th>
                                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Action</th>
                                </tr>
                            </thead>
                            <tbody className="[&_tr:last-child]:border-0">
                                {quotations.length === 0 ? (
                                    <tr className="border-b transition-colors hover:bg-muted/50/50">
                                        <td colSpan={3} className="p-4 text-center h-24 text-muted-foreground align-middle">No pending quotations.</td>
                                    </tr>
                                ) : (
                                    quotations.map(q => (
                                        <tr key={q.id} className="border-b transition-colors hover:bg-muted/50">
                                            <td className="p-4 align-middle font-medium">#{q.id}</td>
                                            <td className="p-4 align-middle font-semibold">${parseFloat(q.totalPrice).toFixed(2)}</td>
                                            <td className="p-4 align-middle text-right">
                                                <button 
                                                    onClick={() => handlePlaceOrder(q.id)}
                                                    disabled={isPlacing === q.id}
                                                    className="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-3 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50"
                                                >
                                                    {isPlacing === q.id ? "Processing..." : (
                                                        <><CheckCircle2 className="w-4 h-4 mr-1" /> Place Order</>
                                                    )}
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Confirmed Orders List */}
                <div className="rounded-xl border bg-card text-card-foreground shadow-sm border-success/20">
                    <div className="flex flex-col space-y-1.5 p-6 bg-success/5 rounded-t-xl border-b pb-4">
                        <h3 className="text-xl font-semibold leading-none tracking-tight flex items-center gap-2">
                            <PackageCheck className="w-5 h-5 text-green-500" />
                            Confirmed Orders
                        </h3>
                        <p className="text-sm text-muted-foreground">Orders successfully allocated and processed.</p>
                    </div>
                    <div className="relative w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm">
                            <thead className="[&_tr]:border-b bg-muted/50">
                                <tr className="border-b transition-colors hover:bg-muted/50/50">
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Order ID</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Total Price</th>
                                </tr>
                            </thead>
                            <tbody className="[&_tr:last-child]:border-0">
                                {orders.length === 0 ? (
                                    <tr className="border-b transition-colors hover:bg-muted/50/50">
                                        <td colSpan={3} className="p-4 text-center h-24 text-muted-foreground align-middle">No confirmed orders.</td>
                                    </tr>
                                ) : (
                                    orders.map(o => (
                                        <tr key={o.id} className="border-b transition-colors hover:bg-muted/50">
                                            <td className="p-4 align-middle font-medium">#{o.id}</td>
                                            <td className="p-4 align-middle">
                                                <div className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold bg-green-500 text-white shadow">
                                                    {o.status}
                                                </div>
                                            </td>
                                            <td className="p-4 align-middle text-right font-semibold">
                                                ${parseFloat(o.totalPrice).toFixed(2)}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
