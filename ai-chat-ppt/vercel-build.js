// Vercel Build Script for AI Chat PPT
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Vercel build process...');
console.log('📁 Current directory:', process.cwd());
console.log('📁 Directory contents:');
console.log(fs.readdirSync(process.cwd()));

// Check if package.json exists
if (!fs.existsSync('package.json')) {
  console.error('❌ Error: package.json not found in current directory');
  process.exit(1);
}

console.log('✅ Found package.json');

try {
  console.log('📦 Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  
  console.log('🔨 Building the project...');
  execSync('npm run build', { stdio: 'inherit' });
  
  // Check if build directory exists
  if (!fs.existsSync('build')) {
    console.error('❌ Error: Build failed. No build directory found.');
    process.exit(1);
  }
  
  console.log('✅ Build completed successfully!');
  console.log('📁 Build directory contents:');
  console.log(fs.readdirSync('build'));
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
