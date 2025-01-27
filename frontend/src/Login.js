import React, { useState } from 'react';
import { useAuth } from './AuthContext'; 
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import './Login.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth(); 
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', { username, password });
            const token = response.data.token;

            const decodedToken = jwtDecode(token);

            localStorage.setItem('token', token);

            login({ username: decodedToken.username, role: decodedToken.role });

            navigate('/');
        } catch (err) {
            alert('Prijava je neuspješna');
        }
    };

    const handleRegisterRedirect = () => {
        navigate('/register'); 
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Login</h2>
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
            <button type="submit">Prijava</button>
            <button type="button" onClick={handleRegisterRedirect}>
                Registriraj se
            </button>
        </form>
    );
};

export default Login;
