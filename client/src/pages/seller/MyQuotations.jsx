import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Clock, PackageCheck, Truck, ShieldAlert } from 'lucide-react';
import api from '../../utils/api';

export default function MyQuotations() {
    const [quotations, setQuotations] = useState([]);
    const [orders, setOrders] = useState([]);
    const [isPlacing, setIsPlacing] = useState(null);
    const [activeTab, setActiveTab] = useState('quotations'); // 'quotations' | 'orders'

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
            setActiveTab('orders'); // Auto-switch to orders tab
        } catch (error) {
            console.error('Failed to place order', error);
            alert(error.response?.data?.error || 'Failed to authorize dispensation (check stock).');
        } finally {
            setIsPlacing(null);
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-primary">Dispensation Records</h2>
                    <p className="text-muted-foreground mt-1">Review pending pharmaceutical quotes and active shipments.</p>
                </div>
            </div>

            {/* Custom Tabs */}
            <div className="flex items-center space-x-2 border-b bg-background pb-0">
                <button
                    onClick={() => setActiveTab('quotations')}
                    className={`flex items-center gap-2 px-6 py-3 border-b-2 font-medium text-sm transition-all ${
                        activeTab === 'quotations' 
                        ? 'border-primary text-primary' 
                        : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30'
                    }`}
                >
                    <Clock className="w-4 h-4" />
                    Pending Quotes
                    <span className={`ml-2 inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-bold ${
                        activeTab === 'quotations' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                    }`}>
                        {quotations.length}
                    </span>
                </button>
                <button
                    onClick={() => setActiveTab('orders')}
                    className={`flex items-center gap-2 px-6 py-3 border-b-2 font-medium text-sm transition-all ${
                        activeTab === 'orders' 
                        ? 'border-success text-success' 
                        : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30'
                    }`}
                >
                    <PackageCheck className="w-4 h-4" />
                    Confirmed Orders
                    <span className={`ml-2 inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-bold ${
                        activeTab === 'orders' ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'
                    }`}>
                        {orders.length}
                    </span>
                </button>
            </div>

            <div className="pt-2">
                <AnimatePresence mode="wait">
                    {activeTab === 'quotations' ? (
                        <motion.div
                            key="quotations"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            transition={{ duration: 0.2 }}
                            className="rounded-xl border bg-card text-card-foreground shadow-sm border-warning/20 overflow-hidden"
                        >
                            <div className="relative w-full overflow-auto min-h-[300px]">
                                <table className="w-full caption-bottom text-sm">
                                    <thead className="[&_tr]:border-b bg-muted/30">
                                        <tr className="border-b transition-colors">
                                            <th className="h-12 px-6 text-left align-middle font-semibold text-muted-foreground">Reference ID</th>
                                            <th className="h-12 px-6 text-left align-middle font-semibold text-muted-foreground">Generated Date</th>
                                            <th className="h-12 px-6 text-left align-middle font-semibold text-muted-foreground">Total Valuation</th>
                                            <th className="h-12 px-6 text-right align-middle font-semibold text-muted-foreground">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="[&_tr:last-child]:border-0">
                                        {quotations.length === 0 ? (
                                            <tr>
                                                <td colSpan={4} className="p-12 text-center text-muted-foreground">
                                                    <ShieldAlert className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                                                    <p className="font-medium text-foreground text-lg">No Pending Quotes</p>
                                                    <p className="text-sm mt-1">You have no active requests awaiting authorization.</p>
                                                </td>
                                            </tr>
                                        ) : (
                                            quotations.map(q => (
                                                <tr key={q.id} className="border-b transition-colors hover:bg-muted/10">
                                                    <td className="p-6 align-middle font-bold text-primary">#{q.id}</td>
                                                    <td className="p-6 align-middle text-muted-foreground">{new Date(q.createdAt).toLocaleString(undefined, { dateStyle: 'medium' })}</td>
                                                    <td className="p-6 align-middle font-bold text-base">${parseFloat(q.totalPrice).toFixed(2)}</td>
                                                    <td className="p-6 align-middle text-right">
                                                        <button 
                                                            onClick={() => handlePlaceOrder(q.id)}
                                                            disabled={isPlacing === q.id}
                                                            className="inline-flex items-center justify-center rounded-lg text-sm font-bold h-10 px-5 bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-md hover:shadow-lg disabled:opacity-50"
                                                        >
                                                            {isPlacing === q.id ? "Authorizing..." : (
                                                                <><CheckCircle2 className="w-4 h-4 mr-2" /> Authorize</>
                                                            )}
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="orders"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                            className="rounded-xl border bg-card text-card-foreground shadow-sm border-success/20 overflow-hidden"
                        >
                            <div className="relative w-full overflow-auto min-h-[300px]">
                                <table className="w-full caption-bottom text-sm">
                                    <thead className="[&_tr]:border-b bg-muted/30">
                                        <tr className="border-b transition-colors">
                                            <th className="h-12 px-6 text-left align-middle font-semibold text-muted-foreground">Order ID</th>
                                            <th className="h-12 px-6 text-left align-middle font-semibold text-muted-foreground">Authorized On</th>
                                            <th className="h-12 px-6 text-left align-middle font-semibold text-muted-foreground">Status</th>
                                            <th className="h-12 px-6 text-right align-middle font-semibold text-muted-foreground">Total Valuation</th>
                                        </tr>
                                    </thead>
                                    <tbody className="[&_tr:last-child]:border-0">
                                        {orders.length === 0 ? (
                                            <tr>
                                                <td colSpan={4} className="p-12 text-center text-muted-foreground">
                                                    <Truck className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                                                    <p className="font-medium text-foreground text-lg">No Active Shipments</p>
                                                    <p className="text-sm mt-1">Confirmed dispensations will appear here.</p>
                                                </td>
                                            </tr>
                                        ) : (
                                            orders.map(o => (
                                                <tr key={o.id} className="border-b transition-colors hover:bg-muted/10">
                                                    <td className="p-6 align-middle font-bold text-success">#{o.id}</td>
                                                    <td className="p-6 align-middle text-muted-foreground">{new Date(o.createdAt).toLocaleString(undefined, { dateStyle: 'medium' })}</td>
                                                    <td className="p-6 align-middle">
                                                        <div className="inline-flex items-center rounded-md border border-success/20 bg-success/10 px-2.5 py-1 text-xs font-bold text-success">
                                                            {o.status}
                                                        </div>
                                                    </td>
                                                    <td className="p-6 align-middle text-right font-bold text-base">
                                                        ${parseFloat(o.totalPrice).toFixed(2)}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
