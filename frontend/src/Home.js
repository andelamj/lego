import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); 

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

    if (error) return <div>{error}</div>;

    const handleProductClick = (manufacturerId) => {
        navigate(`/manufacturers/${manufacturerId}`);
    };

    return (
        <div className="home">
            <div className="products-grid1">
                {products.map((product) => (
                    <div
                        className="product-card"
                        key={product._id}
                        onClick={() => handleProductClick(product.manufacturer?._id)}
                        style={{ cursor: 'pointer' }} 
                    >
                        <div className="product-info">
                            <h3>{product.name}</h3>
                            <p>Cijena: {product.price} €</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;
