// server/routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Kayıt ol (Register)
router.post('/register', async (req, res) => {
    try {
        const { nickname, email, password } = req.body;
        if (!nickname || !email || !password) {
            return res.status(400).json({ msg: 'Tüm alanlar zorunlu.' });
        }

        const existingUser = await User.findOne({ $or: [{ email }, { nickname }] });
        if (existingUser) {
            if (existingUser.email === email) {
                return res.status(400).json({ msg: 'Email zaten kullanımda.' });
            }
            if (existingUser.nickname === nickname) {
                return res.status(400).json({ msg: 'Nickname zaten kullanımda.' });
            }
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({ nickname, email, passwordHash });
        await newUser.save();

        res.status(201).json({ msg: 'Kullanıcı başarıyla oluşturuldu.' });
    } catch (err) {
        console.error('Register error:', err);
        res.status(500).json({ msg: 'Sunucu hatası.' });
    }
});

// Giriş yap (Login)
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ msg: 'Email ve şifre zorunlu.' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Kullanıcı bulunamadı.' });
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Şifre hatalı.' });
        }

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.json({
            token,
            user: {
                _id: user._id,
                nickname: user.nickname,
                email: user.email,
            },
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ msg: 'Sunucu hatası.' });
    }
});

module.exports = router;