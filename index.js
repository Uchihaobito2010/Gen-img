const axios = require('axios');

module.exports = async (req, res) => {
  const YOUR_NAME = "Paras chourasiya / TG - @Aotpy";
  
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  const { 
    prompt,
    improve = 'true',
    format = 'wide',
    random = Math.random().toString(36).substring(2, 10),
    download = 'false'
  } = req.query;
  
  if (!prompt) {
    return res.json({
      status: "ACTIVE",
      service: `AI Image Generator by ${YOUR_NAME}`,
      developer: YOUR_NAME,
      version: "2.0",
      message: "Send ?prompt=YOUR_TEXT to generate images",
      example: "https://tobi-gen-api.vercel.app/api?prompt=sunset"
    });
  }
  
  try {
    const hazexUrl = `https://img.hazex.workers.dev/?prompt=${encodeURIComponent(prompt)}&improve=${improve}&format=${format}&random=${random}`;
    
    const response = await axios({
      method: 'GET',
      url: hazexUrl,
      responseType: 'arraybuffer',
      timeout: 30000
    });
    
    const contentType = response.headers['content-type'] || 'image/jpeg';
    
    if (download === 'true') {
      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `attachment; filename="ai_${random}.jpg"`);
      return res.send(response.data);
    }
    
    const base64Image = Buffer.from(response.data).toString('base64');
    
    res.json({
      success: true,
      developer: YOUR_NAME,
      prompt: prompt,
      image: `data:${contentType};base64,${base64Image}`,
      download_url: `https://tobi-gen-api.vercel.app/api?prompt=${encodeURIComponent(prompt)}&download=true`
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      developer: YOUR_NAME,
      error: "Generation failed. Try different prompt.",
      example: "?prompt=beautiful sunset"
    });
  }
};
