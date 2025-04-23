// controllers/uploadController.js
const path = require('path');
const fs = require('fs');
const libre = require('libreoffice-convert');
const sharp = require('sharp');

const handleFileUpload = async (req, res) => {
  const file = req.file;
  const subject = req.body.subject;

  if (!file) return res.status(400).send('No file uploaded.');

  const ext = path.extname(file.originalname).toLowerCase();
  const inputPath = file.path;
  const outputPath = path.join(__dirname, '..', 'pdfs', `${path.basename(file.filename, ext)}.pdf`);

  try {
    if (['.jpg', '.jpeg', '.png'].includes(ext)) {
      // Image convert
      await sharp(inputPath)
        .resize({ fit: 'contain', width: 800 })
        .toFormat('pdf')
        .toFile(outputPath);
    } else if (['.ppt', '.pptx', '.docx', '.doc', '.xls'].includes(ext)) {
      // Office file to PDF using libreoffice
      const inputBuffer = fs.readFileSync(inputPath); // ye binary me read kr rha hai smja 
      libre.convert(inputBuffer, '.pdf', undefined, (err, done) => {
        if (err) return res.status(500).send('not covetr'); // you cant use render also here

        fs.writeFileSync(outputPath, done);
      });
    } else {
      return res.status(400).send('Unsupported file type for PDF conversion.');
    }

    res.send(`File uploaded and converted to PDF successfully: ${path.basename(outputPath)}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Something went wrong.');
  }
};

module.exports = { handleFileUpload };
