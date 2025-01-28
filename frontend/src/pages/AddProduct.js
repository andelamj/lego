import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddProduct = () => {
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        manufacturer: '',
        description: '',
        logoFile: null, // Dodana opcija za odabir slike
    });
    const [manufacturers, setManufacturers] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, logoFile: e.target.files[0] });
    };

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

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const productData = new FormData();
        productData.append('name', formData.name);
        productData.append('price', formData.price);
        productData.append('manufacturer', formData.manufacturer);
        productData.append('description', formData.description);
        if (formData.logoFile) {
            productData.append('logo', formData.logoFile);
        }
    
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/products', productData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            alert('Proizvod uspješno dodan!');
            setFormData({
                name: '',
                price: '',
                manufacturer: '',
                description: '',
                logoFile: null, // Resetiraj podatke
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
            </select>
            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
            />
            {formData.logoFile && (
                <p style={{ marginTop: '10px' }}>Odabrana slika: {formData.logoFile.name}</p>
            )}
            <button type="submit">Dodaj proizvod</button>
        </form>
    );
};

export default AddProduct;
