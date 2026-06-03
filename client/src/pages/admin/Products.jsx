import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, Trash2, Plus, Search, X, Pill, ArrowLeft, ArrowRight } from 'lucide-react';
import api from '../../utils/api';

export default function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [search, setSearch] = useState('');
    
    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
    
    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editId, setEditId] = useState(null);
    
    // Form State
    const [name, setName] = useState('');
    const [sku, setSku] = useState('');
    const [baseUnit, setBaseUnit] = useState('mg');
    const [basePrice, setBasePrice] = useState('');
    const [stock, setStock] = useState('');

    const fetchProducts = async () => {
        try {
            const res = await api.get('/api/products');
            setProducts(res.data);
            setFilteredProducts(res.data);
        } catch (error) {
            console.error('Failed to fetch products', error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        const filtered = products.filter(p => 
            p.name.toLowerCase().includes(search.toLowerCase()) || 
            p.sku.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredProducts(filtered);
        setCurrentPage(1);
    }, [search, products]);

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * itemsPerPage, 
        currentPage * itemsPerPage
    );

    const openModal = (product = null) => {
        if (product) {
            setEditId(product.id);
            setName(product.name);
            setSku(product.sku);
            setBaseUnit(product.baseUnit);
            setBasePrice(product.basePrice);
            setStock(product.stockQuantity);
        } else {
            setEditId(null);
            setName('');
            setSku('');
            setBaseUnit('mg');
            setBasePrice('');
            setStock('');
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = { name, sku, baseUnit, basePrice: parseFloat(basePrice), stockQuantity: parseFloat(stock) };
        try {
            if (editId) {
                await api.put(`/api/products/${editId}`, payload);
            } else {
                await api.post('/api/products', payload);
            }
            closeModal();
            fetchProducts();
        } catch (error) {
            console.error('Failed to save product', error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this pharmaceutical product?")) return;
        try {
            await api.delete(`/api/products/${id}`);
            fetchProducts();
        } catch (error) {
            console.error('Failed to delete product', error);
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-primary">Catalog</h2>
                    <p className="text-muted-foreground mt-1">Manage pharmaceutical inventory and active listings.</p>
                </div>
                <button 
                    onClick={() => openModal()}
                    className="inline-flex items-center justify-center rounded-lg text-sm font-medium h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-md hover:shadow-lg"
                >
                    <Plus className="w-4 h-4 mr-2" /> Add Formula
                </button>
            </div>

            <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
                <div className="p-4 border-b bg-muted/20 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input 
                            type="text" 
                            placeholder="Search formulas or SKUs..." 
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="flex h-10 w-full rounded-lg border border-input bg-background pl-9 pr-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm"
                        />
                    </div>
                    <div className="text-sm text-muted-foreground">
                        Showing {paginatedProducts.length} of {filteredProducts.length} results
                    </div>
                </div>

                <div className="relative w-full overflow-auto min-h-[400px]">
                    <table className="w-full caption-bottom text-sm">
                        <thead className="[&_tr]:border-b bg-muted/50 text-muted-foreground">
                            <tr className="border-b transition-colors">
                                <th className="h-12 px-6 text-left align-middle font-semibold">Formula Name</th>
                                <th className="h-12 px-6 text-left align-middle font-semibold">NDC / SKU</th>
                                <th className="h-12 px-6 text-left align-middle font-semibold">Price (Per Unit)</th>
                                <th className="h-12 px-6 text-left align-middle font-semibold">Stock Level</th>
                                <th className="h-12 px-6 text-right align-middle font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {paginatedProducts.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center h-48 text-muted-foreground align-middle">
                                        <div className="flex flex-col items-center justify-center">
                                            <Pill className="w-12 h-12 text-muted-foreground/30 mb-4" />
                                            <p className="text-lg font-medium text-foreground">No formulas found.</p>
                                            <p className="text-sm">Try adjusting your search query.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : paginatedProducts.map((p, i) => (
                                <motion.tr 
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                                    key={p.id} className="border-b transition-colors hover:bg-muted/30"
                                >
                                    <td className="p-6 align-middle">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground">
                                                <Pill className="w-5 h-5" />
                                            </div>
                                            <span className="font-medium text-base">{p.name}</span>
                                        </div>
                                    </td>
                                    <td className="p-6 align-middle">
                                        <div className="inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-semibold bg-background text-muted-foreground shadow-sm">{p.sku}</div>
                                    </td>
                                    <td className="p-6 align-middle">
                                        <span className="font-semibold text-foreground">${parseFloat(p.basePrice).toFixed(2)}</span>
                                        <span className="text-muted-foreground text-xs ml-1">/ {p.baseUnit}</span>
                                    </td>
                                    <td className="p-6 align-middle">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${p.stockQuantity > 50 ? 'bg-success' : p.stockQuantity > 0 ? 'bg-warning' : 'bg-destructive'}`}></div>
                                            <span className="font-medium">{p.stockQuantity} {p.baseUnit}</span>
                                        </div>
                                    </td>
                                    <td className="p-6 align-middle text-right space-x-2">
                                        <button onClick={() => openModal(p)} className="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 w-9 border border-input bg-background hover:bg-secondary hover:text-secondary-foreground transition-colors shadow-sm">
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDelete(p.id)} className="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 w-9 border border-input bg-background hover:bg-destructive hover:text-destructive-foreground transition-colors shadow-sm">
                                            <Trash2 className="w-4 h-4 text-destructive group-hover:text-white" />
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="p-4 border-t flex items-center justify-between bg-muted/10">
                        <span className="text-sm text-muted-foreground">Page {currentPage} of {totalPages}</span>
                        <div className="flex gap-2">
                            <button 
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-3 border border-input bg-background hover:bg-accent disabled:opacity-50 transition-colors shadow-sm"
                            >
                                <ArrowLeft className="w-4 h-4 mr-1" /> Prev
                            </button>
                            <button 
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-3 border border-input bg-background hover:bg-accent disabled:opacity-50 transition-colors shadow-sm"
                            >
                                Next <ArrowRight className="w-4 h-4 ml-1" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
                            onClick={closeModal}
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }} 
                            animate={{ opacity: 1, scale: 1, y: 0 }} 
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-2xl sm:rounded-xl"
                        >
                            <div className="flex flex-col space-y-1.5 sm:text-left">
                                <h2 className="text-xl font-bold tracking-tight">{editId ? 'Edit Formula' : 'Add New Formula'}</h2>
                                <p className="text-sm text-muted-foreground">Enter the pharmaceutical details. Click save when you're done.</p>
                            </div>
                            
                            <form onSubmit={handleSubmit} className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <label htmlFor="name" className="text-sm font-semibold">Formula Name</label>
                                    <input id="name" placeholder="Amoxicillin 500mg" value={name} onChange={e => setName(e.target.value)} required 
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label htmlFor="sku" className="text-sm font-semibold">NDC / SKU</label>
                                        <input id="sku" placeholder="NDC-12345" value={sku} onChange={e => setSku(e.target.value)} required 
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="baseUnit" className="text-sm font-semibold">Unit Type</label>
                                        <select 
                                            id="baseUnit"
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                                            value={baseUnit} 
                                            onChange={e => setBaseUnit(e.target.value)}
                                        >
                                            <option value="mg">mg (Weight)</option>
                                            <option value="g">g (Weight)</option>
                                            <option value="mL">mL (Volume)</option>
                                            <option value="L">L (Volume)</option>
                                            <option value="pack">pack (Count)</option>
                                            <option value="vial">vial (Count)</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label htmlFor="basePrice" className="text-sm font-semibold">Unit Price ($)</label>
                                        <input id="basePrice" type="number" step="0.01" placeholder="0.00" value={basePrice} onChange={e => setBasePrice(e.target.value)} required 
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="stock" className="text-sm font-semibold">Initial Stock</label>
                                        <input id="stock" type="number" step="0.01" placeholder="0" value={stock} onChange={e => setStock(e.target.value)} required 
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-3 justify-end pt-4 border-t mt-6">
                                    <button type="button" onClick={closeModal}
                                        className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 border border-input bg-background hover:bg-accent transition-colors shadow-sm"
                                    >
                                        Cancel
                                    </button>
                                    <button type="submit"
                                        className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
                                    >
                                        {editId ? 'Save Changes' : 'Create Formula'}
                                    </button>
                                </div>
                            </form>
                            
                            <button onClick={closeModal} className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                                <X className="h-4 w-4" />
                                <span className="sr-only">Close</span>
                            </button>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
