const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors())

// Mock database
let files = [];

// Models
class File {
  constructor(name) {
    this.id = uuidv4();
    this.name = name || "Untitled File";
    this.status = false;
    this.fields = [];
    this.created_at = new Date();
    this.updated_at = new Date();
    this.addTestFields();
  }

  addTestFields() {
    this.addField("Step 1");
    this.addField("step 2");
    this.addField("step 3");
    this.addField("step 4");
    this.addField("step 5");
    this.addField("step 6");
  }

    addField(name) {
        const field = new Field(name);
        this.fields.push(field);
        this.updated_at = new Date();
        return field;
    }
}

class Field {
  constructor(name) {
    this.id = uuidv4();
    this.name = name;
    this.status = false;
    this.created_at = new Date();
  }
}

// API endpoints
// Get all files
app.get('/api/v1/files', (req, res) => {
  res.json(files);
});

// Add a file
app.post('/api/v1/files', (req, res) => {
  const { name } = req.body;
  const file = new File(name);
  files.push(file);
  res.status(201).json(file);
});

// get a file
app.get('/api/v1/files/:id', (req, res) => {
    const { id } = req.params;
    const file = files.find(file => file.id === id);
    if (!file) {
        return res.status(404).json({ message: "File not found" });
    }
    res.json(file);
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
