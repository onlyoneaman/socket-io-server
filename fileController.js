const { v4: uuidv4 } = require('uuid');
const File = require('./File');
const Field = require('./Field');

async function getAllFiles(req, res) {
    try {
        const files = await File.findAll();
        res.json(files);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function addFile(req, res) {
    try {
        const { name } = req.body;
        const file = await File.create({ name });

        // Add 3-5 fields randomly
        const fieldsCount = Math.floor(Math.random() * (5 - 3 + 1)) + 3;
        for (let i = 0; i < fieldsCount; i++) {
            await Field.create({
                name: `Field ${i + 1}`,
                status: false,
                fileId: file.id,
            });
        }

        res.status(201).json(file);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getFileById(req, res) {
    try {
        const { id } = req.params;
        const file = await File.findByPk(id, { include: [{ model: Field, as: 'fields' }] });
        if (!file) {
            res.status(404).json({ message: 'File not found' });
            return;
        }
        res.json(file);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = { getAllFiles, addFile, getFileById };
