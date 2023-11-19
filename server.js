const express = require('express');
const rateLimit = require('express-rate-limit');
const app = express();

const limiter = rateLimit({
    windowMs: 1000, // 1 second
    max: 10, // allow 10 requests per second
});
app.use(limiter);

app.use(express.static(__dirname));

// Serve the favicon
app.get('/favicon.ico', (req, res) => {
    res.sendFile(__dirname + '/favicon.ico');
});

// Slow API call
app.post('/slow-api', async (req, res) => {
    try {
        // Simulate a slow API call
        await new Promise(resolve => setTimeout(resolve, 5000));

        // Process the request here...

        // Send a response
        res.status(200).send('API Response');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
