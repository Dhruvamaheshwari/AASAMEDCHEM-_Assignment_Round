import { useState, useEffect } from 'react';
import axios from 'axios';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [formData, setFormData] = useState({ id: null, name: '', sku: '', description: '', baseUnit: '', basePrice: 0, stockQuantity: 0 });

    const token = localStorage.getItem('token');
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };

    const fetchProducts = async () => {
        try {
            const res = await axios.get('/api/products');
            setProducts(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (formData.id) {
                await axios.put(`/api/products/${formData.id}`, {
                    ...formData,
                    basePrice: parseFloat(formData.basePrice),
                    stockQuantity: parseFloat(formData.stockQuantity)
                }, config);
            } else {
                await axios.post('/api/products', {
                    ...formData,
                    basePrice: parseFloat(formData.basePrice),
                    stockQuantity: parseFloat(formData.stockQuantity)
                }, config);
            }
            setFormData({ id: null, name: '', sku: '', description: '', baseUnit: '', basePrice: 0, stockQuantity: 0 });
            fetchProducts();
        } catch (err) {
            console.error(err);
            alert('Error saving product');
        }
    };

    const editProduct = (p) => {
        setFormData({ ...p });
    };

    const deleteProduct = async (id) => {
        try {
            await axios.delete(`/api/products/${id}`, config);
            fetchProducts();
        } catch (err) {
            console.error(err);
            alert('Error deleting product');
        }
    };

    return (
        <div style={{ padding: 20 }}>
            <h2>Admin Products Management</h2>
            <form onSubmit={handleSubmit} style={{ marginBottom: 20, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <input name="name" placeholder="Name" value={formData.name} onChange={handleInputChange} required />
                <input name="sku" placeholder="SKU" value={formData.sku} onChange={handleInputChange} required />
                <input name="description" placeholder="Description" value={formData.description || ''} onChange={handleInputChange} />
                <input name="baseUnit" placeholder="Base Unit (g, mL, unit)" value={formData.baseUnit} onChange={handleInputChange} required />
                <input type="number" step="0.01" name="basePrice" placeholder="Base Price" value={formData.basePrice} onChange={handleInputChange} required />
                <input type="number" step="0.01" name="stockQuantity" placeholder="Stock" value={formData.stockQuantity} onChange={handleInputChange} required />
                <button type="submit">{formData.id ? 'Update' : 'Add'} Product</button>
            </form>

            <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%' }}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>SKU</th>
                        <th>Unit</th>
                        <th>Base Price</th>
                        <th>Stock</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(p => (
                        <tr key={p.id}>
                            <td>{p.id}</td>
                            <td>{p.name}</td>
                            <td>{p.sku}</td>
                            <td>{p.baseUnit}</td>
                            <td>{p.basePrice}</td>
                            <td>{p.stockQuantity}</td>
                            <td>
                                <button onClick={() => editProduct(p)}>Edit</button>
                                <button onClick={() => deleteProduct(p.id)} style={{ marginLeft: 5 }}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminProducts;