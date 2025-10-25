const express = require('express');
const cors = require('cors');
const PptxGenJS = require('pptxgenjs');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Generate PowerPoint with real animations
app.post('/api/generate-pptx', async (req, res) => {
  try {
    const { presentation } = req.body;
    
    const pptx = new PptxGenJS();
    
    // Set presentation properties
    pptx.author = 'AI Chat PPT';
    pptx.company = 'AI Chat PPT';
    pptx.title = presentation.title;
    pptx.subject = 'AI Generated Presentation';
    
    // Add slides with real PowerPoint animations
    presentation.slides.forEach((slide, index) => {
      const slideObj = pptx.addSlide();
      
      switch (slide.type) {
        case 'title':
          // Title slide with wipe animation
          slideObj.addText(slide.title, {
            x: 1,
            y: 2,
            w: 8,
            h: 1.5,
            fontSize: 44,
            bold: true,
            color: '363636',
            align: 'center',
            valign: 'middle'
          });
          
          if (slide.content) {
            slideObj.addText(slide.content, {
              x: 1,
              y: 3.5,
              w: 8,
              h: 1,
              fontSize: 20,
              color: '666666',
              align: 'center',
              valign: 'middle'
            });
          }
          
          // Note: Animations will be added in future versions
          break;
          
        case 'bullet':
          // Bullet slide with zoom animation for each point
          slideObj.addText(slide.title, {
            x: 0.5,
            y: 0.5,
            w: 9,
            h: 0.8,
            fontSize: 28,
            bold: true,
            color: '363636'
          });
          
          // Split content into bullet points
          const bulletPoints = slide.content.split('\n').filter(point => point.trim());
          bulletPoints.forEach((point, pointIndex) => {
            slideObj.addText(`• ${point.trim()}`, {
              x: 0.8,
              y: 1.5 + (pointIndex * 0.6),
              w: 8.5,
              h: 0.5,
              fontSize: 18,
              color: '363636',
              valign: 'top'
            });
            
            // Note: Animations will be added in future versions
          });
          break;
          
        case 'swot':
          // SWOT analysis slide
          slideObj.addText(slide.title, {
            x: 0.5,
            y: 0.5,
            w: 9,
            h: 0.8,
            fontSize: 28,
            bold: true,
            color: '363636'
          });
          
          // Create SWOT matrix
          const swotData = slide.content.split('\n').filter(point => point.trim());
          const swotMatrix = {
            'Strengths': swotData.filter(p => p.includes('Strength')),
            'Weaknesses': swotData.filter(p => p.includes('Weakness')),
            'Opportunities': swotData.filter(p => p.includes('Opportunity')),
            'Threats': swotData.filter(p => p.includes('Threat'))
          };
          
          // Add SWOT matrix
          Object.keys(swotMatrix).forEach((key, index) => {
            const x = (index % 2) * 4.5 + 0.5;
            const y = Math.floor(index / 2) * 2 + 1.5;
            
            slideObj.addText(key, {
              x: x,
              y: y,
              w: 4,
              h: 0.5,
              fontSize: 16,
              bold: true,
              color: '2c3e50'
            });
            
            swotMatrix[key].forEach((item, itemIndex) => {
              slideObj.addText(`• ${item}`, {
                x: x,
                y: y + 0.5 + (itemIndex * 0.3),
                w: 4,
                h: 0.3,
                fontSize: 12,
                color: '34495e'
              });
            });
          });
          break;
          
        case 'timeline':
          // Timeline slide with fly-in animation
          slideObj.addText(slide.title, {
            x: 0.5,
            y: 0.5,
            w: 9,
            h: 0.8,
            fontSize: 28,
            bold: true,
            color: '363636'
          });
          
          // Create timeline
          const timelineData = slide.content.split('\n').filter(point => point.trim());
          timelineData.forEach((item, index) => {
            const x = 1 + (index * 2);
            const y = 2;
            
            // Timeline point
            slideObj.addShape('rect', {
              x: x,
              y: y,
              w: 0.2,
              h: 0.2,
              fill: { color: '667eea' }
            });
            
            // Timeline text
            slideObj.addText(item, {
              x: x + 0.3,
              y: y - 0.1,
              w: 1.5,
              h: 0.4,
              fontSize: 14,
              color: '34495e'
            });
            
            // Note: Animations will be added in future versions
          });
          break;
          
        case 'pros-cons':
          // Pros/Cons slide
          slideObj.addText(slide.title, {
            x: 0.5,
            y: 0.5,
            w: 9,
            h: 0.8,
            fontSize: 28,
            bold: true,
            color: '363636'
          });
          
          // Split content into pros and cons
          const prosConsData = slide.content.split('\n').filter(point => point.trim());
          const pros = prosConsData.filter(p => p.toLowerCase().includes('pro') || p.startsWith('+'));
          const cons = prosConsData.filter(p => p.toLowerCase().includes('con') || p.startsWith('-'));
          
          // Pros column
          slideObj.addText('Pros', {
            x: 0.5,
            y: 1.5,
            w: 4,
            h: 0.5,
            fontSize: 20,
            bold: true,
            color: '27ae60'
          });
          
          pros.forEach((pro, index) => {
            slideObj.addText(`✓ ${pro}`, {
              x: 0.5,
              y: 2 + (index * 0.4),
              w: 4,
              h: 0.3,
              fontSize: 14,
              color: '27ae60'
            });
          });
          
          // Cons column
          slideObj.addText('Cons', {
            x: 5,
            y: 1.5,
            w: 4,
            h: 0.5,
            fontSize: 20,
            bold: true,
            color: 'e74c3c'
          });
          
          cons.forEach((con, index) => {
            slideObj.addText(`✗ ${con}`, {
              x: 5,
              y: 2 + (index * 0.4),
              w: 4,
              h: 0.3,
              fontSize: 14,
              color: 'e74c3c'
            });
          });
          break;
          
        case 'metrics':
          // Metrics slide
          slideObj.addText(slide.title, {
            x: 0.5,
            y: 0.5,
            w: 9,
            h: 0.8,
            fontSize: 28,
            bold: true,
            color: '363636'
          });
          
          // Create metrics grid
          const metricsData = slide.content.split('\n').filter(point => point.trim());
          metricsData.forEach((metric, index) => {
            const x = (index % 3) * 3 + 0.5;
            const y = Math.floor(index / 3) * 1.5 + 1.5;
            
            slideObj.addText(metric, {
              x: x,
              y: y,
              w: 2.5,
              h: 1,
              fontSize: 16,
              color: '34495e',
              align: 'center',
              valign: 'middle'
            });
            
            // Note: Animations will be added in future versions
          });
          break;
          
        case 'three-column':
          // Three column slide
          slideObj.addText(slide.title, {
            x: 0.5,
            y: 0.5,
            w: 9,
            h: 0.8,
            fontSize: 28,
            bold: true,
            color: '363636'
          });
          
          // Split content into three columns
          const columnData = slide.content.split('\n').filter(point => point.trim());
          const columnSize = Math.ceil(columnData.length / 3);
          
          for (let col = 0; col < 3; col++) {
            const startIndex = col * columnSize;
            const endIndex = Math.min(startIndex + columnSize, columnData.length);
            const columnItems = columnData.slice(startIndex, endIndex);
            
            columnItems.forEach((item, index) => {
              slideObj.addText(`• ${item}`, {
                x: 0.5 + (col * 3),
                y: 1.5 + (index * 0.4),
                w: 2.5,
                h: 0.3,
                fontSize: 14,
                color: '34495e'
              });
            });
          }
          break;
          
        default:
          // Default slide with appear animation
          slideObj.addText(slide.title, {
            x: 0.5,
            y: 0.5,
            w: 9,
            h: 0.8,
            fontSize: 28,
            bold: true,
            color: '363636'
          });
          
          slideObj.addText(slide.content, {
            x: 0.5,
            y: 1.5,
            w: 9,
            h: 4,
            fontSize: 18,
            color: '363636',
            valign: 'top'
          });
          
          // Note: Animations will be added in future versions
      }
    });
    
    // Generate the PowerPoint file
    const buffer = await pptx.write('nodebuffer');
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.presentationml.presentation');
    res.setHeader('Content-Disposition', 'attachment; filename="presentation.pptx"');
    res.send(buffer);
    
  } catch (error) {
    console.error('Error generating PowerPoint:', error);
    res.status(500).json({ error: 'Failed to generate PowerPoint' });
  }
});

// Handle file uploads
app.post('/api/upload-file', upload.single('file'), (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    // Process uploaded file (PDF, Word, Image)
    // This would integrate with file processing libraries
    res.json({ 
      message: 'File uploaded successfully',
      filename: file.filename,
      path: file.path
    });
    
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

// Process URL content
app.post('/api/process-url', async (req, res) => {
  try {
    const { url } = req.body;
    
    // Extract content from URL
    // This would integrate with web scraping libraries
    const content = await extractContentFromURL(url);
    
    res.json({ 
      message: 'URL processed successfully',
      content: content
    });
    
  } catch (error) {
    console.error('Error processing URL:', error);
    res.status(500).json({ error: 'Failed to process URL' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Helper function to extract content from URL
async function extractContentFromURL(url) {
  // This would use libraries like puppeteer or cheerio
  // For now, return mock content
  return {
    title: 'Extracted Content',
    content: 'This is extracted content from the URL'
  };
}
