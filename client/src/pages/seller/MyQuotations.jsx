import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';

const MyQuotations = () => {
    const [quotations, setQuotations] = useState([]);
    const [orders, setOrders] = useState([]);

    const fetchQuotations = async () => {
        try {
            const res = await api.get('/api/orders/my-quotations');
            setQuotations(res.data);
        } catch (error) {
            console.error('Failed to fetch quotations', error);
        }
    };

    const fetchOrders = async () => {
        try {
            const res = await api.get('/api/orders/my-orders');
            setOrders(res.data);
        } catch (error) {
            console.error('Failed to fetch orders', error);
        }
    };

    useEffect(() => {
        fetchQuotations();
        fetchOrders();
    }, []);

    const handlePlaceOrder = async (id) => {
        try {
            await api.post(`/api/orders/${id}/place`);
            alert('Order placed successfully!');
            fetchQuotations();
            fetchOrders();
        } catch (error) {
            console.error('Failed to place order', error);
            alert(error.response?.data?.error || 'Failed to place order');
        }
    };

    return (
        <div style={{ padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>My Quotations & Orders</h2>
                <Link to="/seller/dashboard">Back to Dashboard</Link>
            </div>

            <div style={{ display: 'flex', gap: 40, marginTop: 20 }}>
                {/* Quotations List */}
                <div style={{ flex: 1 }}>
                    <h3>Pending Quotations</h3>
                    {quotations.length === 0 ? <p>No pending quotations</p> : (
                        <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%' }}>
                            <thead>
                                <tr><th>Quotation ID</th><th>Total Price</th><th>Action</th></tr>
                            </thead>
                            <tbody>
                                {quotations.map(q => (
                                    <tr key={q.id}>
                                        <td>{q.id}</td>
                                        <td>${q.totalPrice}</td>
                                        <td>
                                            <button onClick={() => handlePlaceOrder(q.id)}>Place Order</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Confirmed Orders List */}
                <div style={{ flex: 1 }}>
                    <h3>Confirmed Orders</h3>
                    {orders.length === 0 ? <p>No confirmed orders</p> : (
                        <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%' }}>
                            <thead>
                                <tr><th>Order ID</th><th>Status</th><th>Total Price</th></tr>
                            </thead>
                            <tbody>
                                {orders.map(o => (
                                    <tr key={o.id}>
                                        <td>{o.id}</td>
                                        <td>{o.status}</td>
                                        <td>${o.totalPrice}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyQuotations;
