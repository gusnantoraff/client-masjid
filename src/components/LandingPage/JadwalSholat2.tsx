import { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import { FaSearch, FaFilePdf, FaFileExcel } from 'react-icons/fa';
import { MdArrowDropDown } from 'react-icons/md';
import * as XLSX from 'xlsx';
import { jsPDF } from "jspdf";

const JadwalSholat2 = () => {
    const [jadwal, setJadwal] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [cities, setCities] = useState<{ value: string; label: string }[]>([]);
    const [selectedCity, setSelectedCity] = useState<{ value: string; label: string } | null>(null);
    const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        const fetchCities = async () => {
            try {
                const response = await axios.get('/api/kota');
                const cityOptions = response.data.data.data.map((city: any) => ({
                    value: city.id,
                    label: city.lokasi
                }));
                setCities(cityOptions);
            } catch (error) {
                console.error("Error fetching cities:", error);
                setError("Error fetching cities.");
            }
        };

        fetchCities();
    }, []);

    const handleSubmit = async () => {
        if (!selectedCity) return;

        setIsLoading(true);
        setError(null);
        setIsSubmitted(true);
        try {
            const response = await axios.get(
                `/api/jadwal-bulanan/${selectedCity.value}/${selectedYear}/${selectedMonth}`
            );
            setJadwal(response.data.data.jadwal);
        } catch (error) {
            console.error("Error fetching jadwal sholat:", error);
            setError("Error fetching jadwal sholat.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleExport = (type: 'pdf' | 'excel') => {
        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        const monthName = monthNames[selectedMonth - 1];

        if (type === 'pdf') {
            const doc = new jsPDF({
                orientation: "portrait",
                unit: "in",
                format: [7.5, 14]
            });

            const imgData = '/images/BG.png';

            doc.addImage(imgData, 'JPEG', 0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height);

            doc.setFontSize(20);
            doc.setFont("helvetica", "bold"); 
            doc.setTextColor(255, 255, 255);
            const titleText = `Jadwal Shalat ${monthName} ${selectedYear}`;
            const titleWidth = doc.getTextWidth(titleText);
            const titleX = (doc.internal.pageSize.width - titleWidth) / 2;

            doc.text(titleText, titleX, 0.5);

            doc.setFontSize(16);
            doc.setFont("helvetica", "bold"); 

            const cityText = selectedCity ? selectedCity.label : '';
            const cityWidth = doc.getTextWidth(cityText);
            const cityX = (doc.internal.pageSize.width - cityWidth) / 2;

            doc.text(cityText, cityX, 0.8);

            doc.setFontSize(14);
            doc.setFont("helvetica", "bold"); 

            const headers = ["Tanggal", "Subuh", "Dzuhur", "Ashar", "Maghrib", "Isya"];
            const tableData = jadwal.map((hari) => [
                hari.tanggal,
                hari.subuh,
                hari.dzuhur,
                hari.ashar,
                hari.maghrib,
                hari.isya
            ]);

            doc.setFontSize(12);
            doc.setFont("helvetica", "normal"); 

            let yPosition = 1;
            const cellHeight = 0.4;
            const columnWidths = [1.5, 1, 1, 1, 1, 1];

           
            headers.forEach((header, index) => {
                doc.setFillColor(249, 127, 48);
                const xPosition = columnWidths.slice(0, index).reduce((a, b) => a + b, 0) + 0.5;
                doc.rect(xPosition, yPosition, columnWidths[index], cellHeight, 'F');
                doc.text(header, xPosition + columnWidths[index] / 2, yPosition + cellHeight / 2, { align: 'center' });
            });

            yPosition += cellHeight;

            tableData.forEach((row) => {
                row.forEach((cell, index) => {
                    doc.setFillColor(245, 153, 93);
                    const xPosition = columnWidths.slice(0, index).reduce((a, b) => a + b, 0) + 0.5;
                    doc.rect(xPosition, yPosition, columnWidths[index], cellHeight, 'F');
                    doc.text(cell, xPosition + columnWidths[index] / 2, yPosition + cellHeight / 2, { align: 'center' });
                });
                yPosition += cellHeight;
            });

            doc.save("jadwal_shalat.pdf");
        } else if (type === 'excel') {
            const ws = XLSX.utils.table_to_sheet(document.getElementById('jadwal-table')!);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Jadwal Sholat');
            XLSX.writeFile(wb, 'jadwal-sholat.xlsx');
        }
        setIsDropdownOpen(false);
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-6 w-full w-[100%] mx-auto">
            <div className="mb-4 flex gap-4">
                <div className="w-1/3">
                    <label className="block mb-2">Kabupaten/Kota</label>
                    <Select
                        value={selectedCity}
                        onChange={setSelectedCity}
                        options={cities}
                        placeholder="Pilih Kota/Kabupaten"
                        className="w-full"
                    />
                </div>
                <div className="w-1/4">
                    <label className="block mb-2">Bulan</label>
                    <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(Number(e.target.value))}
                        className="border p-2 rounded w-full"
                    >
                        {Array.from({ length: 12 }, (_, index) => (
                            <option key={index + 1} value={index + 1}>
                                {index + 1}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="w-1/4">
                    <label className="block mb-2">Tahun</label>
                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                        className="border p-2 rounded w-full"
                    >
                        {Array.from({ length: 2040 - 2024 + 1 }, (_, index) => (
                            <option key={2024 + index} value={2024 + index}>
                                {2024 + index}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mt-8 flex gap-2">
                    <button
                        onClick={handleSubmit}
                        className="bg-ijo text-white p-2 rounded flex items-center"
                    >
                        <FaSearch className="mr-2" /> Cari
                    </button>
                    <div className="relative">
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="bg-blue-500 text-white p-2 rounded flex items-center"
                        >
                            <span className="mr-2">Export</span>
                            <MdArrowDropDown />
                        </button>
                        {isDropdownOpen && (
                            <div className="absolute top-full mt-1 bg-white shadow-md rounded w-40">
                                <button
                                    onClick={() => handleExport('pdf')}
                                    className="w-full text-left p-2 hover:bg-gray-300 flex items-center"
                                >
                                    <FaFilePdf className="mr-2 text-red font-red" /> PDF
                                </button>
                                <button
                                    onClick={() => handleExport('excel')}
                                    className="w-full text-left p-2 hover:bg-gray-300 flex items-center"
                                >
                                    <FaFileExcel className="mr-2 text-green-500" /> Excel
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {isSubmitted && isLoading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>{error}</p>
            ) : (
                <table id="jadwal-table" className="table-auto w-full text-center">
                    <thead>
                        <tr>
                            <th className="px-4 py-2">Tanggal</th>
                            <th className="px-4 py-2">Subuh</th>
                            <th className="px-4 py-2">Dzuhur</th>
                            <th className="px-4 py-2">Ashar</th>
                            <th className="px-4 py-2">Maghrib</th>
                            <th className="px-4 py-2">Isya</th>
                        </tr>
                    </thead>
                    <tbody>
                        {jadwal.length > 0 ? (
                            jadwal.map((hari) => (
                                <tr key={hari.tanggal} className="bg-gray-100">
                                    <td className="border px-4 py-2">{hari.tanggal}</td>
                                    <td className="border px-4 py-2">{hari.subuh}</td>
                                    <td className="border px-4 py-2">{hari.dzuhur}</td>
                                    <td className="border px-4 py-2">{hari.ashar}</td>
                                    <td className="border px-4 py-2">{hari.maghrib}</td>
                                    <td className="border px-4 py-2">{hari.isya}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6}>No data available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default JadwalSholat2;
