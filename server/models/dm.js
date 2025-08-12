const mongoose = require('mongoose');

const DMSchema = new mongoose.Schema({
    userIds:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
}, { timestamps: true });

module.exports = mongoose.model('DM', DMSchema);