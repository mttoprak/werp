const express = require('express');
const router = express.Router();
const User = require('../models/user');
const auth = require('../middleware/auth');



// GET api/users/allServers
router.get('/allServers', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ msg: 'Kullanıcı bulunamadı' });

        // Sunucu id'lerini döndür
        res.json(user.servers);
    } catch (err) {
        console.error('Sunucular alınırken hata:', err);
        res.status(500).json({ msg: 'Sunucu hatası' });
    }
});

// Kullanıcı bilgilerini alma


// GET api/users/:id
router.get('/:id', auth, async (req, res) => {
    const { id } = req.params;

    // Geçersiz veya eksik id kontrolü
    if (!id || id === 'undefined') {
        return res.status(400).json({ msg: 'Geçersiz kullanıcı ID' });
    }

    try {
        const user = await User.findById(id).select('-passwordHash');
        if (!user) {
            return res.status(404).json({ msg: 'Kullanıcı bulunamadı' });
        }
        res.json(user);
    } catch (err) {
        console.error('Kullanıcı bilgisi alınırken hata:', err);
        res.status(500).json({ msg: 'Sunucu hatası' });
    }
});

// sunucu içinde kullanıcı arama özelliği
// GET api/users/search/:serverid/:nickname
router.get('/search/:serverid/:nickname', auth, async (req, res) => {
    const { serverid, nickname } = req.params;

    // Geçersiz veya eksik parametre kontrolü
    if (!serverid || !nickname) {
        return res.status(400).json({ msg: 'Geçersiz sunucu ID veya kullanıcı adı' });
    }

    try {
        const users = await User.find({
            serverId: serverid,
            nickname: new RegExp(`^${nickname}`, 'i') // Büyük/küçük harf duyarsız arama
        }).select('-passwordHash');

        if (users.length === 0) {
            return res.status(404).json({ msg: 'Kullanıcı bulunamadı' });
        }
        res.json(users);
    } catch (err) {
        console.error('Kullanıcı arama hatası:', err);
        res.status(500).json({ msg: 'Sunucu hatası' });
    }

});

// PUT api/users/addFriend/:nickname

router.put('/addFriend/:nickname', auth, async (req, res) => {
    try {
        const toUser = await User.findOne({ nickname: req.params.nickname });
        if (!toUser) return res.status(404).json({ msg: 'Kullanıcı bulunamadı' });

        // Aynı istek daha önce gönderilmiş mi kontrol et
        const existing = await FriendRequest.findOne({
            from: req.user.id,
            to: toUser._id,
            status: 'pending'
        });
        if (existing) return res.status(400).json({ msg: 'Zaten istek gönderilmiş' });

        // Yeni arkadaşlık isteği oluştur
        const request = new FriendRequest({
            from: req.user.id,
            to: toUser._id,
            status: 'pending'
        });
        await request.save();

        // Bildirim gönder (Socket.IO)
        const io = req.app.get('io');
        const onlineUsers = req.app.get('onlineUsers');
        const toSocketId = onlineUsers.get(toUser._id.toString());
        if (toSocketId) {
            io.to(toSocketId).emit('friendRequest', {
                from: req.user.id,
                nickname: req.user.nickname
            });
        }

        res.json({ msg: 'Arkadaşlık isteği gönderildi' });
    } catch (err) {
        res.status(500).json({ msg: 'Sunucu hatası' });
    }
});


// PUT api/users/acceptFriend/:requestId
// yapılacak






module.exports = router;