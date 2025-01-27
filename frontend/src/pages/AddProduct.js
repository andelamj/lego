import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddProduct = () => {
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        manufacturer: '',
        description: '',
    });
    const [manufacturers, setManufacturers] = useState([]);

    useEffect(() => {
        const fetchManufacturers = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/manufacturers');
                setManufacturers(response.data);
            } catch (err) {
                console.error('Greška prilikom dohvaćanja proizvođača:', err);
            }
        };

        fetchManufacturers();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('token');
           

            await axios.post('http://localhost:5000/api/products', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            alert('Proizvod uspješno dodan!');
            setFormData({
                name: '',
                price: '',
                manufacturer: '',
                description: '',
            });
        } catch (err) {
            console.error('Greška prilikom dodavanja proizvoda:', err);
            alert('Dodavanje proizvoda nije uspjelo.');
        }
    };

    return (
        <form className="add-product-form" onSubmit={handleSubmit}>
            <input
                type="text"
                name="name"
                placeholder="Naziv proizvoda"
                value={formData.name}
                onChange={handleChange}
                required
            />
            <input
                type="number"
                name="price"
                placeholder="Cijena"
                value={formData.price}
                onChange={handleChange}
                required
            />
             <textarea
                name="description"
                placeholder="Opis proizvoda"
                value={formData.description}
                onChange={handleChange}
            />
            <div>
                <select
                name="manufacturer"
                value={formData.manufacturer}
                onChange={handleChange}
                required
            >
                <option value="">Odaberi proizvođača</option>
                {manufacturers.map((manu) => (
                    <option key={manu._id} value={manu._id}>
                        {manu.name}
                    </option>
                ))}
            </select></div>
            
           
            <button type="submit">Dodaj proizvod</button>
        </form>
    );
};

export default AddProduct;
