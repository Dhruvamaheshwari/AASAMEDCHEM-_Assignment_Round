import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, AlertTriangle, CheckCircle, Package } from 'lucide-react';
import api from '../../utils/api';

export default function AdminInventory() {
    const [inventory, setInventory] = useState([]);
    const [editStock, setEditStock] = useState({});

    const fetchInventory = async () => {
        try {
            const res = await api.get('/api/inventory');
            setInventory(res.data);
            
            const initialEdits = {};
            res.data.forEach(item => {
                initialEdits[item.id] = item.stockQuantity;
            });
            setEditStock(initialEdits);
        } catch (error) {
            console.error('Failed to fetch inventory', error);
        }
    };

    useEffect(() => {
        fetchInventory();
    }, []);

    const handleUpdateStock = async (productId) => {
        try {
            await api.patch(`/api/inventory/${productId}`, { stockQuantity: parseFloat(editStock[productId]) });
            alert('Stock updated successfully!');
            fetchInventory();
        } catch (error) {
            console.error('Failed to update stock', error);
            alert('Failed to update stock');
        }
    };

    const handleStockChange = (id, value) => {
        setEditStock(prev => ({ ...prev, [id]: value }));
    };

    const lowStockThreshold = 50;
    const lowStockItems = inventory.filter(item => item.stockQuantity <= lowStockThreshold);
    const healthyItems = inventory.filter(item => item.stockQuantity > lowStockThreshold);

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-primary">Warehouse & Inventory</h2>
                <p className="text-muted-foreground mt-1">Real-time stock level monitoring and adjustments.</p>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Package className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Active Formulas</p>
                        <h3 className="text-2xl font-bold tracking-tight">{inventory.length}</h3>
                    </div>
                </div>
                <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                        <AlertTriangle className="w-6 h-6 text-destructive" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Low Stock Alerts</p>
                        <h3 className="text-2xl font-bold tracking-tight text-destructive">{lowStockItems.length}</h3>
                    </div>
                </div>
                <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-success" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Healthy Inventory</p>
                        <h3 className="text-2xl font-bold tracking-tight text-success">{healthyItems.length}</h3>
                    </div>
                </div>
            </div>

            <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
                <div className="p-4 border-b bg-muted/20">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                        Stock Adjustments
                    </h3>
                </div>
                <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                        <thead className="[&_tr]:border-b bg-muted/50 text-muted-foreground">
                            <tr className="border-b transition-colors">
                                <th className="h-12 px-6 text-left align-middle font-semibold">Formula Name</th>
                                <th className="h-12 px-6 text-left align-middle font-semibold">SKU / NDC</th>
                                <th className="h-12 px-6 text-left align-middle font-semibold">Base Unit</th>
                                <th className="h-12 px-6 text-left align-middle font-semibold">Status</th>
                                <th className="h-12 px-6 text-right align-middle font-semibold">Quick Adjust</th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {inventory.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center h-32 text-muted-foreground align-middle">No inventory tracking available.</td>
                                </tr>
                            ) : inventory.map((item, i) => {
                                const isLowStock = item.stockQuantity <= lowStockThreshold;
                                return (
                                    <motion.tr 
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                                        key={item.id} className={`border-b transition-colors hover:bg-muted/30 ${isLowStock ? 'bg-destructive/5' : ''}`}
                                    >
                                        <td className="p-6 align-middle">
                                            <div className="font-semibold text-foreground">{item.name}</div>
                                        </td>
                                        <td className="p-6 align-middle">
                                            <div className="inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-semibold text-muted-foreground bg-background shadow-sm">{item.sku}</div>
                                        </td>
                                        <td className="p-6 align-middle text-muted-foreground">{item.baseUnit}</td>
                                        <td className="p-6 align-middle">
                                            {isLowStock ? (
                                                <div className="inline-flex items-center gap-1.5 text-destructive font-semibold">
                                                    <AlertTriangle className="w-4 h-4" /> Critically Low ({item.stockQuantity})
                                                </div>
                                            ) : (
                                                <div className="inline-flex items-center gap-1.5 text-success font-semibold">
                                                    <CheckCircle className="w-4 h-4" /> Healthy ({item.stockQuantity})
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-6 align-middle text-right">
                                            <div className="flex justify-end items-center gap-3">
                                                <input 
                                                    type="number" 
                                                    step="0.01"
                                                    className={`flex h-10 w-28 rounded-lg border bg-background px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary shadow-sm ${isLowStock ? 'border-destructive focus:ring-destructive text-destructive' : 'border-input'}`}
                                                    value={editStock[item.id] !== undefined ? editStock[item.id] : item.stockQuantity} 
                                                    onChange={(e) => handleStockChange(item.id, e.target.value)} 
                                                />
                                                <button 
                                                    onClick={() => handleUpdateStock(item.id)}
                                                    className="inline-flex items-center justify-center rounded-lg text-sm font-medium h-10 px-4 bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-md hover:shadow-lg"
                                                >
                                                    <Save className="w-4 h-4 mr-2" /> Sync
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
}
