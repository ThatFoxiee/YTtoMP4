const { exec } = require('child_process'); // Import exec from child_process
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

  // Use /tmp directory for storing the downloaded file (Netlify allows writing here)
  const outputPath = path.join('/tmp', 'video.mp4');

  // Log the URL and output path for debugging
  console.log(`Attempting to download video from: ${videoUrl}`);
  console.log(`Saving video to: ${outputPath}`);

  // Construct the yt-dlp command
  const command = `yt-dlp -f best -o "${outputPath}" "${videoUrl}"`;

  return new Promise((resolve, reject) => {
    // Execute the command
    exec(command, (error, stdout, stderr) => {
      if (error) {
        // If an error occurs, log the error and return a failure response
        console.error(`Error: ${stderr}`);
        resolve({
          statusCode: 500,
          body: JSON.stringify({
            success: false,
            message: 'Download failed',
            error: stderr,
          }),
        });
      } else {
        // If the download is successful, return the download URL
        console.log('Download complete:', stdout);
        resolve({
          statusCode: 200,
          body: JSON.stringify({
            success: true,
            download_url: `https://zingy-cobbler-a0d226.netlify.app/.netlify/functions/serve-video?path=${encodeURIComponent(outputPath)}`,
          }),
        });
      }
    });
  });
};
