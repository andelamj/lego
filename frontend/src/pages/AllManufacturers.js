import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../AuthContext'; 
import './AllManufacturers.css';

const AllManufacturers = () => {
    const [manufacturers, setManufacturers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { user } = useAuth(); 

    useEffect(() => {
        const fetchManufacturers = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/manufacturers');
                setManufacturers(response.data);
            } catch (err) {
                setError('Failed to fetch manufacturers.');
            } finally {
                setLoading(false);
            }
        };

        fetchManufacturers();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Jeste li sigurni da želite obrisati proizvođača?')) {
            try {
                const token = localStorage.getItem('token'); 
                await axios.delete(`http://localhost:5000/api/manufacturers/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setManufacturers((prevManufacturers) =>
                    prevManufacturers.filter((manufacturer) => manufacturer._id !== id)
                );
                alert('Proizvođač uspješno obrisan.');
            } catch (err) {
                alert('Greška.');
            }
        }
    };

    const handleCardClick = (id) => {
        navigate(`/manufacturers/${id}`); 
    };

    const handleEdit = (id, event) => {
        event.stopPropagation(); 
        navigate(`/manufacturers/edit/${id}`);
    };

    const handleDeleteClick = (id, event) => {
        event.stopPropagation(); 
        handleDelete(id);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="manufacturers">
            <div className="manufacturer-grid">
                {manufacturers.map((manufacturer) => (
                    <div
                        className="manufacturer-card"
                        key={manufacturer._id}
                        onClick={() => handleCardClick(manufacturer._id)} 
                        style={{ cursor: 'pointer' }} 
                    >
                        <h2>{manufacturer.name}</h2>
                        <img
                            src={`http://localhost:5000${manufacturer.logoUrl}`}
                            alt={`${manufacturer.name} Logo`}
                            className="manufacturer-logo"
                        />
                        <p>{manufacturer.country}</p>
                        <p>{manufacturer.yearFounded}</p>
                        {user?.role === 'admin' && (
                            <div className="admin-buttons">
                                <button
                                    onClick={(event) => handleEdit(manufacturer._id, event)}
                                    className="edit-button"
                                >
                                    Uredi
                                </button>
                                <button
                                    onClick={(event) => handleDeleteClick(manufacturer._id, event)}
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
    );
};

export default AllManufacturers;
