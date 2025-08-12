const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Channel = require('../models/channel');
const Message = require('../models/message');
const Server = require('../models/server');

// GET /api/messages/:channelId?limit=30&skip=0
router.get('/:channelId', auth, async (req, res) => {
    const { channelId } = req.params;
    const limit = parseInt(req.query.limit) || 30;
    const skip = parseInt(req.query.skip) || 0;

    try {
        // Kanalı ve bağlı olduğu sunucuyu bul
        const channel = await Channel.findById(channelId);
        if (!channel) return res.status(404).json({ msg: 'Kanal bulunamadı.' });

        const server = await Server.findById(channel.server);
        if (!server) return res.status(404).json({ msg: 'Sunucu bulunamadı.' });

        // Kullanıcı sunucuda mı kontrol et
        const isMember = server.users.some(u => u.user?.toString() === req.user._id);
        if (!isMember) return res.status(403).json({ msg: 'Bu sunucuda değilsiniz.' });

        // Mesajları getir
        const messages = await Message.find({ channel: channelId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        res.json(messages.reverse()); // En eski en başta olacak şekilde
    } catch (err) {
        res.status(500).json({ msg: 'Mesajlar alınırken hata oluştu.' });
    }
});

module.exports = router;