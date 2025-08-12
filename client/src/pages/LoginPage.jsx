import { useContext, useEffect, useState } from "react";
import Header from "../components/header.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.js";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { setUser } = useContext(AuthContext);

    useEffect(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }, []);

    async function loginUser(e) {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await axios.post(
                "http://localhost:5000/api/auth/login",
                { email, password },
                { headers: { "Content-Type": "application/json" } }
            );

            if (res.data.token && res.data.user) {
                localStorage.setItem("token", res.data.token);

                // User objesini doğrudan kullan
                const user = {
                    _id: res.data.user._id,
                    nickname: res.data.user.nickname,
                    email: res.data.user.email,
                    token: res.data.token,
                };

                setUser(user);
                navigate("/chats");
            } else {
                setError("Giriş başarısız.");
            }
        } catch (err) {
            if (err.response?.data?.msg) {
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
            <Header />
            <h1>Login Page</h1>
            <p>Lütfen giriş bilgilerinizi girin.</p>
            <form onSubmit={loginUser}>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="password">Şifre:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        required
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                </div>
                {error && <p style={{ color: "red" }}>Hata: {error}</p>}
                <button type="submit" disabled={loading}>
                    {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
                </button>
            </form>
        </>
    );
}