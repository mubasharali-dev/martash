const app = require('./App.js');
const { connectDatabase } = require('./db/Database.js');


// uncaughtException
process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
});

// config 
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

// server
const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

// connect db
connectDatabase();

// unhandledRejection
process.on('unhandledRejection', err => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});

module.exports = server;
