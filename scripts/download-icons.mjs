import fs from 'fs';
import path from 'path';

const baseUrl = 'https://xn--nfloww-vva.com/app/index_files/';
const outputDir = path.resolve('./src/lib/assets');

// List of base names to fetch the "-active-" versions for
const activeIcons = [
  'home-active-icon.png',
  'of-active-icon.png',
  'analytics-active-icon.png',
  'messages-pro-active-icon.png',
  'growth-active-icon.png',
  'share-active-icon.png',
  'creator-active-icon.png',
  'person-active-icon.png',
  'settings-active-icon.png',
  'help-center-active-icon.png'
];

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function downloadFiles() {
  console.log('Starting active icon downloads...');
  for (const file of activeIcons) {
    const url = baseUrl + file;
    const dest = path.join(outputDir, file);
    
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      fs.writeFileSync(dest, buffer);
      console.log(`✅ Downloaded: ${file}`);
    } catch (error) {
      console.error(`❌ Failed to download ${file}:`, error.message);
      // Fallback: try SVG if PNG fails
      if (file.endsWith('.png')) {
          const svgFile = file.replace('.png', '.svg');
          try {
              const svgRes = await fetch(baseUrl + svgFile);
              if (svgRes.ok) {
                  const arrBuf = await svgRes.arrayBuffer();
                  fs.writeFileSync(path.join(outputDir, svgFile), Buffer.from(arrBuf));
                  console.log(`✅ Downloaded Fallback: ${svgFile}`);
              }
          } catch(e) {}
      }
    }
  }
  console.log('Done!');
}

downloadFiles();