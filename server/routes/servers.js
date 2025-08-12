const express = require('express');
const router = express.Router();
const User = require('../models/user');
const auth = require('../middleware/auth');
const Server = require('../models/server');


//Sunucu açma
router.post('/create', auth, async (req, res) => {
    const {name, bio, photo} = req.body;

    if (!name) {
        return res.status(400).json({msg: 'Sunucu adı zorunludur.'});
    }

    //console.log(req.user._id);
    //req.user.id

    try {
        const newServer = new Server({
            name,
            bio: bio || '',
            photo: photo || '',
            owner: req.user._id,
            users: [{ user: req.user._id, role: 'user' }],
        });

        await newServer.save();

        // Kullanıcıyı sunucuya ekle
        await User.findByIdAndUpdate(req.user._id, {
            $push: { servers: newServer._id }
        });

        res.status(201).json(newServer);
    } catch (err) {
        console.error('Sunucu oluşturma hatası:', err);
        res.status(500).json({msg: 'Sunucu hatası.'});
    }
});

// Sunucu silme
router.delete('/delete/:id', auth, async (req, res) => {
    const {id} = req.params;

    if (!id || id === 'undefined') {
        return res.status(400).json({msg: 'Geçersiz sunucu ID'});
    }

    try {
        const server = await Server.findById(id);
        if (!server) {
            return res.status(404).json({msg: 'Sunucu bulunamadı'});
        }

        // Sunucuyu sil
        await Server.findByIdAndDelete(id);

        // Kullanıcıyı sunucudan çıkar
        await User.updateMany(
            {servers: {$elemMatch: {server: id}}},
            {$pull: {servers: {server: id}}}
        );

        res.json({msg: 'Sunucu başarıyla silindi.'});
    } catch (err) {
        console.error('Sunucu silme hatası:', err);
        res.status(500).json({msg: 'Sunucu hatası.'});
    }
});


// Sunucu bilgilerini alma
// GET api/servers/:id
router.get('/:id', auth, async (req, res) => {
    const {id} = req.params;

    if (!id || id === 'undefined') {
        return res.status(400).json({msg: 'Geçersiz sunucu ID'});
    }

    try {
        const server = await Server.findById(id).populate('users', '-passwordHash');
        if (!server) {
            return res.status(404).json({msg: 'Sunucu bulunamadı'});
        }
        res.json(server);
    } catch (err) {
        console.error('Sunucu bilgisi alınırken hata:', err);
        res.status(500).json({msg: 'Sunucu hatası'});
    }
});


//İnvite kodu oluşturma
router.post('/invite/:id', auth, async (req, res) => {
    const {id} = req.params;
    if (!id || id === 'undefined') {
        return res.status(400).json({msg: 'Geçersiz sunucu ID'});
    }
    try {
        const server = await Server.findById(id);
        if (!server) {
            return res.status(404).json({msg: 'Sunucu bulunamadı'});
        }

        // Yeni invite kodu oluştur
        const code = new Date().getTime().toString(36) + Math.random().toString(36).substring(2, 15);

        // Invite bilgilerini sunucuya ekle
        server.invites.push({
            code,
            createdBy: req.user._id,
            createdAt: new Date()
        });

        await server.save();

        res.json({msg: 'Invite kodu başarıyla oluşturuldu.', code});

    } catch (err) {
        console.error('Invite oluşturma hatası:', err);
        res.status(500).json({msg: 'Sunucu hatası.'});
    }
});

//İnvite kodu ile serverIDsi çekme
router.get('/invite/:code', auth, async (req, res) => {
    const {code} = req.params;

    if (!code || code === 'undefined') {
        return res.status(400).json({msg: 'Geçersiz invite kodu'});
    }

    try {
        const server = await Server.findOne({ 'invites.code': code });
        if (!server) {
            return res.status(404).json({msg: 'Sunucu bulunamadı'});
        }
        res.json({serverId: server._id});
    } catch (err) {
        console.error('Invite ile sunucu bilgisi alınırken hata:', err);
        res.status(500).json({msg: 'Sunucu hatası'});
    }
});

router.delete('/invite/:code', auth, async (req, res) => {
    const  {code} = req.params;

    if (!code || code === 'undefined') {
        return res.status(400).json({msg: 'Geçersiz invite kodu'});
    }

    try{
        const server = await Server.findOneAndUpdate(
            { 'invites.code': code },
            { $pull: { invites: { code } } },
            { new: true }
        );

        if (!server) {
            return res.status(404).json({msg: 'Sunucu bulunamadı veya invite kodu mevcut değil'});
        }

        res.json({msg: 'Invite kodu başarıyla silindi.', server});


    }catch(err){
        console.error('Invite kodu silme hatası:', err);
        res.status(500).json({msg: 'Sunucu hatası.'});
    }

})



// Sunucuya kullanıcı ekleme
router.put('/addUser/:id', auth, async (req, res) => {
    const {id} = req.params;
    const {userId, role} = req.body;

    if (!id || id === 'undefined') {
        return res.status(400).json({msg: 'Geçersiz sunucu ID'});
    }

    if (!userId) {
        return res.status(400).json({msg: 'Kullanıcı ID zorunludur.'});
    }

    try {
        const server = await Server.findById(id);

        if (!server) {
            return res.status(404).json({msg: 'Sunucu bulunamadı'});
        }

        // Kullanıcıyı sunucuya ekle
        server.users.push({user: userId, role: role || 'user'});
        await server.save();

        // Kullanıcıyı kendi sunucularına ekle
        await User.findByIdAndUpdate(userId, {
            $addToSet: {servers: id}
        });

        res.json({msg: 'Kullanıcı başarıyla eklendi.', server});

    } catch (err) {

        console.error('Kullanıcı ekleme hatası:', err);
        res.status(500).json({msg: 'Sunucu hatası.'});

    }
});

// Sunucudan kullanıcı çıkarma
router.put('/removeUser/:id', auth, async (req, res) => {
    const {id} = req.params;
    const {userId} = req.body;

    if (!id || id === 'undefined') {
        return res.status(400).json({msg: 'Geçersiz sunucu ID'});
    }

    if (!userId) {
        return res.status(400).json({msg: 'Kullanıcı ID zorunludur.'});
    }


    try {
        const reqServer = await Server.findById();
        //req.user._id
        if (!reqUser.servers.includes(id)) {
            return res.status(403).json({msg: 'Bu sunucuda değilsiniz.'});
        }


    }catch(err){

    }

    try {
        const server = await Server.findById(id);

        if (!server) {
            return res.status(404).json({msg: 'Sunucu bulunamadı'});
        }

        // Kullanıcıyı sunucudan çıkar
        server.users = server.users.filter(user => user.user.toString() !== userId);
        await server.save();

        // Kullanıcıyı kendi sunucularından çıkar
        await User.findByIdAndUpdate(userId, {
            $pull: {servers: id}
        });

        res.json({msg: 'Kullanıcı başarıyla çıkarıldı.', server});

    } catch (err) {

        console.error('Kullanıcı çıkarma hatası:', err);
        res.status(500).json({msg: 'Sunucu hatası.'});

    }
});



module.exports = router;