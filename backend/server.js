const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads')); 

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Error connecting to MongoDB:', err));

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' }, 
});

const ManufacturerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    yearFounded: { type: Number, required: true }, 
    country: { type: String, required: true },
    description: { type: String },
    logoUrl: { type: String }, 
});

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    manufacturer: { type: mongoose.Schema.Types.ObjectId, ref: 'Manufacturer', required: true },
    price: { type: Number, required: true },
    description: { type: String },
    logoUrl: { type: String }, 
    createdAt: { type: Date, default: Date.now },
});


const User = mongoose.model('User', UserSchema);
const Manufacturer = mongoose.model('Manufacturer', ManufacturerSchema);
const Product = mongoose.model('Product', ProductSchema);

const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).send('Access denied');

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(403).send('Invalid token');
    }
};

const authorizeAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).send('Access denied. Admins only.');
    }
    next();
};


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); //Date.now() Generira trenutni timestamp u milisekundama (npr. 1674864965200).

    },
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png/; 
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        if (extname) {
            cb(null, true);
        } else {
            cb(new Error('Only images are allowed.'));
        }
    },
});

// Endpoint za dohvaćanje svih korisnika (samo za administratore)
app.get('/api/users', authenticateToken, authorizeAdmin, async (req, res) => {
    try {
        const users = await User.find({}, '-password'); // Dohvati sve korisnike, ali izuzmi polje lozinke
        res.json(users);
    } catch (err) {
        console.error('Greška prilikom dohvaćanja korisnika:', err);
        res.status(500).send('Greška prilikom dohvaćanja korisnika.');
    }
});

app.put('/api/users/:id/password', authenticateToken, async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const { id } = req.params;

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).send('Korisnik nije pronađen.');
        }

        // Provjeri je li stara lozinka ispravna
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).send('Stara lozinka nije ispravna.');
        }

        // Hashiraj novu lozinku
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Ažuriraj lozinku u bazi
        user.password = hashedPassword;
        await user.save();

        res.send('Lozinka je uspješno promijenjena.');
    } catch (err) {
        console.error('Greška prilikom promjene lozinke:', err);
        res.status(500).send('Greška prilikom promjene lozinke.');
    }
});


// Endpoint za dohvaćanje pojedinačnog korisnika
app.get('/api/users/:id', authenticateToken, authorizeAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id); // Koristi ID iz URL-a
        if (!user) {
            return res.status(404).send('Korisnik nije pronađen.');
        }
        res.json(user);
    } catch (err) {
        console.error('Greška prilikom dohvaćanja korisnika:', err);
        res.status(500).send('Greška prilikom dohvaćanja korisnika.');
    }
});


// Endpoint za ažuriranje korisničkih podataka
app.put('/api/users/:id', authenticateToken, authorizeAdmin, async (req, res) => {
    try {
        const { username, role } = req.body;

        // Nađi korisnika i ažuriraj njegove podatke (osim lozinke)
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { username, role },
            { new: true, runValidators: true } // `new: true` vraća ažuriranog korisnika
        );

        if (!updatedUser) {
            return res.status(404).send('Korisnik nije pronađen.');
        }

        res.json(updatedUser);
    } catch (err) {
        console.error('Greška prilikom ažuriranja korisnika:', err);
        res.status(500).send('Greška prilikom ažuriranja korisnika.');
    }
});


app.post('/api/auth/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 6);

    try {
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();
        res.status(201).send('User Registered');
    } catch (err) {
        res.status(400).send('Error Registering User');
    }
});

app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body;
    
    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(404).send('User Not Found');

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(403).send('Invalid Credentials');

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });

    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).send('Server error'); 
    }
});


app.get('/api/manufacturers', async (req, res) => {
    try {
        const manufacturers = await Manufacturer.find();
        res.json(manufacturers);
    } catch (err) {
        res.status(500).send('Error fetching manufacturers');
    }
});

app.delete('/api/manufacturers/:id', authenticateToken, authorizeAdmin, async (req, res) => {
    try {
        const manufacturerId = req.params.id;

        const linkedProducts = await Product.find({ manufacturer: manufacturerId });
        if (linkedProducts.length > 0) {
            return res
                .status(400)
                .send('Cannot delete manufacturer: There are products linked to this manufacturer.');
        }

        const deletedManufacturer = await Manufacturer.findByIdAndDelete(manufacturerId);
        if (!deletedManufacturer) {
            return res.status(404).send('Manufacturer not found');
        }

        res.send('Manufacturer deleted successfully.');
    } catch (err) {
        console.error('Error deleting manufacturer:', err);
        res.status(500).send('Error deleting manufacturer.');
    }
});

app.get('/api/manufacturers/:id', async (req, res) => {
    try {
        const manufacturer = await Manufacturer.findById(req.params.id);
        if (!manufacturer) {
            return res.status(404).send('Manufacturer not found');
        }
        res.json(manufacturer);
    } catch (err) {
        console.error('Error fetching manufacturer:', err);
        res.status(500).send('Error fetching manufacturer');
    }
});

app.post('/api/products', upload.single('logo'), authenticateToken, async (req, res) => {
    try {
        const { name, price, manufacturer, description } = req.body;

        const newProduct = new Product({
            name,
            price,
            manufacturer,
            description,
            logoUrl: req.file ? `/uploads/${req.file.filename}` : undefined,
        });

        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (err) {
        console.error('Error adding product:', err); 
        res.status(500).send(`Error adding product: ${err.message}`);
    }
});


app.put('/api/manufacturers/:id', async (req, res) => {
    try {
        const { name, yearFounded, country, description, logoUrl } = req.body;
        const updatedData = { name, yearFounded, country, description, logoUrl };

        const manufacturer = await Manufacturer.findByIdAndUpdate(
            req.params.id,
            updatedData,
            { new: true, runValidators: true }
        );

        if (!manufacturer) {
            return res.status(404).send('Manufacturer not found');
        }
        res.json(manufacturer);
    } catch (err) {
        console.error('Error updating manufacturer:', err);
        res.status(500).send('Error updating manufacturer');
    }
});


app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find().populate('manufacturer');
        res.json(products);
    } catch (err) {
        res.status(500).send('Error fetching products');
    }
});


app.get('/api/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('manufacturer', 'name');
        if (!product) {
            return res.status(404).send('Product not found');
        }
        res.json(product);
    } catch (err) {
        res.status(500).send('Error fetching product details');
    }
});

app.post('/api/products', upload.single('logo'), authenticateToken, async (req, res) => {
    try {
        const { name, price, manufacturer, description } = req.body;

        const newProduct = new Product({
            name,
            price,
            manufacturer,
            description,
            logoUrl: req.file ? `/uploads/${req.file.filename}` : undefined,
        });

        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (err) {
        console.error('Error adding product:', err); 
        res.status(500).send(`Error adding product: ${err.message}`);
    }
});




app.put('/api/products/:id', authenticateToken, authorizeAdmin, async (req, res) => {
    try {
        const { name, price, manufacturer, description } = req.body;

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { name, price, manufacturer, description },
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.status(404).send('Product not found');
        }

        res.json(updatedProduct);
    } catch (err) {
        console.error('Error updating product:', err);
        res.status(500).send('Error updating product');
    }
});


app.delete('/api/products/:id', authenticateToken, authorizeAdmin, async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).send('Product not found');
        }
        res.send('Product deleted successfully');
    } catch (err) {
        res.status(500).send('Error deleting product');
    }
});


const port = 5000;
app.listen(port, () => {
  console.log(`Server je pokrenut na portu ${port}`);
});
