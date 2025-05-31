const ytdlp = require('ytdlp-nodejs'); // Correct import for ytdlp
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

exports.handler = async function(event, context) {
  const videoUrl = event.queryStringParameters.url;

  if (!videoUrl) {
    return {
      statusCode: 400,
      body: JSON.stringify({ success: false, message: 'No video URL provided' }),
    };
  }

  // Use the /tmp directory for temporary file storage on Netlify
  const outputPath = path.join('/tmp', 'video.mp4');

  // Log the URL and output path for debugging
  console.log(`Attempting to download video from: ${videoUrl}`);
  console.log(`Saving video to: ${outputPath}`);

  try {
    // Execute the yt-dlp command to download the video to the /tmp directory
    const command = `yt-dlp -f best -o "${outputPath}" "${videoUrl}"`;

    // Execute the command
    await new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error: ${error.message}`);
          reject(error);
        } else {
          console.log(stdout);
          resolve();
        }
      });
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        download_url: `https://zingy-cobbler-a0d226.netlify.app/.netlify/functions/download-video?path=${encodeURIComponent(outputPath)}`,
      }),
    };
  } catch (error) {
    // Log the error for debugging
    console.error('Download failed:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: 'Download failed', error: error.message }),
    };
  }
};
