import React, { useEffect, useState } from "react";
import axios from '@/utils/axios';

const StatsArus = () => {
    const [dataStatsList, setDataStatsList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch data from the API
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    "/arus-kas",
                );
                const data = response.data;

                // Map the API data to fit the expected structure
                const formattedData = [
                    {
                        title: "Total Pemasukan",
                        value: parseFloat(
                            data[0].pemasukan_total,
                        ).toLocaleString("id-ID", {
                            style: "currency",
                            currency: "IDR",
                        }),
                    },
                    {
                        title: "Total Pengeluaran",
                        value: parseFloat(
                            data[0].pengeluaran_total,
                        ).toLocaleString("id-ID", {
                            style: "currency",
                            currency: "IDR",
                        }),
                    },
                ];

                setDataStatsList(formattedData);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Failed to load data.");
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-2">
            {dataStatsList.map((item) => (
                <div
                    key={item.title}
                    className={`mt-2 w-full rounded-2xl px-4 py-6 shadow-md ${
                        item.title === "Total Pemasukan"
                            ? "border-2 bg-green-200"
                            : item.title === "Total Pengeluaran"
                              ? "border-2 bg-red-500"
                              : "border-gray-300"
                    }`}
                >
                    <h2 className="pl-4 pt-4 text-xl font-medium text-black">
                        {item.title}
                    </h2>
                    <h2 className="pb-4 pl-4 pt-2 text-2xl font-bold text-black">
                        {item.value}
                    </h2>
                </div>
            ))}
        </div>
    );
};

export default StatsArus;
