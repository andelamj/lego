import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Product from './pages/Product';
import ProductDetails from './pages/ProductDetails';
import AllManufacturers from './pages/AllManufacturers';
import AddProduct from './pages/AddProduct';
import AddManufacturer from './pages/AddManufacturer';
import Login from './Login';
import Register from './Register';
import Home from './Home';
import ManufacturerDetails from './pages/ManufacturerDetails';
import { AuthProvider, useAuth } from './AuthContext';
import EditProduct from './pages/EditProduct';
import EditManufacturer from './pages/EditManufacturer';
import Korisnici from './Korisnici';
import EditUser from './EditUser';
import ChangePassword from './Password';

const App = () => {
    const AuthenticatedRoutes = () => {
        const { user } = useAuth();
        return user ? (
            <>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/products" element={<Product />} />
                    <Route path="/products/:id" element={<ProductDetails />} />
                    <Route path="/manufacturers" element={<AllManufacturers />} />
                    <Route path="/manufacturers/edit/:id" element={<EditManufacturer />} />
                    <Route path="/manufacturers/:id" element={<ManufacturerDetails />} />
                    <Route path="/add-product" element={<AddProduct />} />
                    <Route path="/products/edit/:id" element={<EditProduct />} />
                    <Route path="/add-manufacturer" element={<AddManufacturer />} />
                    <Route path="/users" element={<Korisnici />} />
                    <Route path="/users/edit/:id" element={<EditUser />} />
                    <Route path="/users/change-password/:id" element={<ChangePassword />} />



             

                </Routes>
            </>
        ) : (
            <Navigate to="/login" />
        );
    };

    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/*" element={<AuthenticatedRoutes />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;
