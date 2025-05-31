// functions/download.js
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  const videoUrl = event.queryStringParameters.url;

  if (!videoUrl) {
    return {
      statusCode: 400,
      body: JSON.stringify({ success: false, message: 'No video URL provided' }),
    };
  }

  const outputPath = path.join(__dirname, '..', 'public', 'downloads', 'video.mp4');

  // Check if the download folder exists; if not, create it
  if (!fs.existsSync(path.dirname(outputPath))) {
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  }

  const command = `yt-dlp -f best -o "${outputPath}" "${videoUrl}"`;

  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        resolve({
          statusCode: 500,
          body: JSON.stringify({ success: false, message: stderr }),
        });
      } else {
        resolve({
          statusCode: 200,
          body: JSON.stringify({
            success: true,
            download_url: `https://zingy-cobbler-a0d226.netlify.app/downloads/video.mp4`,
          }),
        });
      }
    });
  });
};
