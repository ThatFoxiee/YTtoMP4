const { exec } = require('child_process');
const path = require('path');
const express = require('express');
const app = express();
const port = 3000;

// Serve static files from the 'downloads' folder so the user can access them
app.use('/downloads', express.static(path.join(__dirname, 'downloads')));

// Serve the HTML page on the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'idx.html'));
});

// API route to download video
app.get('/api/download', (req, res) => {
    const videoUrl = req.query.url;
    if (!videoUrl) {
        return res.json({ success: false, message: 'No video URL provided' });
    }

    const outputPath = path.join(__dirname, 'downloads', 'video.mp4');
    const command = `yt-dlp -f best -o "${outputPath}" "${videoUrl}"`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return res.json({ success: false, message: stderr });
        }
        
        // Return a valid URL for downloading the video
        res.json({
            success: true,
            download_url: `/downloads/video.mp4` // Point to the /downloads/video.mp4 path
        });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
