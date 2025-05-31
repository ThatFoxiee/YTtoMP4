const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

exports.handler = async function(event, context) {
  const videoUrl = event.queryStringParameters.url;

  if (!videoUrl) {
    return {
      statusCode: 400,
      body: JSON.stringify({ success: false, message: 'No video URL provided' }),
    };
  }

  // Use /tmp as the directory to store the downloaded video
  const outputPath = path.join('/tmp', 'video.mp4'); // Save the video in /tmp

  // Check if the download folder exists; if not, create it
  const dirPath = path.dirname(outputPath);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  try {
    // Log the URL and output path for debugging
    console.log(`Attempting to download video from: ${videoUrl}`);
    console.log(`Saving video to: ${outputPath}`);

    // Path to the yt-dlp binary (from netlify/functions)
    const ytDlpPath = path.join(__dirname, 'yt-dlp'); // relative path

    // Run the yt-dlp binary with exec
    const command = `${ytDlpPath} -f best -o "${outputPath}" "${videoUrl}"`;

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
              download_url: `https://zingy-cobbler-a0d226.netlify.app/.netlify/functions/downloads/video.mp4`,
            }),
          });
        }
      });
    });
  } catch (error) {
    console.error('Download failed:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: 'Download failed', error: error.message }),
    };
  }
};
