import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditUser = () => {
    const { id } = useParams(); // Dohvati ID korisnika iz URL-a
    const [formData, setFormData] = useState({ username: '', role: '' });
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:5000/api/users/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setFormData({ username: response.data.username, role: response.data.role });
            } catch (err) {
                console.error('Greška prilikom dohvaćanja korisnika:', err);
                setError('Greška prilikom dohvaćanja korisnika.');
            }
        };

        fetchUser();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5000/api/users/${id}`, formData, {
                headers: { Authorization: `Bearer ${token}` },
            });

            alert('Podaci korisnika su uspješno ažurirani.');
            navigate('/users'); // Povratak na listu korisnika
        } catch (err) {
            console.error('Greška prilikom ažuriranja korisnika:', err);
            setError('Greška prilikom ažuriranja korisnika.');
        }
    };

    if (error) return <div className="error">{error}</div>;

    return (
        <div className="edit-user">
            <h2>Ažuriranje korisnika</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Korisničko ime:</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Uloga:</label>
                    <select name="role" value={formData.role} onChange={handleChange} required>
                        <option value="user">Korisnik</option>
                        <option value="admin">Administrator</option>
                    </select>
                </div>
                <button type="submit">Spremi promjene</button>
            </form>
        </div>
    );
};

export default EditUser;
