import React, { useState, useEffect } from "react";
import { FiPhone, FiMapPin } from "react-icons/fi";
import fetchWithAuth from "@/utils/fetch";

// URL API
const fetchUrl = 'http://localhost:8000/api/info-masjid';

interface InfoMasjidData {
    id: number;
    nama_masjid: string;
    alamat: string;
    kontak: string;
    deskripsi: string;
    ad_art: string;
}

const InfoMasjid = () => {
    const [infoMasjid, setInfoMasjid] = useState<InfoMasjidData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchInfoMasjid = async () => {
            try {
                const data: InfoMasjidData[] = await await fetchWithAuth(fetchUrl);
                setInfoMasjid(data[0]);
                setLoading(false);
            } catch (error) {
                setError("Failed to fetch data");
                setLoading(false);
            }
        };

        fetchInfoMasjid();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="mb-4 mt-4 h-full px-4 py-4">
            {/* Bagian atas dengan judul di kiri dan kontak di kanan */}
            <div className="flex justify-between items-start mb-4">
                {/* Judul di kiri atas */}
                <div>
                <h1 className="mt-2 text-2xl font-bold text-black dark:text-slate-200">{infoMasjid?.nama_masjid}</h1>
                <p className="mt-2 text-black dark:text-slate-400">{infoMasjid?.deskripsi}</p>
                </div>
                
                
                {/* Kontak di kanan atas */}
                <div className="text-left mt-2">
                    <p className="text-black dark:text-slate-400">
                        <FiPhone className="mr-1 inline" /> {infoMasjid?.kontak}
                    </p>
                    <p className="text-black dark:text-slate-400">
                        <FiMapPin className="mr-1 inline" /> {infoMasjid?.alamat}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default InfoMasjid;
