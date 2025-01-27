import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Register.css'; 

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = async () => {
        try {
            await axios.post('http://localhost:5000/api/auth/register', { username, password });
            alert('Registracija je uspješna');
            navigate('/login');
        } catch (err) {
            alert('Registracija je neuspješna');
        }
    };

    return (
        <div>
            <div className="form-container">
                <h2>Registracija</h2>
                <div>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button onClick={handleRegister}>Registriraj se</button>
                </div>
                <div className="back-to-login">
                    <button onClick={() => navigate('/login')} className="back-button">
                        Vrati na login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
