import React, {useState} from 'react';
import ModalTest from "../components/ModalTest.jsx";
import Header from "../components/header.jsx";

function HomePage() {

    const [modalOpen, setModalOpen] = useState(false);
    return (
        <div>
            <Header/>
            <h1>Welcome to the Home Page</h1>
            <p>This is the main page of our application.</p>

            <button onClick={() => {
                setModalOpen(true)
            }}>Modal'ı aç
            </button>
            <ModalTest open={modalOpen} onClose={() => setModalOpen(false)}>
                <h2>Modal İçeriği</h2>
                <p>Burada istediğin içeriği gösterebilirsin.</p>
            </ModalTest>
        </div>
    );
}

export default HomePage;