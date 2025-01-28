import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Korisnici.css';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/api/users', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUsers(response.data);
            } catch (err) {
                console.error('Greška prilikom dohvaćanja korisnika:', err);
                setError('Greška prilikom dohvaćanja korisnika.');
            }
        };

        fetchUsers();
    }, []);

    const handleEdit = (id) => {
        navigate(`/users/edit/${id}`); // Navigacija na stranicu za uređivanje korisnika
    };

    const handleChangePassword = (id) => {
        navigate(`/users/change-password/${id}`); // Navigacija na stranicu za promjenu lozinke
    };

    if (error) return <div className="error">{error}</div>;

    return (
        <div className="user-list">
            <h2>Korisnici</h2>
            <table>
                <thead>
                    <tr>
                        <th>Korisničko ime</th>
                        <th>Uloga</th>
                        <th>Akcije</th> {/* Kolona za akcije */}
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user._id}>
                            <td>{user.username}</td>
                            <td>{user.role}</td>
                            <td>
                                <button onClick={() => handleEdit(user._id)}>Uredi</button>
                                <button onClick={() => handleChangePassword(user._id)}>
                                    Promijeni lozinku
                                </button> {/* Gumb za promjenu lozinke */}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserList;
