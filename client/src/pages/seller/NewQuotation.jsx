import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';

const NewQuotation = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);

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
        setCart(prev => [...prev, { productId: product.id, name: product.name, quantity, unitUsed }]);
    };

    const handleRemoveFromCart = (index) => {
        setCart(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmitQuotation = async () => {
        if (cart.length === 0) return alert('Cart is empty!');
        try {
            await api.post('/api/orders/quotation', { items: cart });
            alert('Quotation created successfully!');
            navigate('/seller/my-quotations');
        } catch (error) {
            console.error('Failed to create quotation', error);
            alert('Failed to create quotation');
        }
    };

    return (
        <div style={{ padding: 20, display: 'flex', gap: 40 }}>
            <div style={{ flex: 1 }}>
                <h2>Products</h2>
                <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%' }}>
                    <thead>
                        <tr><th>Product</th><th>Base Unit</th><th>Action</th></tr>
                    </thead>
                    <tbody>
                        {products.map(p => {
                            // Local state for each row to add to cart
                            const isWeight = ['g', 'kg', 'mg'].includes(p.baseUnit);
                            const isVolume = ['mL', 'L'].includes(p.baseUnit);
                            return (
                                <ProductRow key={p.id} product={p} isWeight={isWeight} isVolume={isVolume} onAdd={handleAddToCart} />
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div style={{ width: 400, borderLeft: '1px solid #ccc', paddingLeft: 20 }}>
                <h2>Current Quotation Cart</h2>
                {cart.length === 0 ? <p>Cart is empty</p> : (
                    <ul>
                        {cart.map((item, idx) => (
                            <li key={idx} style={{ marginBottom: 10 }}>
                                {item.name} - {item.quantity} {item.unitUsed}
                                <button onClick={() => handleRemoveFromCart(idx)} style={{ marginLeft: 10 }}>Remove</button>
                            </li>
                        ))}
                    </ul>
                )}
                <button onClick={handleSubmitQuotation} disabled={cart.length === 0} style={{ marginTop: 20, padding: 10 }}>Submit Quotation</button>
                <button onClick={() => navigate('/seller/dashboard')} style={{ marginTop: 20, marginLeft: 10, padding: 10 }}>Back to Dashboard</button>
            </div>
        </div>
    );
};

// Helper component for managing individual product row inputs before adding to cart
const ProductRow = ({ product, isWeight, isVolume, onAdd }) => {
    const [qty, setQty] = useState(1);
    const [unit, setUnit] = useState(product.baseUnit);

    return (
        <tr>
            <td>{product.name}</td>
            <td>{product.baseUnit}</td>
            <td>
                <input type="number" step="0.01" value={qty} onChange={e => setQty(e.target.value)} style={{ width: 60, marginRight: 5 }} />
                <select value={unit} onChange={e => setUnit(e.target.value)} style={{ marginRight: 5 }}>
                    {isWeight && <><option value="g">g</option><option value="kg">kg</option><option value="mg">mg</option></>}
                    {isVolume && <><option value="mL">mL</option><option value="L">L</option></>}
                    {!isWeight && !isVolume && <option value="unit">unit</option>}
                </select>
                <button onClick={() => onAdd(product, parseFloat(qty), unit)}>Add to Cart</button>
            </td>
        </tr>
    );
}

export default NewQuotation;
