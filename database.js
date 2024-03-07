const sqlite3 = require('sqlite3').verbose();
const { Sequelize } = require('sequelize');

let db;

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: ':memory:',
});

function setupDatabase() {
    db = new sqlite3.Database(':memory:');

    db.serialize(() => {
        // Create tables and seed data
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
}

function getDatabase() {
    if (!db) {
        throw new Error('Database has not been initialized');
    }
    return db;
}

module.exports = { sequelize, setupDatabase, getDatabase };
