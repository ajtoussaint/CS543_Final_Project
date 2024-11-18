const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
    title: String,
    type: String,
    creatorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:true
    },
    fileId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"uploads.files"
    }
});

const Media = mongoose.model("Media", mediaSchema);

module.exports = Media;