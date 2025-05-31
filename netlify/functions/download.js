const ytdlp = require('ytdlp-nodejs'); // Correct import for ytdlp
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

  // Use /tmp directory for storing the downloaded file
  const outputPath = path.join('/tmp', 'video.mp4');

  // Check if the file already exists (Netlify has read-only file system)
  if (fs.existsSync(outputPath)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ success: false, message: 'File already exists, please try again' }),
    };
  }

  // Log the URL and output path for debugging
  console.log(`Attempting to download video from: ${videoUrl}`);
  console.log(`Saving video to: ${outputPath}`);

  try {
    // Use ytdlp to download the video
    await ytdlp.download(videoUrl, {
      output: outputPath,
      format: 'best',
    });

    console.log('Download complete:', outputPath);

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        download_url: `https://zingy-cobbler-a0d226.netlify.app/.netlify/functions/serve-video?path=${encodeURIComponent(outputPath)}`,
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
