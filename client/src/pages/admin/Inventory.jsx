import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../utils/api';

const AdminInventory = () => {
    const { logout } = useContext(AuthContext);
    const [inventory, setInventory] = useState([]);
    const [editStock, setEditStock] = useState({});

    const fetchInventory = async () => {
        try {
            const res = await api.get('/api/inventory');
            setInventory(res.data);
            
            // Initialize local edit state
            const initialEdits = {};
            res.data.forEach(item => {
                initialEdits[item.id] = item.stockQuantity;
            });
            setEditStock(initialEdits);
        } catch (error) {
            console.error('Failed to fetch inventory', error);
        }
    };

    useEffect(() => {
        fetchInventory();
    }, []);

    const handleUpdateStock = async (productId) => {
        try {
            await api.patch(`/api/inventory/${productId}`, { stockQuantity: parseFloat(editStock[productId]) });
            alert('Stock updated successfully!');
            fetchInventory();
        } catch (error) {
            console.error('Failed to update stock', error);
            alert('Failed to update stock');
        }
    };

    const handleStockChange = (id, value) => {
        setEditStock(prev => ({ ...prev, [id]: value }));
    };

    return (
        <div style={{ padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h2>Admin: Inventory Management</h2>
                <button onClick={logout}>Logout</button>
            </div>
            
            <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%', marginTop: 20 }}>
                <thead>
                    <tr>
                        <th>Product ID</th><th>Name</th><th>SKU</th><th>Base Unit</th><th>Current Stock</th><th>Update Stock</th>
                    </tr>
                </thead>
                <tbody>
                    {inventory.map(item => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.name}</td>
                            <td>{item.sku}</td>
                            <td>{item.baseUnit}</td>
                            <td>{item.stockQuantity}</td>
                            <td>
                                <input 
                                    type="number" 
                                    step="0.01"
                                    value={editStock[item.id] !== undefined ? editStock[item.id] : item.stockQuantity} 
                                    onChange={(e) => handleStockChange(item.id, e.target.value)} 
                                />
                                <button onClick={() => handleUpdateStock(item.id)} style={{ marginLeft: 5 }}>Save</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminInventory;
