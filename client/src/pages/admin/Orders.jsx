import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../utils/api';

const AdminOrders = () => {
    const { logout } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await api.get('/api/orders');
                setOrders(res.data);
            } catch (error) {
                console.error('Failed to fetch orders', error);
            }
        };
        fetchOrders();
    }, []);

    return (
        <div style={{ padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h2>Admin: Orders Dashboard</h2>
                <button onClick={logout}>Logout</button>
            </div>
            
            {orders.length === 0 ? <p>No orders found.</p> : (
                <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%', marginTop: 20 }}>
                    <thead>
                        <tr>
                            <th>Order ID</th><th>Date</th><th>User</th><th>Status</th><th>Total Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(o => (
                            <tr key={o.id}>
                                <td>{o.id}</td>
                                <td>{new Date(o.createdAt).toLocaleString()}</td>
                                <td>{o.user?.name} ({o.user?.email})</td>
                                <td>{o.status}</td>
                                <td>${o.totalPrice}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AdminOrders;
