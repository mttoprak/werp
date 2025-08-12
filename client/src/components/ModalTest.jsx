import React, {useEffect, useRef, useState} from 'react';

export default function ModalTest({open, onClose, children}) {
    const [show, setShow] = useState(false);
    const [animate, setAnimate] = useState(false);
    const modalRef = useRef(null);

    useEffect(() => {
        if (open) {
            setShow(true);
            setTimeout(() => setAnimate(true), 10);
        } else {
            setAnimate(false);
        }
    }, [open]);

    useEffect(() => {
        function handleClickOutside(e) {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                onClose();
            }
        }
        function handleEsc(e) {
            if (e.key === "Escape") {
                onClose();
            }
        }
        if (show) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleEsc);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEsc);
        };
    }, [show, onClose]);

    const handleAnimationEnd = () => {
        if (!animate && !open) setShow(false);
    };

    if (!show) return null;

    return (
        <div
            className={`fixed inset-0 flex items-center justify-center z-50 transition-colors duration-300 ${
                animate ? 'bg-black/50 pointer-events-auto' : 'bg-transparent pointer-events-none'
            }`}
        >
            <div
                ref={modalRef}
                className={`relative bg-black p-5 rounded-lg min-w-80 min-h-80 transform transition-all duration-300 ${
                    animate ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
                }`}
                onTransitionEnd={handleAnimationEnd}
            >
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center bg-transparent border-none text-gray-400 hover:bg-gray-700 hover:text-white transition-colors duration-150"
                    aria-label="Kapat"
                    style={{border: 'none', borderRadius: 0, padding: 0}}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M6 6l12 12M6 18L18 6"/>
                    </svg>
                </button>
                {children}
            </div>
        </div>
    );
}