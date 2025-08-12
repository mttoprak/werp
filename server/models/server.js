const mongoose = require('mongoose');

const InviteSchema = new mongoose.Schema({
    code:      { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now }
});

const ServerSchema = new mongoose.Schema({
    name:     { type: String, required: true },
    bio:      { type: String, default: '' },
    photo:    { type: String, default: '' },
    owner:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    admins:   [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    users: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        role: { type: String, enum: ['admin', 'user'], default: 'user' }
    }],
    channels: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Channel' }],
    invites:  [InviteSchema],
}, { timestamps: { createdAt: 'createdAt' } });

module.exports = mongoose.model('Server', ServerSchema);