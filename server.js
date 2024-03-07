const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { setupDatabase } = require('./database');
const { setupRoutes } = require('./routes');
const { setupSocket } = require('./socket');
const { sequelize } = require('./database');

const app = express();
app.use(bodyParser.json());
app.use(cors());

async function syncDatabase() {
    try {
      await sequelize.sync({ force: true }); // This will drop existing tables and recreate them
      console.log('Database synchronized');
    } catch (error) {
      console.error('Error synchronizing database:', error);
    }
  }

const server = http.createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: '*',
    },
});

// Setup database
setupDatabase();

// Setup routes
setupRoutes(app);

syncDatabase();

// Setup socket.io
setupSocket(io);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
