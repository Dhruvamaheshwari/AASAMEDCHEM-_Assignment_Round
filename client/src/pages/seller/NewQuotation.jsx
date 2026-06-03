import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import api from '../../utils/api';

export default function NewQuotation() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await api.get('/api/products');
                setProducts(res.data);
            } catch (error) {
                console.error('Failed to fetch products', error);
            }
        };
        fetchProducts();
    }, []);

    const handleAddToCart = (product, quantity, unitUsed) => {
        if (!quantity || quantity <= 0) return;
        setCart(prev => [...prev, { productId: product.id, name: product.name, quantity, unitUsed }]);
    };

    const handleRemoveFromCart = (index) => {
        setCart(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmitQuotation = async () => {
        if (cart.length === 0) return alert('Cart is empty!');
        setIsSubmitting(true);
        try {
            await api.post('/api/orders/quotation', { items: cart });
            navigate('/seller/my-quotations');
        } catch (error) {
            console.error('Failed to create quotation', error);
            alert('Failed to create quotation');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Draft Quotation</h2>
                <p className="text-muted-foreground mt-1">Select products and build a new customer quotation.</p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
                <div className="rounded-xl border bg-card text-card-foreground shadow-sm xl:col-span-2">
                    <div className="flex flex-col space-y-1.5 p-6 border-b">
                        <h3 className="text-xl font-semibold leading-none tracking-tight">Available Products</h3>
                        <p className="text-sm text-muted-foreground">Add items to the quotation cart.</p>
                    </div>
                    <div className="relative w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm">
                            <thead className="[&_tr]:border-b bg-muted/50">
                                <tr className="border-b transition-colors hover:bg-muted/50/50">
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Product</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Base Unit</th>
                                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Action</th>
                                </tr>
                            </thead>
                            <tbody className="[&_tr:last-child]:border-0">
                                {products.length === 0 ? (
                                    <tr className="border-b transition-colors hover:bg-muted/50/50">
                                        <td colSpan={3} className="p-4 text-center h-24 text-muted-foreground align-middle">Loading products...</td>
                                    </tr>
                                ) : (
                                    products.map(p => {
                                        const isWeight = ['g', 'kg', 'mg'].includes(p.baseUnit);
                                        const isVolume = ['mL', 'L'].includes(p.baseUnit);
                                        return (
                                            <ProductRow key={p.id} product={p} isWeight={isWeight} isVolume={isVolume} onAdd={handleAddToCart} />
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="rounded-xl border bg-card text-card-foreground sticky top-24 shadow-md border-primary/10">
                    <div className="flex flex-col space-y-1.5 p-6 bg-muted/30 border-b">
                        <h3 className="text-xl font-semibold leading-none tracking-tight flex items-center gap-2">
                            <ShoppingCart className="w-5 h-5" />
                            Quotation Cart
                        </h3>
                        <p className="text-sm text-muted-foreground">{cart.length} item(s) selected</p>
                    </div>
                    <div className="p-0">
                        {cart.length === 0 ? (
                            <div className="p-8 text-center text-muted-foreground">
                                Your cart is empty. Add products to begin.
                            </div>
                        ) : (
                            <ul className="divide-y border-b">
                                {cart.map((item, idx) => (
                                    <li key={idx} className="flex justify-between items-center p-4 hover:bg-muted/30 transition-colors">
                                        <div className="space-y-1">
                                            <p className="font-medium text-sm">{item.name}</p>
                                            <div className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold bg-secondary text-secondary-foreground font-normal">{item.quantity} {item.unitUsed}</div>
                                        </div>
                                        <button 
                                            onClick={() => handleRemoveFromCart(idx)}
                                            className="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 w-9 hover:bg-accent hover:text-accent-foreground transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4 text-destructive" />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <div className="flex items-center bg-muted/30 p-4 flex-col gap-3 rounded-b-xl">
                        <button 
                            disabled={cart.length === 0 || isSubmitting} 
                            onClick={handleSubmitQuotation}
                            className="inline-flex items-center justify-center rounded-md text-sm font-medium h-11 px-8 w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50"
                        >
                            {isSubmitting ? "Generating..." : (
                                <>Submit Quotation <ArrowRight className="ml-2 w-4 h-4" /></>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

const ProductRow = ({ product, isWeight, isVolume, onAdd }) => {
    const [qty, setQty] = useState(1);
    const [unit, setUnit] = useState(product.baseUnit);

    return (
        <tr className="border-b transition-colors hover:bg-muted/50">
            <td className="p-4 align-middle font-medium">{product.name}</td>
            <td className="p-4 align-middle text-muted-foreground">{product.baseUnit}</td>
            <td className="p-4 align-middle text-right">
                <div className="flex justify-end items-center gap-2">
                    <input 
                        type="number" 
                        step="0.01" 
                        value={qty} 
                        onChange={e => setQty(e.target.value)} 
                        className="flex h-9 w-20 rounded-md border border-input bg-background px-3 py-1 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent shadow-sm" 
                    />
                    <select 
                        value={unit} 
                        onChange={e => setUnit(e.target.value)} 
                        className="flex h-9 w-20 rounded-md border border-input bg-background px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent shadow-sm"
                    >
                        {isWeight && <><option value="g">g</option><option value="kg">kg</option><option value="mg">mg</option></>}
                        {isVolume && <><option value="mL">mL</option><option value="L">L</option></>}
                        {!isWeight && !isVolume && <option value="unit">unit</option>}
                    </select>
                    <button 
                        onClick={() => onAdd(product, parseFloat(qty), unit)}
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-3 border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors shadow-sm"
                    >
                        Add
                    </button>
                </div>
            </td>
        </tr>
    );
}
