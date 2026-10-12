"use client";
import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";

const JamDigital = () => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [time, setTime] = useState("");

    // Update waktu setiap detik
    useEffect(() => {
        const updateClock = () => {
            const now = new Date();
            const formattedTime = now.toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
            });
            setTime(formattedTime);
        };

        updateClock();
        const interval = setInterval(updateClock, 1000);

        return () => clearInterval(interval);
    }, []);

    // Munculkan popup seperti ads setelah beberapa detik
    useEffect(() => {
        const showPopup = setTimeout(() => {
            setIsPopupOpen(true);
        }, 5000); // Muncul setelah 5 detik

        return () => clearTimeout(showPopup); // Bersihkan timeout jika komponen dihapus
    }, []);

    return (
        <div>
            {/* Popup muncul otomatis */}
            {isPopupOpen && (
                <div className="fixed right-4 top-4 z-50 mt-25 w-auto rounded-lg border border-gray-300 bg-white p-4 shadow-lg">
                    {/* Header Popup */}
                    <div className="flex items-center justify-between gap-2">
                        <h2 className="text-sm font-semibold text-gray-700 font-poppins">
                            Waktu Saat Ini
                        </h2>
                        <button
                            onClick={() => setIsPopupOpen(false)}
                            className="text-red-600"
                        >
                            <FaTimes size={16} />
                        </button>
                    </div>

                    {/* Jam Digital */}
                    <div className="text-2xl font-bold text-gray-900">
                        {time}
                    </div>

                </div>
            )}
        </div>
    );
};

export default JamDigital;
