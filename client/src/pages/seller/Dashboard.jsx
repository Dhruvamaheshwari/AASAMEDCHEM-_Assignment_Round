import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../utils/api';

const SellerDashboard = () => {
    const { logout, user } = useContext(AuthContext);
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
        fetchProducts(search);
    }, [search]);

    return (
        <div style={{ padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h2>Seller Dashboard - Welcome, {user?.name}</h2>
                <div>
                    <Link to="/seller/new-quotation" style={{ marginRight: 15 }}>Create Quotation</Link>
                    <Link to="/seller/my-quotations" style={{ marginRight: 15 }}>My Quotations/Orders</Link>
                    <button onClick={logout}>Logout</button>
                </div>
            </div>

            <input 
                type="text" 
                placeholder="Search products..." 
                value={search} 
                onChange={e => setSearch(e.target.value)} 
                style={{ marginBottom: 20, width: 300, padding: 5 }}
            />

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
                {products.map(p => (
                    <div key={p.id} style={{ border: '1px solid #ccc', padding: 15, width: 250, borderRadius: 5 }}>
                        <h3>{p.name}</h3>
                        <p>SKU: {p.sku}</p>
                        <p>Base Unit: {p.baseUnit}</p>
                        <p>Base Price: ${p.basePrice} / {p.baseUnit}</p>
                        <p>Stock: {p.stockQuantity} {p.baseUnit}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SellerDashboard;
