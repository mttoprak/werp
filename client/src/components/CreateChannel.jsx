import {useContext, useState} from "react";
import {AuthContext} from "../context/AuthContext.js";
import axios from "axios";
import ModalTest from "./ModalTest.jsx";

export default function CreateChannel() {
    const [modalOpen, setModalOpen] = useState(false);
    const [serverId, setServerID] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const {user} = useContext(AuthContext);


    const handleSubmit = (e) => {
        setLoading(true);
        e.preventDefault();

        try {
            axios.post(
                `http://localhost:5000/api/channels/create`,
                {
                    serverId,
                    name,
                },
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                        "Content-Type": "application/json",
                    },
                }
            ).then((
                    // response
                ) => {
                    //console.log("Sunucu oluşturuldu:", response.data);
                    window.location.reload();
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
            <button onClick={() => setModalOpen(true)}>Kanal Oluştur</button>
            <ModalTest open={modalOpen} onClose={() => setModalOpen(false)}>
                <div>

                    <h2>Kanal Oluştur</h2>
                    <h6>for development purposes </h6>
                    <form onSubmit={handleSubmit}>

                        <div>
                            <label>Sunucu ID:</label>
                            <input value={serverId} onChange={e => setServerID(e.target.value)} required
                                   placeholder="*"/>
                        </div>

                        <div>
                            <label>Sunucu Açıklaması:</label>
                            <input value={name} onChange={e => setName(e.target.value)}
                                   type="text" placeholder="Kanal İsmi"/>
                        </div>

                        {error && <div style={{color: 'red'}}>{error}</div>}
                        <button type="submit" disabled={loading}>Oluştur</button>

                    </form>
                </div>
            </ModalTest>
        </>
    );
}