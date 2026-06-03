import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Package, PlusCircle } from 'lucide-react';
import api from '../../utils/api';

export default function SellerDashboard() {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState('');

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
                    <h2 className="text-3xl font-bold tracking-tight">Product Catalog</h2>
                    <p className="text-muted-foreground mt-1">Browse and search for products to quote.</p>
                </div>
                <div className="flex gap-2">
                    <Link to="/seller/new-quotation" className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm">
                        <PlusCircle className="w-4 h-4 mr-2" /> New Quotation
                    </Link>
                </div>
            </div>

            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input 
                    type="text" 
                    placeholder="Search by name or SKU..." 
                    value={search} 
                    onChange={e => setSearch(e.target.value)} 
                    className="flex h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent shadow-sm"
                />
            </div>

            {products.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground bg-muted/20 rounded-xl border border-dashed">
                    <Package className="mx-auto h-12 w-12 opacity-50 mb-4" />
                    <p>No products found matching your search.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((p, i) => (
                        <motion.div 
                            key={p.id} 
                            initial={{ opacity: 0, scale: 0.95 }} 
                            animate={{ opacity: 1, scale: 1 }} 
                            transition={{ delay: i * 0.05 }}
                        >
                            <div className="rounded-xl border bg-card text-card-foreground shadow-sm h-full flex flex-col hover:shadow-md transition-shadow group">
                                <div className="flex flex-col space-y-1.5 p-6 pb-4">
                                    <div className="flex justify-between items-start gap-2">
                                        <h3 className="text-lg font-semibold leading-tight line-clamp-2 group-hover:text-primary transition-colors">{p.name}</h3>
                                        <div className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold bg-secondary text-secondary-foreground shrink-0">{p.sku}</div>
                                    </div>
                                </div>
                                <div className="p-6 pt-0 pb-4 flex-1">
                                    <div className="space-y-1">
                                        <div className="text-2xl font-bold">${parseFloat(p.basePrice).toFixed(2)}</div>
                                        <p className="text-sm text-muted-foreground">per {p.baseUnit}</p>
                                    </div>
                                </div>
                                <div className="p-6 text-sm text-muted-foreground flex items-center gap-2 border-t mt-auto pt-4 bg-muted/10 rounded-b-xl">
                                    <Package className="w-4 h-4" />
                                    <span>{p.stockQuantity} {p.baseUnit} in stock</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </motion.div>
    );
}
