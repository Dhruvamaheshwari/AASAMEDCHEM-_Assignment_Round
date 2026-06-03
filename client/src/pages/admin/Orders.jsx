import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, DollarSign, Clock, CheckCircle2 } from 'lucide-react';
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

    const totalRevenue = orders.filter(o => o.status === 'CONFIRMED').reduce((acc, o) => acc + parseFloat(o.totalPrice), 0);
    const pendingQuotes = orders.filter(o => o.status === 'QUOTATION').length;
    const confirmedOrders = orders.filter(o => o.status === 'CONFIRMED').length;

    const getStatusStyle = (status) => {
        switch (status) {
            case 'CONFIRMED': return 'bg-success/10 text-success border-success/20';
            case 'QUOTATION': return 'bg-warning/10 text-warning border-warning/20';
            case 'PENDING': return 'bg-secondary/20 text-secondary-foreground border-secondary/20';
            default: return 'bg-primary/10 text-primary border-primary/20';
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-primary">Dispensation Orders</h2>
                <p className="text-muted-foreground mt-1">Monitor active prescriptions and wholesale fulfillment.</p>
            </div>

            {/* Analytics Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
                        <DollarSign className="w-6 h-6 text-success" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Revenue (Confirmed)</p>
                        <h3 className="text-2xl font-bold tracking-tight">${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
                    </div>
                </div>
                <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Confirmed Orders</p>
                        <h3 className="text-2xl font-bold tracking-tight">{confirmedOrders}</h3>
                    </div>
                </div>
                <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center">
                        <Clock className="w-6 h-6 text-warning" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Pending Quotations</p>
                        <h3 className="text-2xl font-bold tracking-tight">{pendingQuotes}</h3>
                    </div>
                </div>
            </div>

            <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
                <div className="p-4 border-b bg-muted/20 flex justify-between items-center">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                        <Activity className="w-5 h-5 text-primary" /> Recent Activity
                    </h3>
                </div>
                <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                        <thead className="[&_tr]:border-b bg-muted/50 text-muted-foreground">
                            <tr className="border-b transition-colors">
                                <th className="h-12 px-6 text-left align-middle font-semibold">Order Reference</th>
                                <th className="h-12 px-6 text-left align-middle font-semibold">Date Created</th>
                                <th className="h-12 px-6 text-left align-middle font-semibold">Client / Facility</th>
                                <th className="h-12 px-6 text-left align-middle font-semibold">Status</th>
                                <th className="h-12 px-6 text-right align-middle font-semibold">Total Price</th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center h-32 text-muted-foreground align-middle">No orders generated yet.</td>
                                </tr>
                            ) : orders.map((o, i) => (
                                <motion.tr 
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                                    key={o.id} className="border-b transition-colors hover:bg-muted/30"
                                >
                                    <td className="p-6 align-middle font-bold text-primary">#{o.id}</td>
                                    <td className="p-6 align-middle text-muted-foreground">{new Date(o.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</td>
                                    <td className="p-6 align-middle">
                                        <div className="font-semibold text-foreground">{o.user?.name}</div>
                                        <div className="text-xs text-muted-foreground mt-0.5">{o.user?.email}</div>
                                    </td>
                                    <td className="p-6 align-middle">
                                        <div className={`inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-bold transition-colors ${getStatusStyle(o.status)}`}>
                                            {o.status}
                                        </div>
                                    </td>
                                    <td className="p-6 align-middle text-right font-bold text-base">
                                        ${parseFloat(o.totalPrice).toFixed(2)}
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
}
