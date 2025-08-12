const http = require('http');
const socketIo = require('socket.io');
const express = require('express');
const mongoose = require('mongoose');
const Message = require('./models/message');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: '*' } });

const onlineUsers = new Map();

io.on('connection', (socket) => {
    socket.on('register', (userId) => {
        console.log(`Kullanıcı ${userId} socket ile kaydoldu: ${socket.id}`);
        onlineUsers.set(userId, socket.id);
    });

    // Kanal katılımı
    socket.on('join_channel', (channelId) => {
        socket.join(channelId);
        console.log(`Socket ${socket.id} kanala katıldı: ${channelId}`);
    });

    // aşşağıda rastgele bir özellik yazacağım
    // Kanal mesajlarını al ve yayınla
    // işte kod:
    // server/index.js
    



    // Kanal mesajı dinle ve yayınla
    // server/index.js
    socket.on('send_message', async ({ channelId, message, sender }) => {
        try {
            // Mesajı veritabanına kaydet
            const newMessage = await Message.create({
                channel: channelId,
                content: message,
                sender: sender,
            });

            // Mesajı kanala yayınla
            io.to(channelId).emit('receive_message', {
                message: newMessage.content,
                sender: newMessage.sender,
                _id: newMessage._id,
                createdAt: newMessage.createdAt
            });
        } catch (err) {
            console.error('Mesaj kaydetme hatası:', err);
        }
    });

    socket.on('disconnect', () => {
        for (const [userId, id] of onlineUsers.entries()) {
            if (id === socket.id) onlineUsers.delete(userId);
        }
    });
});
app.set('io', io);
app.set('onlineUsers', onlineUsers);

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.send('🚀');
});

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const userRoutes = require('./routes/users');
app.use('/api/users', userRoutes);

const serverRoutes = require('./routes/servers');
app.use('/api/servers', serverRoutes);

const channelRoutes = require('./routes/channels');
app.use('/api/channels', channelRoutes);

const messageRoutes = require('./routes/messages');
app.use('/api/messages', messageRoutes);

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('MongoDB bağlantısı başarılı');
    server.listen(process.env.PORT || 5000, () => {
        console.log(`Server http://localhost:${process.env.PORT || 5000} portunda çalışıyor`);
    });
}).catch((err) => {
    console.error('MongoDB bağlantı hatası:', err);
});