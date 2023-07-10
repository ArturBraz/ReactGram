const multer = require("multer")
const path = require("path")

//Destination to store image
const imageStore = multer.diskStorage({
    destination: (req,file,cb)=> {
        let folder = ""

        if(req.baseUrl.includes("users")){
            folder = "users"
        }else if(req.baseUrl.includes("photos")){
            folder = "photos"
        }

        //callback
        cb(null,`uploads/${folder}/`)
    },

    //if need scale system check the lib "uuid" for unique name file
    filename:  (req,file,cb) => {

        cb(null, Date.now() + path.extname(file.originalname)) //ex.: 5151hgj68898.jpg
    }
})

const imageUpload = multer({
    storage: imageStore,
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(png|jpg)$/)){

            //upload only png and jpg formats
            return cb(new Error("Por favor, envie apenas no formato .png ou .jpg"))
        }
        cb(undefined, true)
    }
})

module.exports = {imageUpload};