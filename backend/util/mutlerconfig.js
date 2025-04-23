const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,path.join(__dirname,'uploads'));
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const baseName = path.basename(file.originalname, ext);
        const timestamp = Date.now();
        cb(null, `${baseName}-${timestamp}${ext}`); // yha pr kuch ase file aayegi basename then ime then ext
      }
    });
    
    const upload = multer({ storage: storage });
    
    module.exports = upload;