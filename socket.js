const File = require('./File');
const Field = require('./Field');

async function setupSocket(io) {
    io.on('connection', (socket) => {
        console.log('Client connected');
      
        // Simulate field processing
        socket.on('startFieldProcessing', async (fileId) => {
            try {
                console.log('Start field processing:', fileId);

                // Find the file by its ID
                const file = await File.findByPk(fileId);
                if (!file) {
                    console.log('File not found');
                    return;
                }

                // Find all fields associated with the file
                const fields = await Field.findAll({ where: { fileId } });

                let index = 0;
                const intervalId = setInterval(() => {
                    fields[index].update({ status: true }); // Mark field as done
                    io.emit('fieldUpdated', { fileId, fieldId: fields[index].id }); // Broadcast updated field status to all clients
                    index++;
                    if (index >= fields.length) {
                      clearInterval(intervalId);
                      file.update({ status: true });
                      // send fields too inside fil
                      file.fields = fields;

                      io.emit('fileUpdated', file);
                      return;
                  }
                }, Math.floor(Math.random() * (500 - 300 + 1)) + 1000); // Random delay between 3 to 5 seconds
            } catch (error) {
                console.error('Error:', error);
            }
        });
      
        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });
}

module.exports = { setupSocket };
