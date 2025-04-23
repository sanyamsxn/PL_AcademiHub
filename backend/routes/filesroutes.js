
const express = require('express');
const router = express.Router();
const upload = require('../util/mutlerconfig'); 

router.post('/upload', upload.single('file'), (req,res)=>
{
    // controllers/uploadController.js

    const subject = req.body.subject;
    const file = req.file;
  
    if (!file) {
      return res.status(400).send(' File not uploaded!');
    }
  
    console.log('Subject:', subject);
    console.log('Uploaded File:', file.filename);
  
    
  
    res.render('dashboard', { message: 'File uploaded successfully!' });
  }
  
);


module.exports = router;
