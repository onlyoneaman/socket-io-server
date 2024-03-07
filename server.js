const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { setupDatabase } = require('./database');
const { setupRoutes } = require('./routes');
const { setupSocket } = require('./socket');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const server = http.createServer(app);
const io = require('socket.io')(server);

// Setup database
setupDatabase();

// Setup routes
setupRoutes(app);

// Setup socket.io
setupSocket(io);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
