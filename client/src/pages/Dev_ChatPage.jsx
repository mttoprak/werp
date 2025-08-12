import React, {useEffect, useRef, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {AuthContext} from "../context/AuthContext.js";
import {io} from 'socket.io-client';
import ChatArea from '../components/ChatArea.jsx';
import CreateServer from "../components/CreateServer.jsx";
import axios from "axios";
import CreateChannel from "../components/CreateChannel.jsx";

export default function DEV_ChatPage() {
    const {user} = React.useContext(AuthContext);
    const socketRef = useRef(null);
    const [servers, setServers] = useState([]);
    const [channels, setChannels] = useState([]);
    const [activeChannelId, setActiveChannelId] = useState(null);
    const [activeServerId, setActiveServerId] = useState(null);
    const {activeServer, activeChannel} = useParams();
    const navigate = useNavigate();

    async function getServerChannels(serverId) {
        try {
            if (!serverId || serverId === 'undefined') {
                console.error('Geçersiz sunucu ID');
                return;
            }
            const response = await axios.get(`http://localhost:5000/api/channels/${serverId}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.status !== 200) throw new Error('Kanal bilgileri alınırken bir hata oluştu.');
            const channels = response.data;
            setChannels(channels || []);
            console.log('Kanal bilgileri başarıyla alındı:', channels);
        } catch (error) {
            console.error('Kanal bilgileri alınırken hata:', error);
        }
    }

    // Sunucu detaylarını axios ile çek
    useEffect(() => {
        async function fetchServers() {
            try {
                const response = await axios.get(`http://localhost:5000/api/users/allServers`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                        "Content-Type": "application/json",
                        //"Cache-Control": "no-cache", // 304'ü engellemek için
                        //"Pragma": "no-cache"
                    },
                });

                const serverIds = response.data;
                const serverDetails = await Promise.all(
                    serverIds.map(async (id) => {
                        try {
                            const res = await axios.get(`http://localhost:5000/api/servers/${id}`, {
                                headers: {
                                    Authorization: `Bearer ${user.token}`,
                                    "Content-Type": "application/json",
                                    //"Cache-Control": "no-cache", // 304'ü engellemek için
                                    //"Pragma": "no-cache"
                                },
                            });
                            return res.data;
                        } catch {
                            return null;
                        }
                    })
                );

                setServers(serverDetails.filter(Boolean));
            } catch (error) {
                console.error('Sunucular alınırken hata:', error);
            }
        }

        fetchServers();
    }, [user]);

    useEffect(() => {
        if (activeServer) {
            setActiveServerId(activeServer);
            getServerChannels(activeServer);
        } else if (activeChannel) {
            setActiveChannelId(activeChannel);

        } else {
            setActiveChannelId(null);
        }
    }, [activeServer, activeChannel]);

    useEffect(() => {
        if (!user?._id) return;
        socketRef.current = io('http://localhost:5000');
        socketRef.current.emit('register', user._id);

        socketRef.current.on('friendRequest', (data) => {
            alert(`Yeni arkadaşlık isteği: ${data.nickname}`);
        });

        return () => {
            socketRef.current.disconnect();
        };
    }, [user]);

    return (
        <div className="h-screen w-screen bg-gray-900 text-white flex">
            {/* Sidebar */}
            <aside className="w-20 md:w-64 bg-gray-800 flex flex-col items-center py-4 border-r border-gray-700">
                <CreateServer/>
                <div className="mt-6 flex-1 w-full">
                    <h2 className="text-xs text-gray-400 mb-2 px-4">Sunucular</h2>
                    <ul>
                        {servers.map((srv) => (
                            <li
                                key={srv._id}
                                className="px-4 py-2 hover:bg-gray-700 rounded cursor-pointer flex items-center">
                                <span
                                    className={`text-sm font-medium truncate flex-1 ${
                                        activeServer === srv._id ? 'text-blue-400' : 'text-gray-200'
                                    }`}
                                    title={srv.name}
                                    onClick={() => navigate(`/chats/${srv._id}`)}>
                                    {srv.name}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </aside>
            <aside className="w-20 md:w-50 bg-gray-800 flex flex-col items-center py-4 border-r border-gray-700">
                <CreateChannel/>
                <div className="mt-6 flex-1 w-full">
                    <h2 className="text-xs text-gray-400 mb-2 px-4">Kanal</h2>
                    <ul>
                        {channels.map((channel) => (
                            <li
                                key={channel._id}
                                className="px-4 py-2 hover:bg-gray-700 rounded cursor-pointer flex items-center">
                                 <span
                                     className={`text-sm font-medium truncate flex-1 ${
                                         activeChannelId === channel._id ? 'text-blue-400' : 'text-gray-200'
                                     }`}
                                     title={channel.name}
                                     onClick={() => navigate(`/chats/${activeServerId}/${channel._id}`)}>
                                    {channel.name}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </aside>
            <main className="flex-1 flex flex-col">
                <div className="border-b border-gray-700 px-6 py-3 flex items-center justify-between bg-gray-800">
                    <h1 className="text-lg font-bold">
                        {servers.find(s => s._id === activeServer)?.name || "Kanal Adı"}
                    </h1>
                </div>
                <div className="flex-1 overflow-y-auto">
                    <ChatArea user={user} socket={socketRef.current} activeChannelId={activeChannelId}/>
                </div>
            </main>
        </div>
    );
}