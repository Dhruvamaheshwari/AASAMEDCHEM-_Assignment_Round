import { useState, useEffect } from 'react';
import { convertUnit } from '../utils/conversion';

const ProductCard = ({ product }) => {
    const [displayUnit, setDisplayUnit] = useState(product.baseUnit);
    
    // Available units based on baseUnit's dimension
    let availableUnits = [];
    if (['g', 'kg'].includes(product.baseUnit)) availableUnits = ['g', 'kg'];
    else if (['mL', 'L'].includes(product.baseUnit)) availableUnits = ['mL', 'L'];
    else availableUnits = ['unit'];

    const handleUnitChange = (e) => {
        setDisplayUnit(e.target.value);
    };

    // Calculate converted values
    const convertedPrice = convertUnit(product.basePrice, product.baseUnit, displayUnit, true);
    const convertedStock = convertUnit(product.stockQuantity, product.baseUnit, displayUnit, false);

    return (
        <div style={{
            border: '1px solid #ccc',
            borderRadius: 8,
            padding: 16,
            width: 250,
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
            <h3 style={{ marginTop: 0 }}>{product.name}</h3>
            <p style={{ margin: '4px 0', fontSize: '0.9em', color: '#666' }}>SKU: {product.sku}</p>
            {product.description && <p style={{ fontSize: '0.9em' }}>{product.description}</p>}
            
            <div style={{ margin: '12px 0' }}>
                <label style={{ fontSize: '0.85em', fontWeight: 'bold' }}>Display Unit: </label>
                <select value={displayUnit} onChange={handleUnitChange} style={{ padding: '2px 4px' }}>
                    {availableUnits.map(u => (
                        <option key={u} value={u}>{u}</option>
                    ))}
                </select>
            </div>

            <p style={{ margin: '4px 0' }}>
                <strong>Price:</strong> ${convertedPrice !== null ? convertedPrice.toFixed(2) : '-'} / {displayUnit}
            </p>
            <p style={{ margin: '4px 0' }}>
                <strong>Stock:</strong> {convertedStock !== null ? convertedStock.toFixed(2) : '-'} {displayUnit}
            </p>
        </div>
    );
};

const DashboardProducts = () => {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchProducts = async (searchTerm = '') => {
        setLoading(true);
        try {
            const res = await fetch(`/api/products?search=${encodeURIComponent(searchTerm)}`);
            if (!res.ok) throw new Error('Failed to fetch products');
            const data = await res.json();
            setProducts(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Fetch initially and when search is submitted
    useEffect(() => {
        fetchProducts();
    }, []);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        fetchProducts(search);
    };

    return (
        <div style={{ padding: 20 }}>
            <h2>Products Dashboard</h2>
            
            <form onSubmit={handleSearchSubmit} style={{ marginBottom: 20, display: 'flex', gap: 10 }}>
                <input 
                    type="text" 
                    placeholder="Search products..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ padding: 8, width: 300, borderRadius: 4, border: '1px solid #ccc' }}
                />
                <button type="submit" style={{ padding: '8px 16px', borderRadius: 4, cursor: 'pointer' }}>Search</button>
            </form>

            {loading ? (
                <p>Loading products...</p>
            ) : (
                <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                    {products.length > 0 ? (
                        products.map(p => (
                            <ProductCard key={p.id} product={p} />
                        ))
                    ) : (
                        <p>No products found.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default DashboardProducts;
