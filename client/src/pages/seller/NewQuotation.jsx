import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Trash2, ArrowRight, Pill, ShieldCheck, CheckCircle2 } from 'lucide-react';
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
        setCart(prev => [...prev, { productId: product.id, name: product.name, quantity, unitUsed, baseUnit: product.baseUnit }]);
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
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6 text-primary" />
                </div>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-primary">Dispensation Request</h2>
                    <p className="text-muted-foreground mt-1">Compile a wholesale quotation for review.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
                <div className="rounded-xl border bg-card text-card-foreground shadow-sm xl:col-span-2 overflow-hidden">
                    <div className="flex flex-col space-y-1.5 p-6 border-b bg-muted/20">
                        <h3 className="text-xl font-bold leading-none tracking-tight">Master Formulary</h3>
                        <p className="text-sm text-muted-foreground mt-1">Select verified items to add to the active quote.</p>
                    </div>
                    <div className="relative w-full overflow-auto max-h-[600px]">
                        <table className="w-full caption-bottom text-sm relative">
                            <thead className="[&_tr]:border-b bg-background sticky top-0 z-10 text-muted-foreground shadow-sm">
                                <tr className="border-b transition-colors">
                                    <th className="h-12 px-6 text-left align-middle font-semibold">Formula Details</th>
                                    <th className="h-12 px-6 text-left align-middle font-semibold">Primary Unit</th>
                                    <th className="h-12 px-6 text-right align-middle font-semibold">Requisition</th>
                                </tr>
                            </thead>
                            <tbody className="[&_tr:last-child]:border-0">
                                {products.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="p-12 text-center text-muted-foreground">
                                            <div className="flex justify-center mb-4"><Pill className="w-8 h-8 opacity-20 animate-pulse" /></div>
                                            Loading formulas...
                                        </td>
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

                {/* Shopping Cart Sidebar */}
                <div className="rounded-xl border bg-card text-card-foreground shadow-lg sticky top-24 border-primary/20 flex flex-col max-h-[calc(100vh-8rem)]">
                    <div className="flex flex-col space-y-1.5 p-6 bg-primary/5 border-b rounded-t-xl shrink-0">
                        <h3 className="text-xl font-bold leading-none tracking-tight flex items-center gap-2 text-primary">
                            <ShoppingCart className="w-5 h-5" />
                            Active Quote Cart
                        </h3>
                        <p className="text-sm font-medium text-muted-foreground mt-1">
                            {cart.length} {cart.length === 1 ? 'item' : 'items'} in request
                        </p>
                    </div>
                    
                    <div className="p-0 overflow-y-auto flex-1">
                        <AnimatePresence mode="popLayout">
                            {cart.length === 0 ? (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-12 text-center text-muted-foreground flex flex-col items-center">
                                    <ShoppingCart className="w-12 h-12 text-muted-foreground/20 mb-4" />
                                    <p className="font-medium">No items requested</p>
                                    <p className="text-sm mt-1">Select items from the formulary.</p>
                                </motion.div>
                            ) : (
                                <ul className="divide-y">
                                    {cart.map((item, idx) => (
                                        <motion.li 
                                            key={`${item.productId}-${idx}`}
                                            layout
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="flex justify-between items-center p-5 hover:bg-muted/30 transition-colors group"
                                        >
                                            <div className="space-y-1.5">
                                                <p className="font-semibold text-sm text-foreground">{item.name}</p>
                                                <div className="flex items-center gap-2">
                                                    <span className="inline-flex items-center rounded-md border border-primary/20 bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
                                                        {item.quantity} {item.unitUsed}
                                                    </span>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => handleRemoveFromCart(idx)}
                                                className="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 w-9 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                                                title="Remove item"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </motion.li>
                                    ))}
                                </ul>
                            )}
                        </AnimatePresence>
                    </div>
                    
                    <div className="p-5 bg-muted/10 border-t rounded-b-xl shrink-0">
                        <button 
                            disabled={cart.length === 0 || isSubmitting} 
                            onClick={handleSubmitQuotation}
                            className="inline-flex items-center justify-center rounded-xl text-sm font-bold h-12 px-8 w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:shadow-none"
                        >
                            {isSubmitting ? "Processing Request..." : (
                                <>Submit Quotation Request <ArrowRight className="ml-2 w-5 h-5" /></>
                            )}
                        </button>
                        <p className="text-xs text-center text-muted-foreground mt-3 flex items-center justify-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Quotations require admin review.
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

const ProductRow = ({ product, isWeight, isVolume, onAdd }) => {
    const [qty, setQty] = useState(1);
    const [unit, setUnit] = useState(product.baseUnit);
    const [added, setAdded] = useState(false);

    const handleAdd = () => {
        onAdd(product, parseFloat(qty), unit);
        setAdded(true);
        setTimeout(() => setAdded(false), 1000);
        setQty(1);
    };

    return (
        <tr className="border-b transition-colors hover:bg-muted/30">
            <td className="p-6 align-middle">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground shrink-0">
                        <Pill className="w-4 h-4" />
                    </div>
                    <span className="font-semibold text-foreground">{product.name}</span>
                </div>
            </td>
            <td className="p-6 align-middle">
                <span className="inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-medium text-muted-foreground bg-background">
                    Base: {product.baseUnit}
                </span>
            </td>
            <td className="p-6 align-middle text-right">
                <div className="flex justify-end items-center gap-2">
                    <div className="flex bg-background border rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent transition-all overflow-hidden h-10">
                        <input 
                            type="number" 
                            step="0.01" 
                            value={qty} 
                            onChange={e => setQty(e.target.value)} 
                            className="w-20 px-3 py-2 text-sm font-medium focus:outline-none border-r border-dashed"
                            min="0.01"
                        />
                        <select 
                            value={unit} 
                            onChange={e => setUnit(e.target.value)} 
                            className="px-2 py-2 text-sm font-semibold text-muted-foreground focus:outline-none bg-transparent cursor-pointer hover:bg-muted/50 transition-colors"
                        >
                            {isWeight && <><option value="g">g</option><option value="kg">kg</option><option value="mg">mg</option></>}
                            {isVolume && <><option value="mL">mL</option><option value="L">L</option></>}
                            {!isWeight && !isVolume && <option value="unit">unit</option>}
                            {/* Fallbacks if base unit doesn't map strictly */}
                            {!isWeight && !isVolume && product.baseUnit !== 'unit' && <option value={product.baseUnit}>{product.baseUnit}</option>}
                        </select>
                    </div>
                    <button 
                        onClick={handleAdd}
                        className={`inline-flex items-center justify-center rounded-lg text-sm font-semibold h-10 px-4 transition-all shadow-sm ${
                            added 
                            ? 'bg-success text-success-foreground ring-2 ring-success ring-offset-2' 
                            : 'bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground'
                        }`}
                    >
                        {added ? <CheckCircle2 className="w-4 h-4" /> : 'Add'}
                    </button>
                </div>
            </td>
        </tr>
    );
}
