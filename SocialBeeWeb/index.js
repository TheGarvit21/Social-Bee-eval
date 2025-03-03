const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const fetch = require('node-fetch');
const { v4: uuidv4 } = require('uuid');

const PORT = 7000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Serve HTML files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'homePage.html'));
});

app.get('/messages', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'messages.html'));
});

app.get('/explore', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'explore.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

// Save messages to a file
app.post('/messages', (req, res) => {
    try {
        const { message } = req.body;

        if (!message || message.trim() === '') {
            return res.status(400).json({ message: 'Message cannot be empty' });
        }

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

// Register a new user
app.post('/register', (req, res) => {
    const { name, username, email, password, dob } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
  
    const userData = `Name: ${name || 'N/A'}\nUsername: ${username || 'N/A'}\nEmail: ${email}\nPassword: ${password}\nDOB: ${dob || 'N/A'}\n\n`;
  
    fs.appendFile('log.txt', userData, (err) => {
      if (err) {
        console.error('Error writing to file:', err);
        return res.status(500).json({ message: 'Failed to save user data' });
      }
      res.status(200).json({ message: 'User registered successfully', userId: uuidv4() });
    });
  });

// Fetch Reddit posts
app.get('/reddit-posts', async (req, res) => {
    try {
        const subreddit = req.query.subreddit || 'technology';
        const after = req.query.after || '';

        const response = await fetch(`https://www.reddit.com/r/${subreddit}/new.json?after=${after}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch data from Reddit: ${response.statusText}`);
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching Reddit posts:', error);
        res.status(500).json({ error: 'Failed to fetch Reddit posts' });
    }
});

// User Endpoints
app.post('/users/signup', (req, res) => {
    const { username, email, password } = req.body;
    const userId = uuidv4();

    const userData = `UserID: ${userId}\nUsername: ${username}\nEmail: ${email}\nPassword: ${password}\n\n`;

    fs.appendFile('log.txt', userData, (err) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to save user data' });
        }
        res.json({ message: 'User created successfully', userId });
    });
});

app.post('/users/login', (req, res) => {
    const { email, password } = req.body;
    if (email === 'user@example.com' && password === 'password123') {
        res.json({ message: 'Login successful', token: 'jwt_token_here', user: { username: 'john_doe', email: 'user@example.com' } });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
});

app.get('/users/profile', (req, res) => {
    res.json({ 
        username: 'john_doe', 
        email: 'user@example.com', 
        bio: 'Tech enthusiast and avid traveler.', 
        profilePicture: 'https://example.com/profile.jpg', 
        followers: 1200, 
        following: 350 
    });
});

app.put('/users/profile', (req, res) => {
    const { bio, profilePicture } = req.body;
    res.json({ 
        message: 'Profile updated successfully', 
        updatedProfile: { 
            bio: bio || 'Tech enthusiast and avid traveler.', 
            profilePicture: profilePicture || 'https://example.com/profile.jpg' 
        } 
    });
});

// Like Endpoints
app.post('/posts/:postId/like', (req, res) => {
    const { postId } = req.params;
    res.json({ message: 'Post liked successfully', postId, likes: 125 });
});

app.delete('/posts/:postId/like', (req, res) => {
    const { postId } = req.params;
    res.json({ message: 'Post unliked successfully', postId, likes: 124 });
});

// Comment Endpoints
app.post('/posts/:postId/comments', (req, res) => {
    const { postId } = req.params;
    const { text } = req.body;
    res.json({ 
        message: 'Comment added successfully', 
        commentId: uuidv4(), 
        postId, 
        text, 
        author: 'john_doe', 
        timestamp: new Date().toISOString() 
    });
});

app.put('/comments/:commentId', (req, res) => {
    const { commentId } = req.params;
    const { text } = req.body;
    res.json({ 
        message: 'Comment updated successfully', 
        commentId, 
        updatedText: text || 'Updated comment content.' 
    });
});

app.delete('/comments/:commentId', (req, res) => {
    const { commentId } = req.params;
    res.json({ message: 'Comment deleted successfully', commentId });
});

// Share Endpoint
app.post('/posts/:postId/share', (req, res) => {
    const { postId } = req.params;
    res.json({ 
        message: 'Post shared successfully', 
        shareId: uuidv4(), 
        postId, 
        sharedBy: 'john_doe', 
        timestamp: new Date().toISOString() 
    });
});

// Bookmark Endpoints
app.post('/posts/:postId/bookmark', (req, res) => {
    const { postId } = req.params;
    res.json({ message: 'Post bookmarked successfully', postId });
});

app.delete('/posts/:postId/bookmark', (req, res) => {
    const { postId } = req.params;
    res.json({ message: 'Post unbookmarked successfully', postId });
});

// Post Endpoints
app.post('/posts', (req, res) => {
    const { title, content, image } = req.body;
    res.json({ 
        message: 'Post created successfully', 
        postId: uuidv4(), 
        title: title || 'Exploring the Future of Technology', 
        content: content || 'A deep dive into the latest advancements in AI and machine learning.', 
        image: image || 'https://example.com/tech.jpg', 
        author: 'john_doe', 
        timestamp: new Date().toISOString() 
    });
});

app.put('/posts/:postId', (req, res) => {
    const { postId } = req.params;
    const { title, content } = req.body;
    res.json({ 
        message: 'Post updated successfully', 
        postId, 
        updatedTitle: title || 'Updated: Exploring the Future of Technology', 
        updatedContent: content || 'Updated: A deep dive into the latest advancements in AI and machine learning.' 
    });
});

app.delete('/posts/:postId', (req, res) => {
    const { postId } = req.params;
    res.json({ message: 'Post deleted successfully', postId });
});

app.get('/posts/:postId', (req, res) => {
    const { postId } = req.params;
    res.json({ 
        postId, 
        title: 'Exploring the Future of Technology', 
        content: 'A deep dive into the latest advancements in AI and machine learning.', 
        image: 'https://example.com/tech.jpg', 
        author: 'john_doe', 
        timestamp: new Date().toISOString(), 
        likes: 125, 
        comments: 15 
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
