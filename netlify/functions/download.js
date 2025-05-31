// functions/download.js
const ytdlp = require('ytdlp-nodejs');
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

  const outputPath = path.join(__dirname, '..', 'public', 'downloads', 'video.mp4');

  // Check if the download folder exists; if not, create it
  if (!fs.existsSync(path.dirname(outputPath))) {
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  }

  try {
    // Download the video
    await ytdlp.exec([videoUrl, '-o', outputPath]);

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        download_url: `https://zingy-cobbler-a0d226.netlify.app/downloads/video.mp4`,
      }),
    };
  } catch (error) {
    console.error('Download failed:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: 'Download failed' }),
    };
  }
};
