import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './ProductDetails.css';

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/products/${id}`);
                setProduct(response.data);
            } catch (err) {
                setError('Greška.');
            }
        };

        fetchProductDetails();
    }, [id]);

    if (error) return <div>{error}</div>;
    if (!product) return <div>Loading...</div>;

    return (
        <div className="product-details">
            <h1>{product.name}</h1>
            <p><strong>Cijena:</strong> {product.price} €</p>
            <p><strong>Proizvođač:</strong> {product.manufacturer?.name || 'Nepoznato'}</p>
            <p>Opis:</p>
            <p className="description">
                {product.description || 'Opis nije dostupan.'}
            </p>
        </div>
    );
};

export default ProductDetails;
