// controllers/dashboardController.js
const path = require('path');
const fs = require('fs');
const File = require('../models/file'); // Mongoose model
//const sharp = require('sharp');
//const libre = require('libreoffice-convert');

exports.getDashboardPage = (req, res) => {
  res.status(202).send("hello");

};

exports.handleFileUpload = async (req, res) => {
    console.log("Entering here");
    console.log(req);
    const { subject, uploadedBy } = req.body;
    const file = req.file;
    if(!file){
        return res.send(404).json({
            message : "plese uploadfile"
        })
    }

    const trimmed = file.filename.substring(0,15);
    const newFile = new File({
        subject: subject,
        filename: `${trimmed}_manipalMUJ`,
        filepath: `files/${file.filename}`,
        downloaded: 0, // Initialize download count
        uploadedBy : uploadedBy.split(' ')[0].toUpperCase()
      });
      try {
        await newFile.save();
        return res.status(200).json({ success: true, message: 'File uploaded successfully'});
      } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error saving file ' });
      }

  // Same as your earlier upload logic (PDF conversion)
  // Save into MongoDB too (with downloadCount: 0)
};

exports.handleFileDownload = async (req, res) => {
    const { filename } = req.query;
    try{
        const file  =  await File.findOne({filename : filename});
        if (!file) {
            return res.status(404).json({ message: "File not found" });
          }
      
          file.downloaded += 1;
          await file.save();
        const fullpath =  path.resolve(file.filepath);
        return res.download(fullpath);

    }catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
      }
    
  // Find file by subject or name
  // Increase downloadCount by 1
  // Send file as response
};

exports.getMostDownloadedFiles = async (req, res) => {
    try{
        const files = await File.find().sort({downloaded: -1}).limit(20);
        res.status(200).json({
            success: true,
            count : files.length,
            message : "file get",
            data : files
        })}catch (err) {
            console.error('Error fetching top downloaded files:', err);
            res.status(500).json({ success: false, message: 'server error ' });
          }
        
    
    }


  
    exports.getsubjectfiles = async(req,res) =>{
      const filter = req.query.filter;
      console.log(filter);
      try {
        const files = await File.find({subject : filter})

        if(!files){
          return res.status(404).json({ message: "File not found" });
        }
        
        console.log(files);
        res.status(202).json({
          message : "success",
          success: true,
          count : files.length,
          files : files

        })

      }catch(err){
        res.status(500).json({ success: false, message: 'server error ' });
      }

    }

 


    