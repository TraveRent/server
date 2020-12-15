const AWS = require('aws-sdk') // * AWS software development kit for connect into AWS Services
const multer = require('multer') // * Middleware for uploading files
const uuid  = require('uuid').v4 // * Generate Random UUID

const s3 = new AWS.S3({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
})

const storage = multer.memoryStorage({
  destination: (req, file, callback) => {
    callback(null, '')
  }
})

const uploadMiddleware = multer({ storage }).fields([{ name: 'imageKTP', maxCount: 1 }, { name: 'imageSIM', maxCount: 1 }])

module.exports = {
  uploadMiddleware: uploadMiddleware,
  s3AWSUploadImage: ({ originalname, buffer, mimetype }) => {
    return new Promise ((resolve, reject) => {
      const myFile = originalname.split('.')
      const fileType = myFile[myFile.length - 1]
  
      s3.upload({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `${uuid()}.${fileType}`,
        Body: buffer,
        ContentType: mimetype
      }, (err, { Location }) => {
        if(err) return reject(new Error('Failed to upload image'))
        resolve(Location)
      })
    })
  }
}
