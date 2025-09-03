const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

function generateIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  // Gradient background
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, '#6366f1');
  gradient.addColorStop(0.5, '#8b5cf6');
  gradient.addColorStop(1, '#ec4899');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  
  // White circle background for text
  ctx.beginPath();
  ctx.arc(size/2, size/2, size/3, 0, 2 * Math.PI);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
  ctx.fill();
  
  // Text
  ctx.fillStyle = '#6366f1';
  ctx.font = `bold ${size/4}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('W', size/2, size/2 - size/12);
  
  ctx.font = `${size/10}px sans-serif`;
  ctx.fillText('WISDOM', size/2, size/2 + size/8);
  
  // Save to file
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(__dirname, 'public', `icon-${size}.png`), buffer);
  console.log(`Generated icon-${size}.png`);
}

// Generate both icon sizes
generateIcon(192);
generateIcon(512);

console.log('Icons generated successfully!');