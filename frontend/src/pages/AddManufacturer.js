import React, { useState } from 'react';
import axios from 'axios';

const AddManufacturer = () => {
    const [formData, setFormData] = useState({
        name: '',
        yearFounded: '',
        country: '',
        description: '',
        logoFile: null, 
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, logoFile: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const manufacturerData = new FormData();
        manufacturerData.append('name', formData.name);
        manufacturerData.append('yearFounded', formData.yearFounded);
        manufacturerData.append('country', formData.country);
        manufacturerData.append('description', formData.description);

        if (formData.logoFile) {
            manufacturerData.append('logo', formData.logoFile);
        }

        try {
            const token = localStorage.getItem('token'); 
            await axios.post('http://localhost:5000/api/manufacturers', manufacturerData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert('Proizvodađač je uspješno dodan!');
            setFormData({
                name: '',
                yearFounded: '',
                country: '',
                description: '',
                logoFile: null,
            });
        } catch (err) {
            console.error('Error adding manufacturer:', err);
            alert('Greška');
        }
    };

    return (
        <form className="add-manufacturer-form" onSubmit={handleSubmit}>
            <input
                type="text"
                name="name"
                placeholder="naziv"
                value={formData.name}
                onChange={handleChange}
                required
            />
            <input
                type="number"
                name="yearFounded"
                placeholder="godina osnivanja"
                value={formData.yearFounded}
                onChange={handleChange}
                required
            />
            <input
                type="text"
                name="country"
                placeholder="država"
                value={formData.country}
                onChange={handleChange}
                required
            />
            <textarea
                name="description"
                placeholder="opis"
                value={formData.description}
                onChange={handleChange}
            />
            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
            />
            {formData.logoFile && (
                <p style={{ marginTop: '10px' }}>Odaberi sliku: {formData.logoFile.name}</p>
            )}
            <button type="submit">
               Dodaj
            </button>
        </form>
    );
};

export default AddManufacturer;
