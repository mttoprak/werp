const mongoose = require('mongoose');

const ChannelSchema = new mongoose.Schema({
    server:   { type: mongoose.Schema.Types.ObjectId, ref: 'Server', required: true },
    name:     { type: String, required: true },
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
}, { timestamps: true });

module.exports = mongoose.model('Channel', ChannelSchema);