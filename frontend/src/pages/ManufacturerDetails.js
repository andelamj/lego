import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './ManufacturerDetails.css'

const ManufacturerDetails = () => {
    const { id } = useParams();
    const [manufacturer, setManufacturer] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchManufacturer = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/manufacturers/${id}`);
                setManufacturer(response.data);
            } catch (err) {
                setError('Greška.');
            }
        };
        fetchManufacturer();
    }, [id]);

    if (error) return <div>{error}</div>;
    if (!manufacturer) return <div>Loading...</div>;

    return (
        <div className="manufacturer-details">
            <h1>{manufacturer.name}</h1>
            <p><strong>Godina osnivanja:</strong> {manufacturer.yearFounded}</p>
            <p><strong>Država:</strong> {manufacturer.country}</p>
            <p>Opis:</p>
            <p className="description">
                {manufacturer.description || 'Opis nije dostupan.'}
            </p>
            
        </div>
    );
};

export default ManufacturerDetails;
