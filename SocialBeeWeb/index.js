const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

const PORT = 7000;

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set the static folder for serving HTML, CSS, and JS files
app.use(express.static(path.join(__dirname, 'views')));

// Route for rendering home.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'home.html'));
});

// Route for rendering messages.html
app.get('/messages', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'messages.html'));
});

// Existing POST route for storing messages
app.post('/messages', (req, res) => {
    try {
        const { name, message } = req.body;

        // Validate message
        if (!message || message.trim() === '') {
            return res.status(400).json({ message: 'Message cannot be empty' });
        }

        // Get the current time in a readable format
        const currentTime = new Date().toLocaleString();

        // Log the message details
        console.log(`Received message from ${name} at ${currentTime}: ${message}`);

        // Prepare the message string
        const messageString = `Name: ${name}\nTime: ${currentTime}\nMessage: ${message}\n\n`;

        // Save the message with name and time to the messages.txt file
        fs.appendFile('messages.txt', messageString, (err) => {
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

// Route to retrieve stored messages
app.get('/getMessages', (req, res) => {
    fs.readFile('messages.txt', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).json({ message: 'Failed to retrieve messages' });
        }
        // Parse the stored messages (you can format them as JSON if needed)
        const messages = data.split('\n\n').map(msg => {
            const lines = msg.split('\n');
            return {
                name: lines[0].replace('Name: ', ''),
                time: lines[1].replace('Time: ', ''),
                message: lines[2].replace('Message: ', '')
            };
        });
        res.json({ messages });
    });
});

// Route for rendering register.html
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'register.html'));
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

