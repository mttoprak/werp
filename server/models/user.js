const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    nickname: { type: String, required: true, unique: true },
    email:    { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    bio:      { type: String, default: '' },
    friends:        [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    friendRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    servers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Server' }],
    dms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'DM' }],
}, { timestamps: { createdAt: 'createdAt' } });

module.exports = mongoose.model('User', UserSchema);