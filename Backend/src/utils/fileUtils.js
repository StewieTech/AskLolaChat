// utils/fileUtils.js
const fs = require('fs');
const path = require('path');

const listImagesFromDirectory = (subDirectory) => {
    return new Promise((resolve, reject) => {
        // const directoryPath = path.join(__dirname, '..', 'client', 'public', subDirectory);
        const directoryPath = path.join(__dirname, '..', '..', '..', 'client', 'public', subDirectory);

        // console.log("this is the directoryPath: ", directoryPath)
        fs.readdir(directoryPath, (err, files) => {
            if (err) {
                console.error(`Error reading directory: ${directoryPath}`, err);
                reject('Failed to list images');
            } else {
                const imageFiles = files
                    .filter(file => /\.(jpg|jpeg|png|gif|webp|mp4)$/i.test(file))
                    .map(file => `/${subDirectory}/${file}`);
                resolve(imageFiles);
            }
        });
    });
};

module.exports = { listImagesFromDirectory };
