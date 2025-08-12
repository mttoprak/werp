import {useContext, useState} from "react";
import {AuthContext} from "../context/AuthContext.js";
import axios from "axios";
import ModalTest from "./ModalTest.jsx";

export default function CreateServer() {
    const [modalOpen, setModalOpen] = useState(false);
    const [name, setName] = useState("");
    const [bio, setBio] = useState("");
    const [photo, setPhoto] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const {user} = useContext(AuthContext);


    const handleSubmit = (e) => {
        setLoading(true);
        e.preventDefault();

        try {
            axios.post(
                `http://localhost:5000/api/servers/create`,
                {
                    name,
                    bio,
                    photo,
                },
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                        "Content-Type": "application/json",
                    },
                }
            ).then((response) => {
                    console.log("Sunucu oluşturuldu:", response.data);
                }
            )
        } catch (error) {
            console.error("Sunucu oluşturma hatası:", error);
            setError(error.response?.data?.msg || "Sunucu oluşturulurken bir hata oluştu.");

        } finally {
            //setTimeout(() => setModalOpen(false), 2000);
            setLoading(false);
            setModalOpen(false)
        }

        // Sunucu oluşturma işlemi burada yapılacak


    };

    return (
        <>
            <button onClick={() => setModalOpen(true)}>Sunucu Oluştur</button>
            <ModalTest open={modalOpen} onClose={() => setModalOpen(false)}>
                <div>
                    <h2>Sunucu Oluştur</h2>
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label>Sunucu Adı:</label>
                            <input value={name} onChange={e => setName(e.target.value)} required placeholder="*"/>
                        </div>
                        <div>
                            <label>Sunucu Açıklaması:</label>
                            <input value={bio} onChange={e => setBio(e.target.value)}
                                   type="text" placeholder="Sunucu Açıklaması"/>
                        </div>

                        <div>
                            <label>Sunucu Fotoğrafı:</label>
                            <input value={photo} onChange={e => setPhoto(e.target.value)}
                                   type="text" placeholder="Fotoğraf URL'si"/>
                        </div>

                        {error && <div style={{color: 'red'}}>{error}</div>}
                        <button type="submit" disabled={loading}>Oluştur</button>
                    </form>
                </div>
            </ModalTest>
        </>
    );
}