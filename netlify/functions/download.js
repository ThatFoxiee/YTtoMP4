// netlify/functions/download.js
const { exec } = require('child_process');
const path = require('path');

exports.handler = async function(event, context) {
    const videoUrl = event.queryStringParameters.url;
    if (!videoUrl) {
        return {
            statusCode: 400,
            body: JSON.stringify({ success: false, message: 'No video URL provided' }),
        };
    }

    const outputPath = path.join('/tmp', 'video.mp4');
    const command = `yt-dlp -f best -o "${outputPath}" "${videoUrl}"`;

    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject({ statusCode: 500, body: stderr });
            }

            resolve({
                statusCode: 200,
                body: JSON.stringify({
                    success: true,
                    download_url: `https://fox-yt-backend.netlify.app/${outputPath}`, // Adjust URL accordingly
                }),
            });
        });
    });
};
