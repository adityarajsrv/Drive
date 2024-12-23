const express = require('express')
const authMiddleware = require('../middlewares/auth')
const path = require('path')
const multer = require('multer')
const fs = require('fs')

const router = express.Router()

const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null, path.join(__dirname, '../uploads'))
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random()*1E9)
        cb(null, uniqueSuffix + '-' + file.originalname)
    }
})

const upload = multer({storage})

router.post('/upload-file', authMiddleware, upload.single('file'), (req,res)=>{
    if(!req.file){
        return res.status(400).json({
            message: 'No file uploaded'
        })
    }

    res.status(200).json({
        message: 'File uploaded successfully',
        filePath: `/uploads/${req.file.filename}`
    })
})

router.get('/files', authMiddleware, (req,res)=>{
    const uploadDir = path.join(__dirname, '../uploads')

    fs.readdir(uploadDir, (err,files)=>{
        if(err){
            return res.status(500).json({
                message: 'Failed to retrieve files'
            })
        }

        const fileDetails = files.map((file)=>{
            const filePath = path.join(uploadDir, file)
            const isImage = /\.(png|jpe?g|gif|svg|webp)$/i.test(file);
            return {
                name: file,
                path: `/uploads/${file}`,
                isImage
            }
        })

        res.render('files', {files: fileDetails})
    })
})

router.delete('/files/:filename', authMiddleware, (req,res)=>{
    const filePath = path.join(__dirname, '../uploads', req.params.filename)

    fs.unlink(filePath, (err)=>{
        if(err){
            return res.status(500).json({
                message: 'Failed to delete file'
            })
        }

        res.status(200).json({
            message: 'File deleted successfully'
        })
    })
})

router.get('/home', authMiddleware, (req, res) => {
    res.render('home');
})

module.exports = router