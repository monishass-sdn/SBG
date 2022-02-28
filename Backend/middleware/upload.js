
const multer=require('multer')
const path = require("path") 


const storage = multer.diskStorage({
  
    destination: function(req, file, cb) {
      console.log('hiiiii')
      cb(null, "Profileuploads/");
    },
 
    filename: function(req, file, cb) {
      let ext=path.extname(file.originalname)
      cb(null, Date.now() + ext);
    }
  })

  const upload = multer({
    storage: storage,
   
    fileFilter: function(req,res,callback){
      
    if (
      
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg"
    ) {
      callback(null,true)
    }
    else{
      console.log('only png and jpg')
      callback(null,false)
    }
  },
  limits:
  {
    fileSize:1024*1024*2
  }
  });
  var uploads = multer({ storage : storage}); 
  
  
      
      
    