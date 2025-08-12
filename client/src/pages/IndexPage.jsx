import {useContext} from "react";
import {AuthContext} from "../context/AuthContext.js";
import {Navigate} from "react-router-dom";

export default function IndexPage() {

    const {user} = useContext(AuthContext);

    console.log('🔒 IndexPage user:', user);

    if (user) {
        // Kullanıcı varsa /chat'e yönlendir
        return <Navigate to="/chats" replace={true} />;
    }


    return (
        <>
            <h1>Welcome to Werp</h1>
            <p>This is the home page of our application.</p>
            <Navigate to="/home" replace={true}/>
        </>
    );
}