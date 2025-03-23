const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');
const sharp = require('sharp');

// Convert SVG to PNG
async function convertSvgToPng() {
  try {
    // Path to svg file
    const svgPath = path.resolve(__dirname, '../frontend/public/assets/logo.svg');
    const outputPath = path.resolve(__dirname, '../frontend/public/assets/logo.png');
    
    // Read SVG file
    const svgData = fs.readFileSync(svgPath);
    
    // Convert SVG to PNG using sharp
    await sharp(svgData)
      .resize(300, 390) // Maintain aspect ratio
      .png()
      .toFile(outputPath);
    
    console.log('SVG converted to PNG successfully!');
  } catch (error) {
    console.error('Error converting SVG to PNG:', error);
  }
}

convertSvgToPng(); 