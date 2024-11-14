const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
    title: String,
    type: String,
    creatorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:true
    }
});

const Media = mongoose.model("Media", mediaSchema);

module.exports = Media;