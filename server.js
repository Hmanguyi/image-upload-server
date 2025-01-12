const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();

// Use the environment variable or default to 'uploads'
const uploadFolder = process.env.UPLOAD_FOLDER_PATH || 'uploads';

// Ensure the folder exists
if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder, { recursive: true });
}

// Set up multer to store uploaded files
const upload = multer({ dest: uploadFolder });

// API to handle file upload
app.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const tempPath = req.file.path;
    const targetPath = path.join(__dirname, uploadFolder, req.file.originalname);

    fs.rename(tempPath, targetPath, (err) => {
        if (err) return res.status(500).send(err);
        res.send('File uploaded successfully!');
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
