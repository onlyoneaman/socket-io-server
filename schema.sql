-- Create the Files table
CREATE TABLE Files (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    status BOOLEAN NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the Fields table
CREATE TABLE Fields (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    status BOOLEAN NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    file_id TEXT NOT NULL,
    FOREIGN KEY (file_id) REFERENCES Files(id)
);
