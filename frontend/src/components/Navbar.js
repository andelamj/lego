import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { useAuth } from '../AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout(); 
        localStorage.removeItem('token'); 
        navigate('/login'); 
    };

    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <Link to="/">Lego</Link>
            </div>
            <div className="navbar-links">
                <Link to="/products">Proizvodi</Link>
                <Link to="/manufacturers">Proizvođači</Link>

              
                {user?.role === 'admin' && (
                    <>
                        <Link to="/add-product">Dodaj proizvod</Link>
                        <Link to="/add-manufacturer">Dodaj proizvođača</Link>
                        <Link to="/users">Korisnici</Link>
                    </>
                )}

             
                {user && (
                    <button className="logout-button" onClick={handleLogout}>
                        Odjava
                    </button>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
