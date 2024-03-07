const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');
const socketIo = require('socket.io');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(bodyParser.json());
app.use(cors());

const server = http.createServer(app);
const io = socketIo(server);

// Connect to SQLite database
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
    // Create tables from schema
    db.run(`
        CREATE TABLE IF NOT EXISTS Files (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            status BOOLEAN NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS Fields (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            status BOOLEAN NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            file_id TEXT NOT NULL,
            FOREIGN KEY (file_id) REFERENCES Files(id)
        )
    `);

    // Insert initial data from seed file
    const seedQuery = require('fs').readFileSync('./seed.sql', 'utf8');
    db.exec(seedQuery);
});

// API endpoints
// Get all files
app.get('/api/v1/files', (req, res) => {
    db.all('SELECT * FROM Files', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Add a file
app.post('/api/v1/files', (req, res) => {
    const { name } = req.body;
    const id = uuidv4();
    const status = false;
    const created_at = new Date();
    const updated_at = new Date();

    db.run('INSERT INTO Files (id, name, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?)', [id, name, status, created_at, updated_at], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({ id, name, status, created_at, updated_at });
    });
});

// Get a file by ID with its associated fields
app.get('/api/v1/files/:id', (req, res) => {
    const { id } = req.params;

    // Fetch file details
    db.get('SELECT * FROM Files WHERE id = ?', [id], (err, file) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!file) {
            res.status(404).json({ message: 'File not found' });
            return;
        }

        // Fetch associated fields
        db.all('SELECT * FROM Fields WHERE file_id = ?', [id], (err, fields) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }

            // Add fields to the file object
            file.fields = fields;

            // Send the file with its associated fields
            res.json(file);
        });
    });
});

// Serve the homepage
app.get('/', (req, res) => {
    res.send('Hello World');
});

io.on('connection', (socket) => {
    console.log('Client connected');
  
    // Simulate field processing
    socket.on('startFieldProcessing', (fileId) => {
        // Your field processing logic here
        // Example: update field status in the database
    });
  
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
