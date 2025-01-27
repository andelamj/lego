import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Product.css';
import { useAuth } from '../AuthContext';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/products');
                setProducts(response.data);
            } catch (err) {
                setError('Greška.');
            }
        };

        fetchProducts();
    }, []);

    const groupedProducts = products.reduce((groups, product) => {
        const manufacturerName = product.manufacturer?.name || 'Unknown';
        if (!groups[manufacturerName]) {
            groups[manufacturerName] = [];
        }
        groups[manufacturerName].push(product);
        return groups;
    }, {});

    const sortedManufacturerNames = Object.keys(groupedProducts).sort();

    const handleDelete = async (id) => {
        if (window.confirm('Jeste li sigurni da želite izbrisati proizvod?')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`http://localhost:5000/api/products/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setProducts((prevProducts) =>
                    prevProducts.filter((product) => product._id !== id)
                );
                alert('Proizvod uspješno obrisan.');
            } catch (err) {
                alert('Greška.');
            }
        }
    };

    const handleEdit = (id) => {
        navigate(`/products/edit/${id}`);
    };

    const handleProductClick = (id) => {
        navigate(`/products/${id}`); 
    };

    if (error) return <div>{error}</div>;

    return (
        <div className="product">
            <div className="product-list">
                {sortedManufacturerNames.map((manufacturerName) => (
                    <div key={manufacturerName} className="manufacturer-group">
                        <h2>{manufacturerName}</h2>
                        <div className="products-grid">
                            {groupedProducts[manufacturerName].map((product) => (
                                <div
                                    className="product-card"
                                    key={product._id}
                                    onClick={() => handleProductClick(product._id)} 
                                    style={{ cursor: 'pointer' }} 
                                >
                                    <h3>{product.name}</h3>
                                    <p>Cijena: {product.price} €</p>
                                    {user?.role === 'admin' && (
                                        <div className="admin-buttons">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation(); 
                                                    handleEdit(product._id);
                                                }}
                                            >
                                                Uredi
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation(); 
                                                    handleDelete(product._id);
                                                }}
                                                className="delete-button"
                                            >
                                                Obriši
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductList;
