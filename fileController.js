const { getDatabase } = require('./database');
const { v4: uuidv4 } = require('uuid');

function getAllFiles(req, res) {
    const db = getDatabase();
    db.all('SELECT * FROM Files', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
}

function addFile(req, res) {
    const { name } = req.body;
    const db = getDatabase();
    const id = uuidv4();
    const status = false;
    const created_at = new Date();
    const updated_at = new Date();

    db.run('INSERT INTO Files (id, name, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?)', [id, name, status, created_at, updated_at], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }

        // Add 3-5 fields randomly
        const fieldsCount = Math.floor(Math.random() * (5 - 3 + 1)) + 3;
        for (let i = 0; i < fieldsCount; i++) {
            const fieldId = uuidv4();
            const fieldName = `Field ${i + 1}`;
            const fieldStatus = false;
            const fieldCreatedAt = new Date();

            db.run('INSERT INTO Fields (id, name, status, created_at, file_id) VALUES (?, ?, ?, ?, ?)', [fieldId, fieldName, fieldStatus, fieldCreatedAt, id], (err) => {
                if (err) {
                    console.error('Error adding field:', err.message);
                }
            });
        }

        res.status(201).json({ id, name, status, created_at, updated_at });
    });
}

function getFileById(req, res) {
    const { id } = req.params;
    const db = getDatabase();
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
}

module.exports = { getAllFiles, addFile, getFileById };
