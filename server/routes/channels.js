const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Server = require('../models/server');
const Channel = require('../models/channel');

// Kanal listesini alma
// GET api/channels/:serverId
// server/routes/channels.js

router.get('/:serverId', async (req, res) => {
    try {
        const { serverId } = req.params;
        const channels = await Channel.find({ server: serverId }).select('_id name').lean();
        res.json(channels);
    } catch (err) {
        res.status(500).json({ error: 'Kanal listesi alınamadı.' });
    }
});

// Kanal oluşturma
// POST api/channels/create
router.post('/create', auth, async (req, res) => {
    const { serverId, name } = req.body;

    if (!serverId || !name) {
        return res.status(400).json({ msg: 'Sunucu ID ve kanal adı zorunludur.' });
    }

    try {
        const server = await Server.findById(serverId);
        if (!server) {
            return res.status(404).json({ msg: 'Sunucu bulunamadı.' });
        }

        // Kanalı oluştur ve kaydet
        const newChannel = new Channel({
            name,
            server: serverId
        });
        await newChannel.save();

        // Kanalı sunucuya ekle
        server.channels.push(newChannel._id);
        await server.save();

        res.status(201).json(newChannel);
    } catch (err) {
        console.error('Kanal oluşturma hatası:', err);
        res.status(500).json({ msg: 'Kanal oluşturma hatası.' });
    }
});


// deneme
router.post('/test', auth, async (req, res) => {
    try {
        const lololo =await Server.findById("6875e381f8262aa14333d01e");
        if (!lololo) {
            return res.status(404).json({ msg: 'Sunucu bulunamadı.' });
        }
    }catch (err) {
        console.error('Kanal oluşturma hatası:', err);
        res.status(500).json({ msg: 'Kanal oluşturma hatası.' });
    }
});

module.exports= router;