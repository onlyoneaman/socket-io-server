const { getDatabase } = require('./database');

function setupSocket(io) {
    io.on('connection', (socket) => {
        console.log('Client connected');
      
        // Simulate field processing
        socket.on('startFieldProcessing', (fileId) => {
          const db = getDatabase();
          const file = db.prepare('SELECT * FROM Files WHERE id = ?').get(fileId);
          if (!file) {
            return;
          }
          let index = 0;
          const intervalId = setInterval(() => {
            const fields = db.prepare('SELECT * FROM Fields WHERE file_id = ?').all(fileId);
            if (index >= fields.length) {
              clearInterval(intervalId);
              db.run('UPDATE Files SET status = ? WHERE id = ?', [true, fileId]); // Mark file as done when all fields are done
              io.emit('fileUpdated', file); // Broadcast updated file status to all clients
              return;
            }
            db.run('UPDATE Fields SET status = ? WHERE id = ?', [true, fields[index].id]); // Mark field as done
            io.emit('fieldUpdated', { fileId, fieldId: fields[index].id }); // Broadcast updated field status to all clients
            index++;
          }, Math.floor(Math.random() * (5000 - 3000 + 1)) + 3000); // Random delay between 3 to 5 seconds
        });
      
        socket.on('disconnect', () => {
          console.log('Client disconnected');
        });
    });
}

module.exports = { setupSocket };
