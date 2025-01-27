import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState({
        name: '',
        price: '',
        manufacturer: '',
        description: '',
    });
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const token = localStorage.getItem('token'); 
                const response = await axios.get(`http://localhost:5000/api/products/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setProduct(response.data);
            } catch (err) {
                setError('Greška prilikom dohvaćanja proizvoda.');
                console.error(err);
            }
        };
    
        fetchProduct();
    }, [id]);
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
    
            await axios.put(
                `http://localhost:5000/api/products/${id}`,
                product,
                {
                    headers: {
                        Authorization: `Bearer ${token}`, 
                    },
                }
            );
    
            alert('Proizvod je ažuriran.');
            navigate('/');
        } catch (err) {
            console.error('Failed to update product:', err);
            alert('Greška prilikom ažuriranja proizvoda.');
        }
    };
    

    if (error) return <div>{error}</div>;

    return (
        <div className="edit-product">
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Name"
                    value={product.name}
                    onChange={(e) => setProduct({ ...product, name: e.target.value })}
                    required
                />
                <input
                    type="number"
                    placeholder="Price"
                    value={product.price}
                    onChange={(e) => setProduct({ ...product, price: e.target.value })}
                    required
                />
                <textarea
                    placeholder="Description"
                    value={product.description}
                    onChange={(e) => setProduct({ ...product, description: e.target.value })}
                />
                <button type="submit">Spremi</button>
            </form>
        </div>
    );
};

export default EditProduct;
