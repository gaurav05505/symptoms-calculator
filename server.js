const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const cors = require('cors');

const app = express();
const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3005;

app.use(express.json());
app.use(cors());

// Serve static frontend files with automatic .html extension resolution
app.use(express.static(__dirname, { extensions: ['html'] }));

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

// Clean friendly routes for all pages
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'home.html')));
app.get('/home', (req, res) => res.sendFile(path.join(__dirname, 'home.html')));
app.get('/bmi', (req, res) => res.sendFile(path.join(__dirname, 'bmi.html')));
app.get('/symptoms', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/dashboard', (req, res) => res.sendFile(path.join(__dirname, 'dashboard.html')));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'sample.html')));

const FILE_PATH = path.join(__dirname, 'users.json');

const hashPassword = (password, salt = crypto.randomBytes(16).toString('hex')) => ({
    salt,
    hash: crypto.scryptSync(password, salt, 64).toString('hex')
});

const verifyPassword = (password, stored) => {
    if (!stored || typeof stored !== 'object' || !stored.salt || !stored.hash) return false;
    const candidate = crypto.scryptSync(password, stored.salt, 64).toString('hex');
    return crypto.timingSafeEqual(Buffer.from(candidate, 'hex'), Buffer.from(stored.hash, 'hex'));
};

// Helper function to safely read the JSON file
const readUsers = () => {
    if (!fs.existsSync(FILE_PATH)) {
        fs.writeFileSync(FILE_PATH, JSON.stringify({}));
        return {};
    }
    try {
        const data = fs.readFileSync(FILE_PATH, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return {};
    }
};

// Route: Register
app.post('/register', (req, res) => {
    console.log(`New Registration Attempt: ${req.body.username}`);
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }
    const users = readUsers();

    if (users[username]) {
        return res.status(400).json({ message: "Username already exists" });
    }

    users[username] = hashPassword(password);
    fs.writeFileSync(FILE_PATH, JSON.stringify(users, null, 4));
    res.status(201).json({ message: "User registered successfully" });
});

// Route: Login
app.post('/login', (req, res) => {
    console.log(`Login Attempt: ${req.body.username}`);
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }
    const users = readUsers();

    if (verifyPassword(password, users[username])) {
        res.status(200).json({ message: "Login successful" });
    } else {
        res.status(401).json({ message: "Invalid credentials" });
    }
});

// Function to start server with automatic port retry if port is busy
function startServer(port) {
    const server = app.listen(port, () => {
        console.log(`\n=========================================`);
        console.log(`SERVER IS ALIVE AND RUNNING ON PORT ${port}`);
        console.log(`Open in your browser: http://localhost:${port}`);
        console.log(`Symptoms Checker:    http://localhost:${port}/symptoms`);
        console.log(`BMI Calculator:       http://localhost:${port}/bmi`);
        console.log(`=========================================\n`);
    });

    server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.log(`Port ${port} is in use, trying port ${port + 1}...`);
            startServer(port + 1);
        } else {
            console.error('\nFATAL ERROR CAUGHT:');
            console.error(err);
        }
    });
}

startServer(DEFAULT_PORT);
