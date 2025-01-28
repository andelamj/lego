import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ChangePassword = () => {
    const { id } = useParams(); // Dohvati ID korisnika iz URL-a
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('token');
            await axios.put(
                `http://localhost:5000/api/users/${id}/password`,
                { oldPassword, newPassword },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            alert('Lozinka je uspješno promijenjena.');
            navigate('/users'); // Povratak na listu korisnika
        } catch (err) {
            console.error('Greška prilikom promjene lozinke:', err);
            setError('Greška prilikom promjene lozinke. Provjerite staru lozinku.');
        }
    };

    return (
        <div className="change-password">
            <h2>Promjena Lozinke</h2>
            {error && <div className="error">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Stara Lozinka:</label>
                    <input
                        type="text"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Nova Lozinka:</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Promijeni Lozinku</button>
            </form>
        </div>
    );
};

export default ChangePassword;
