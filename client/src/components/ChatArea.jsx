import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

export default function ChatArea({ user, activeChannelId }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [skip, setSkip] = useState(0);
    const [idToName, setIdToName] = useState({});
    const limit = 30;
    const messagesEndRef = useRef(null);
    const containerRef = useRef(null);
    const socketRef = useRef(null);

    // Socket bağlantısı
    useEffect(() => {
        if (!user?._id) return;
        socketRef.current = io('http://localhost:5000');
        socketRef.current.emit('register', user._id);
        return () => {
            socketRef.current.disconnect();
        };
    }, [user]);

    // Kanal değişince mesajları sıfırla ve ilk mesajları çek
    useEffect(() => {
        setMessages([]);
        setSkip(0);
        setHasMore(true);
        setIdToName({});
        if (activeChannelId) {
            fetchMessages(0, true);
        }
    }, [activeChannelId]);

    // Socket ile yeni mesajları dinle
    useEffect(() => {
        if (!socketRef.current || !activeChannelId) return;
        socketRef.current.emit('join_channel', activeChannelId);

        const handleReceive = (data) => {
            setMessages((prev) => [
                ...prev,
                {
                    _id: data._id,
                    sender: data.sender,
                    content: data.message,
                    createdAt: data.createdAt,
                },
            ]);
        };
        socketRef.current.on('receive_message', handleReceive);

        return () => {
            socketRef.current.off('receive_message', handleReceive);
        };
    }, [activeChannelId]);

    // Mesajları API'den çek
    const fetchMessages = async (currentSkip, reset = false) => {
        if (!user?.token || !activeChannelId) return;
        setLoading(true);
        try {
            const res = await axios.get(
                `http://localhost:5000/api/messages/${activeChannelId}?limit=${limit}&skip=${currentSkip}`,
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            if (res.data.length < limit) setHasMore(false);
            setMessages((prev) => reset ? res.data : [...res.data, ...prev]);
            setSkip(currentSkip + res.data.length);
        } catch (err) {
            console.error('Mesajlar çekilirken hata:', err);
        } finally {
            setLoading(false);
        }
    };

    // Scroll en üste gelince eski mesajları çek
    const handleScroll = () => {
        if (!containerRef.current) return;
        if (containerRef.current.scrollTop === 0 && hasMore && !loading) {
            fetchMessages(skip, false);
        }
    };

    useEffect(() => {
        const ref = containerRef.current;
        if (ref) ref.addEventListener('scroll', handleScroll);
        return () => {
            if (ref) ref.removeEventListener('scroll', handleScroll);
        };
    }, [skip, hasMore, loading]);

    // Yeni mesaj gelince en alta kaydır
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Mesajlardaki unique sender id'ler için nickname çek
    useEffect(() => {
        const uniqueIds = [...new Set(messages.map(msg => msg.sender))];
        const missingIds = uniqueIds.filter(id => !idToName[id]);
        if (missingIds.length === 0) return;

        const fetchNames = async () => {
            const newIdToName = {};
            await Promise.all(missingIds.map(async (id) => {
                try {
                    const res = await axios.get(
                        `http://localhost:5000/api/users/${id}`,
                        {
                            headers: {
                                Authorization: `Bearer ${user.token}`,
                                "Content-Type": "application/json",
                            },
                        }
                    );
                    newIdToName[id] = res.data.nickname;
                } catch {
                    newIdToName[id] = id;
                }
            }));
            setIdToName(prev => ({ ...prev, ...newIdToName }));
        };
        fetchNames();
    }, [messages, idToName, user]);

    // Mesaj gönder
    const sendMessage = () => {
        if (!input.trim() || !activeChannelId) return;
        socketRef.current.emit('send_message', {
            channelId: activeChannelId,
            message: input,
            sender: user._id
        });
        setInput('');
    };

    return (
        <div
            ref={containerRef}
            style={{ height: '500px', overflowY: 'auto', border: '1px solid #333', background: '#222', color: '#fff', padding: 8 }}
        >
            {loading && <div>Yükleniyor...</div>}
            {messages.map((msg) => (
                <div key={msg._id || Math.random()}>
                    <b>{idToName[msg.sender] || msg.sender}</b>: {msg.content}
                </div>
            ))}
            <div ref={messagesEndRef} />
            <div style={{ marginTop: 8 }}>
                <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    style={{ width: '80%' }}
                    onKeyDown={e => e.key === 'Enter' && sendMessage()}
                />
                <button onClick={sendMessage} style={{ width: '18%', marginLeft: 4 }}>Gönder</button>
            </div>
        </div>
    );
}