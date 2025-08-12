import {BrowserRouter, Routes, Route} from 'react-router-dom';
import './App.css';

import HomePage from './pages/HomePage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import LoginPage from './pages/LoginPage.jsx';
import {AuthProvider} from './context/AuthProvider.jsx';
import IndexPage from "./pages/IndexPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import InvitePage from "./pages/InvitePage.jsx";
import DEV_ChatPage from "./pages/Dev_ChatPage.jsx";

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<IndexPage/>}/>
                    <Route path="/home" element={<HomePage/>}/>
                    <Route path="/about" element={<AboutPage/>}/>
                    <Route
                        path="/chats/:activeServer?/:activeChannel?"
                        element={
                            <ProtectedRoute>
                                <ChatPage/>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/DEVchats/:activeServer?/:activeChannel?"
                        element={
                            <ProtectedRoute>
                                <DEV_ChatPage/>
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/login" element={<LoginPage/>}/>
                    <Route path="/register" element={<RegisterPage/>}/>
                    <Route
                        path="/invites/:inviteid"
                        element={
                            <ProtectedRoute>
                                <InvitePage/>
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;