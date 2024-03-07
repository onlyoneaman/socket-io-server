// Import the Express library
const express = require('express');

// Create an instance of the Express application
const app = express();

// Define a route handler for the root endpoint
app.get('/', (req, res) => {
  // Send the response "Hello, World!"
  res.send('Hello, World!');
});

// Start the server on port 3000
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
