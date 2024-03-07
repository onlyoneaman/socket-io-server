const { Router } = require('express');
const { getAllFiles, addFile, getFileById } = require('./fileController');

const router = Router();

router.get('/', getAllFiles);
router.post('/', addFile);
router.get('/:id', getFileById);
// Add other file-related routes here

module.exports = router;
