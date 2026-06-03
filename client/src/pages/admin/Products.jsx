import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Edit2, Trash2, Plus } from 'lucide-react';
import api from '../../utils/api';

export default function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [name, setName] = useState('');
    const [sku, setSku] = useState('');
    const [baseUnit, setBaseUnit] = useState('g');
    const [basePrice, setBasePrice] = useState('');
    const [stock, setStock] = useState('');
    const [editId, setEditId] = useState(null);

    const fetchProducts = async () => {
        try {
            const res = await api.get('/api/products');
            setProducts(res.data);
        } catch (error) {
            console.error('Failed to fetch products', error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = { name, sku, baseUnit, basePrice: parseFloat(basePrice), stockQuantity: parseFloat(stock) };
        try {
            if (editId) {
                await api.put(`/api/products/${editId}`, payload);
            } else {
                await api.post('/api/products', payload);
            }
            setName(''); setSku(''); setBasePrice(''); setStock(''); setEditId(null); setBaseUnit('g');
            fetchProducts();
        } catch (error) {
            console.error('Failed to save product', error);
        }
    };

    const handleEdit = (product) => {
        setEditId(product.id);
        setName(product.name);
        setSku(product.sku);
        setBaseUnit(product.baseUnit);
        setBasePrice(product.basePrice);
        setStock(product.stockQuantity);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        try {
            await api.delete(`/api/products/${id}`);
            fetchProducts();
        } catch (error) {
            console.error('Failed to delete product', error);
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Products</h2>
                    <p className="text-muted-foreground mt-1">Manage your product catalog and pricing.</p>
                </div>
            </div>

            <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
                <div className="flex flex-col space-y-1.5 p-6 border-b">
                    <h3 className="text-lg font-semibold leading-none tracking-tight">{editId ? 'Edit Product' : 'Add New Product'}</h3>
                    <p className="text-sm text-muted-foreground">Fill out the details below to save a product.</p>
                </div>
                <div className="p-6">
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
                        <div className="space-y-2 lg:col-span-2">
                            <label htmlFor="name" className="text-sm font-medium leading-none">Name</label>
                            <input id="name" placeholder="Product Name" value={name} onChange={e => setName(e.target.value)} required 
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent shadow-sm"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="sku" className="text-sm font-medium leading-none">SKU</label>
                            <input id="sku" placeholder="SKU-123" value={sku} onChange={e => setSku(e.target.value)} required 
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent shadow-sm"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="baseUnit" className="text-sm font-medium leading-none">Base Unit</label>
                            <select 
                                id="baseUnit"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent shadow-sm"
                                value={baseUnit} 
                                onChange={e => setBaseUnit(e.target.value)}
                            >
                                <option value="g">g (Weight)</option>
                                <option value="mL">mL (Volume)</option>
                                <option value="unit">unit (Count)</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="basePrice" className="text-sm font-medium leading-none">Price ($)</label>
                            <input id="basePrice" type="number" step="0.01" placeholder="0.00" value={basePrice} onChange={e => setBasePrice(e.target.value)} required 
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent shadow-sm"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="stock" className="text-sm font-medium leading-none">Initial Stock</label>
                            <input id="stock" type="number" step="0.01" placeholder="0" value={stock} onChange={e => setStock(e.target.value)} required 
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent shadow-sm"
                            />
                        </div>
                        <div className="lg:col-span-6 flex gap-2 justify-end mt-2">
                            {editId && (
                                <button type="button" onClick={() => { setEditId(null); setName(''); setSku(''); setBasePrice(''); setStock(''); }}
                                    className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors shadow-sm"
                                >
                                    Cancel
                                </button>
                            )}
                            <button type="submit"
                                className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
                            >
                                {editId ? 'Update Product' : <><Plus className="w-4 h-4 mr-2" /> Add Product</>}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
                <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                        <thead className="[&_tr]:border-b bg-muted/50">
                            <tr className="border-b transition-colors hover:bg-muted/50/50">
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Product</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">SKU</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Price/Unit</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Stock</th>
                                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {products.length === 0 ? (
                                <tr className="border-b transition-colors hover:bg-muted/50/50">
                                    <td colSpan={5} className="p-4 text-center h-24 text-muted-foreground align-middle">No products found.</td>
                                </tr>
                            ) : products.map(p => (
                                <tr key={p.id} className="border-b transition-colors hover:bg-muted/50">
                                    <td className="p-4 align-middle font-medium">{p.name}</td>
                                    <td className="p-4 align-middle">
                                        <div className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold bg-secondary text-secondary-foreground">{p.sku}</div>
                                    </td>
                                    <td className="p-4 align-middle">${p.basePrice} <span className="text-muted-foreground text-xs">/ {p.baseUnit}</span></td>
                                    <td className="p-4 align-middle">{p.stockQuantity} {p.baseUnit}</td>
                                    <td className="p-4 align-middle text-right space-x-2">
                                        <button onClick={() => handleEdit(p)} className="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 w-9 hover:bg-accent hover:text-accent-foreground transition-colors">
                                            <Edit2 className="w-4 h-4 text-muted-foreground" />
                                        </button>
                                        <button onClick={() => handleDelete(p.id)} className="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 w-9 hover:bg-accent hover:text-accent-foreground transition-colors">
                                            <Trash2 className="w-4 h-4 text-destructive" />
                                        </button>
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
