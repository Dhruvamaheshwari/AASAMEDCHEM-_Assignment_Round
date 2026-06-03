import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../utils/api';

const AdminProducts = () => {
    const { logout } = useContext(AuthContext);
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
            setName(''); setSku(''); setBasePrice(''); setStock(''); setEditId(null);
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
        try {
            await api.delete(`/api/products/${id}`);
            fetchProducts();
        } catch (error) {
            console.error('Failed to delete product', error);
        }
    };

    return (
        <div style={{ padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h2>Admin: Product Management</h2>
                <button onClick={logout}>Logout</button>
            </div>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
                <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
                <input placeholder="SKU" value={sku} onChange={e => setSku(e.target.value)} required />
                <select value={baseUnit} onChange={e => setBaseUnit(e.target.value)}>
                    <option value="g">g (Weight)</option>
                    <option value="mL">mL (Volume)</option>
                    <option value="unit">unit (Count)</option>
                </select>
                <input type="number" step="0.01" placeholder="Base Price" value={basePrice} onChange={e => setBasePrice(e.target.value)} required />
                <input type="number" step="0.01" placeholder="Initial Stock" value={stock} onChange={e => setStock(e.target.value)} required />
                <button type="submit">{editId ? 'Update' : 'Create'} Product</button>
                {editId && <button type="button" onClick={() => { setEditId(null); setName(''); setSku(''); setBasePrice(''); setStock(''); }}>Cancel</button>}
            </form>

            <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%' }}>
                <thead>
                    <tr>
                        <th>ID</th><th>Name</th><th>SKU</th><th>Base Unit</th><th>Price/Unit</th><th>Stock</th><th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(p => (
                        <tr key={p.id}>
                            <td>{p.id}</td><td>{p.name}</td><td>{p.sku}</td><td>{p.baseUnit}</td><td>${p.basePrice}</td><td>{p.stockQuantity}</td>
                            <td>
                                <button onClick={() => handleEdit(p)}>Edit</button>
                                <button onClick={() => handleDelete(p.id)} style={{ marginLeft: 5 }}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminProducts;
