const { Router } = require('express');
const filesRouter = require('./files');

function setupRoutes(app) {
    const router = Router();
    router.use('/api/v1/files', filesRouter);

    app.use(router);
}

module.exports = { setupRoutes };
