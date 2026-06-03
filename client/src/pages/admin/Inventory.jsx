import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save } from 'lucide-react';
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

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Inventory Management</h2>
                <p className="text-muted-foreground mt-1">Monitor and adjust your real-time stock levels.</p>
            </div>

            <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
                <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                        <thead className="[&_tr]:border-b bg-muted/50">
                            <tr className="border-b transition-colors hover:bg-muted/50/50">
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Product</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">SKU</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Base Unit</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Current Stock</th>
                                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Update Stock</th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {inventory.length === 0 ? (
                                <tr className="border-b transition-colors hover:bg-muted/50/50">
                                    <td colSpan={5} className="p-4 text-center h-24 text-muted-foreground align-middle">No inventory found.</td>
                                </tr>
                            ) : inventory.map(item => (
                                <tr key={item.id} className="border-b transition-colors hover:bg-muted/50">
                                    <td className="p-4 align-middle font-medium">{item.name}</td>
                                    <td className="p-4 align-middle">
                                        <div className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold text-foreground">{item.sku}</div>
                                    </td>
                                    <td className="p-4 align-middle text-muted-foreground">{item.baseUnit}</td>
                                    <td className="p-4 align-middle font-semibold">{item.stockQuantity}</td>
                                    <td className="p-4 align-middle text-right">
                                        <div className="flex justify-end items-center gap-2">
                                            <input 
                                                type="number" 
                                                step="0.01"
                                                className="flex h-9 w-24 rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent shadow-sm"
                                                value={editStock[item.id] !== undefined ? editStock[item.id] : item.stockQuantity} 
                                                onChange={(e) => handleStockChange(item.id, e.target.value)} 
                                            />
                                            <button 
                                                onClick={() => handleUpdateStock(item.id)}
                                                className="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-3 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
                                            >
                                                <Save className="w-4 h-4 mr-1" /> Save
                                            </button>
                                        </div>
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
