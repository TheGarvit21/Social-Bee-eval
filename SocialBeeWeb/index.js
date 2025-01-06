const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

const PORT = 7000;

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Route for rendering home.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home1.html'));
});

// Route for rendering messages.html
app.get('/messages', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'messages.html'));
});

// Route for rendering explore.html
app.get('/explore', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'explore.html'));
});

// POST route for handling messages
app.post('/messages', (req, res) => {
    try {
        const { message } = req.body;

        // Validate message
        if (!message || message.trim() === '') {
            return res.status(400).json({ message: 'Message cannot be empty' });
        }

        // Log the message
        console.log(`Received message: ${message}`);

        // Save the message to a file
        fs.appendFile('messages.txt', message + '\n', (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Failed to save the message' });
            }
            res.status(200).json({ message: 'Message saved successfully' });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error processing the request' });
    }
});

// Route for rendering register.html
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.post('/register', (req, res) => {
    const { name, email, password, dob } = req.body;

    // Create user data string
    const userData = `Name: ${name}
Email: ${email}
Password: ${password}
DOB: ${dob}
`;

    // Check if log.txt exists, if not, create it and then append the user data
    fs.readFile('log.txt', 'utf8', (err, data) => {
        // If the file doesn't exist or is empty, directly write the user data
        const newData = err || data === '' ? userData : `\n${userData}`;

        // Append the data to the log file
        fs.appendFile('log.txt', newData, (err) => {
            if (err) {
                console.error('Error writing to file:', err);
            }
        });
    });

    // Redirect to the homepage after registration
    res.redirect('/');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
