import React,{useState} from "react";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

const ExportDialog = ({ open, onClose, onExportPDF , onExportCSV}) => {
    if (!open) return null;

    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-md rounded-lg bg-white p-4">
                <h3 className="mb-4 text-lg font-medium text-gray-900">
                    Pilih Periode untuk Export
                </h3>
                <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Tahun</label>
                                <input
                                    type="number"
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(e.target.value)}
                                    className="mt-1 block w-full rounded-md border px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Bulan</label>
                                <select
                                    value={selectedMonth}
                                    onChange={(e) => setSelectedMonth(e.target.value)}
                                    className="mt-1 block w-full rounded-md border px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500"
                                >
                                    {Array.from({ length: 12 }, (_, i) => (
                                        <option key={i} value={i + 1}>
                                            {i + 1}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="mt-4 flex justify-end space-x-2">
                            <button
                                onClick={onClose}
                                className="rounded-md border px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                                Batal
                            </button>
                            <button
                                onClick={onExportPDF}
                                className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                            >
                                <PictureAsPdfIcon fontSize="small" sx={{ marginRight: "10px" }} />
                                Export PDF
                            </button>
                            <button
                                onClick={onExportCSV}
                                className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                            >
                                <PictureAsPdfIcon fontSize="small" sx={{ marginRight: "10px" }} />
                                Export CSV
                            </button>
                        </div>
            </div>
        </div>
    );
};

export default ExportDialog;
