import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Pill, PlusCircle, LayoutGrid, List } from 'lucide-react';
import api from '../../utils/api';

export default function SellerDashboard() {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState('');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

    const fetchProducts = async (query = '') => {
        try {
            const res = await api.get(`/api/products?search=${query}`);
            setProducts(res.data);
        } catch (error) {
            console.error('Failed to fetch products', error);
        }
    };

    useEffect(() => {
        const debounce = setTimeout(() => fetchProducts(search), 300);
        return () => clearTimeout(debounce);
    }, [search]);

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-primary">Formula Catalog</h2>
                    <p className="text-muted-foreground mt-1">Search the master catalog to initiate wholesale dispensations.</p>
                </div>
                <div className="flex gap-2">
                    <Link to="/seller/new-quotation" className="inline-flex items-center justify-center rounded-lg text-sm font-medium h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-md hover:shadow-lg">
                        <PlusCircle className="w-4 h-4 mr-2" /> Start Quotation
                    </Link>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-card p-4 rounded-xl border shadow-sm">
                <div className="relative w-full sm:max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <input 
                        type="text" 
                        placeholder="Search by formula name or NDC code..." 
                        value={search} 
                        onChange={e => setSearch(e.target.value)} 
                        className="flex h-11 w-full rounded-lg border border-input bg-background pl-10 pr-4 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm transition-all"
                    />
                </div>
                <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-lg border">
                    <button 
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                        title="Grid View"
                    >
                        <LayoutGrid className="w-4 h-4" />
                    </button>
                    <button 
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                        title="List View"
                    >
                        <List className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {products.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16 text-muted-foreground bg-card rounded-xl border border-dashed shadow-sm">
                    <div className="w-20 h-20 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
                        <Pill className="h-10 w-10 text-muted-foreground/50" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">No formulas found</h3>
                    <p>We couldn't find anything matching "{search}". Try another term.</p>
                </motion.div>
            ) : (
                <AnimatePresence mode="wait">
                    {viewMode === 'grid' ? (
                        <motion.div 
                            key="grid"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                        >
                            {products.map((p, i) => (
                                <motion.div 
                                    key={p.id} 
                                    initial={{ opacity: 0, scale: 0.95 }} 
                                    animate={{ opacity: 1, scale: 1 }} 
                                    transition={{ delay: i * 0.05 }}
                                    className="rounded-xl border bg-card text-card-foreground shadow-sm h-full flex flex-col hover:shadow-lg transition-all group overflow-hidden"
                                >
                                    <div className="h-32 bg-gradient-to-br from-primary/10 to-secondary/30 flex items-center justify-center border-b border-primary/10">
                                        <Pill className="w-16 h-16 text-primary/40 group-hover:scale-110 group-hover:text-primary/60 transition-all duration-300" />
                                    </div>
                                    <div className="flex flex-col space-y-1.5 p-5 pb-3">
                                        <div className="flex justify-between items-start gap-2">
                                            <h3 className="text-lg font-semibold leading-tight line-clamp-2 group-hover:text-primary transition-colors">{p.name}</h3>
                                        </div>
                                        <div className="inline-flex mt-2 w-max items-center rounded-md border px-2 py-0.5 text-xs font-semibold bg-background text-muted-foreground">{p.sku}</div>
                                    </div>
                                    <div className="p-5 pt-0 pb-4 flex-1">
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-2xl font-bold tracking-tight text-foreground">${parseFloat(p.basePrice).toFixed(2)}</span>
                                            <span className="text-sm text-muted-foreground font-medium">/ {p.baseUnit}</span>
                                        </div>
                                    </div>
                                    <div className="p-4 text-sm font-medium flex items-center justify-between border-t mt-auto bg-muted/10">
                                        <span className="text-muted-foreground flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${p.stockQuantity > 50 ? 'bg-success' : p.stockQuantity > 0 ? 'bg-warning' : 'bg-destructive'}`}></div>
                                            Availability
                                        </span>
                                        <span className="text-foreground">{p.stockQuantity} {p.baseUnit}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="list"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="rounded-xl border bg-card shadow-sm overflow-hidden"
                        >
                            <div className="relative w-full overflow-auto">
                                <table className="w-full caption-bottom text-sm">
                                    <thead className="[&_tr]:border-b bg-muted/50 text-muted-foreground">
                                        <tr>
                                            <th className="h-12 px-6 text-left font-semibold">Formula Details</th>
                                            <th className="h-12 px-6 text-left font-semibold">NDC / SKU</th>
                                            <th className="h-12 px-6 text-right font-semibold">Price per Unit</th>
                                            <th className="h-12 px-6 text-right font-semibold">In Stock</th>
                                        </tr>
                                    </thead>
                                    <tbody className="[&_tr:last-child]:border-0">
                                        {products.map((p, i) => (
                                            <motion.tr 
                                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                                                key={p.id} className="border-b transition-colors hover:bg-muted/30"
                                            >
                                                <td className="p-4 px-6 align-middle">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                                            <Pill className="w-5 h-5 text-primary" />
                                                        </div>
                                                        <span className="font-semibold text-base text-foreground">{p.name}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4 px-6 align-middle">
                                                    <span className="inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-semibold bg-background text-muted-foreground">{p.sku}</span>
                                                </td>
                                                <td className="p-4 px-6 align-middle text-right">
                                                    <span className="font-bold text-foreground">${parseFloat(p.basePrice).toFixed(2)}</span>
                                                    <span className="text-muted-foreground ml-1 text-xs">/ {p.baseUnit}</span>
                                                </td>
                                                <td className="p-4 px-6 align-middle text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <div className={`w-2 h-2 rounded-full ${p.stockQuantity > 50 ? 'bg-success' : p.stockQuantity > 0 ? 'bg-warning' : 'bg-destructive'}`}></div>
                                                        <span className="font-medium text-foreground">{p.stockQuantity} {p.baseUnit}</span>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            )}
        </motion.div>
    );
}
