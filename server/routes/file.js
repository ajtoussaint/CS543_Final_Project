const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const { GridFSBucket } = require('mongodb');

// Configure multer to store files in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

// uploads a file and returns the file ID
router.post('/file', upload.single('file'), (req, res) => {
    console.log("POST request to api/upload", req.file.originalname);
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    // Create a stream to MongoDB GridFS
    const bucket = new GridFSBucket(mongoose.connection.db, {
        bucketName: 'uploads',
    });

    const uploadStream = bucket.openUploadStream(req.file.originalname, {
        contentType: req.file.mimetype,
    });

    // Stream the file buffer to MongoDB
    uploadStream.end(req.file.buffer);

    uploadStream.on('finish', () => {
        res.status(201).json({ message: 'File uploaded successfully', fileId: uploadStream.id });
    });

    uploadStream.on('error', (err) => {
        console.error(err);
        res.status(500).json({ message: 'File upload failed' });
    });
});

//gets a file based on the Id
router.get('/file/:id', async (req, res) => {
    console.log("GET request to /file");
    const bucket = new GridFSBucket(mongoose.connection.db, {
        bucketName: 'uploads',
    });

    const cursor = bucket.find({_id: new mongoose.Types.ObjectId(req.params.id)});
    for await (const doc of cursor) {
        console.log(doc);
        const downloadStream = bucket.openDownloadStream(doc._id);
        downloadStream.pipe(res);
        downloadStream.on("close", () => console.log("download done"));
        downloadStream.on('error', (err) => {
            console.error(err);
            res.status(500).json({ message: 'File download failed' });
        });
    }
})

module.exports = router;