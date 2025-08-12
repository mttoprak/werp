import axios from "axios";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import Header from "../components/Header";

export default function RegisterPage() {
    const [nickname, setNickname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function handleRegister(e) {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            await axios.post("http://localhost:5000/api/auth/register", {
                nickname,
                email,
                password
            }, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            navigate("/login");
        } catch (err) {
            if (err.response && err.response.data && err.response.data.msg) {
                setError(err.response.data.msg);
            } else {
                setError("Bir hata oluştu.");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <Header/>
            <h1>Kayıt Ol</h1>
            <form onSubmit={handleRegister}>
                <div>
                    <label htmlFor="nickname">Kullanıcı Adı:</label>
                    <input
                        type="text"
                        id="nickname"
                        value={nickname}
                        autoComplete="email"
                        onChange={e => setNickname(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        autoComplete="off"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Şifre:</label>
                    <input
                        type="password"
                        id="password"
                        autoComplete="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <p style={{color: "red"}}>{error}</p>}
                <button type="submit" disabled={loading}>Kayıt Ol</button>
            </form>
        </>
    );
}
