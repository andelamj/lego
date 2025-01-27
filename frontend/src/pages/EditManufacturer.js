import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditManufacturer = () => {
    const { id } = useParams();
    const navigate = useNavigate(); 
    const [manufacturer, setManufacturer] = useState({
        name: '',
        yearFounded: '',
        country: '',
        description: '',
    });
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchManufacturer = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/manufacturers/${id}`);
                setManufacturer(response.data);
            } catch (err) {
                console.error('Greška prilikom dohvaćanja proizvođača:', err);
                setError('Greška prilikom dohvaćanja podataka.');
            }
        };

        fetchManufacturer();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.put(
                `http://localhost:5000/api/manufacturers/${id}`,
                manufacturer,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            alert('Proizvođač je ažuriran.');
            navigate('/');
        } catch (err) {
            console.error('Greška prilikom ažuriranja proizvođača:', err);
            alert('Greška prilikom ažuriranja proizvođača.');
        }
    };

    if (error) return <div>{error}</div>;

    return (
        <div className="edit-manufacturer">
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Naziv"
                    value={manufacturer.name}
                    onChange={(e) => setManufacturer({ ...manufacturer, name: e.target.value })}
                    required
                />
                <input
                    type="number"
                    placeholder="Godina osnivanja"
                    value={manufacturer.yearFounded}
                    onChange={(e) => setManufacturer({ ...manufacturer, yearFounded: e.target.value })}
                    required
                />
                <input
                    type="text"
                    placeholder="Država"
                    value={manufacturer.country}
                    onChange={(e) => setManufacturer({ ...manufacturer, country: e.target.value })}
                    required
                />
                <textarea
                    placeholder="Opis"
                    value={manufacturer.description}
                    onChange={(e) => setManufacturer({ ...manufacturer, description: e.target.value })}
                />
                <button type="submit">Spremi</button>
            </form>
        </div>
    );
};

export default EditManufacturer;
