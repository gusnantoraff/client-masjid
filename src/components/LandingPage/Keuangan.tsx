import React, { useEffect, useState } from "react";
import axios from "@/utils/axios";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

// Register chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
);

interface KeuanganProps {
    id?: string;
}

interface RekeningBank {
    id: number;
    nama_bank: string;
    nomor_rekening: string;
    atas_nama: string;
}

interface ReportData {
    total_pemasukan: number;
    total_pengeluaran: number;
    sisa: number;
}

type PeriodType = "harian" | "mingguan" | "bulanan" | "tahunan";

const Keuangan: React.FC<KeuanganProps> = ({ id }) => {
    const [reports, setReports] = useState<
        Record<PeriodType, Record<string, ReportData>>
    >({
        harian: {},
        mingguan: {},
        bulanan: {},
        tahunan: {},
    });
    const [rekeningData, setRekeningData] = useState<RekeningBank | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedReport, setSelectedReport] = useState<ReportData | null>(
        null,
    );
    const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>("harian"); // Default to 'harian'

    useEffect(() => {
        axios
            .get("/public/rekening-bank/1")
            .then((response) => setRekeningData(response.data))
            .catch((error) =>
                console.error("Error fetching rekening data", error),
            );

        const fetchReports = async () => {
            setLoading(true);
            try {
                const periods: PeriodType[] = [
                    "harian",
                    "mingguan",
                    "bulanan",
                    "tahunan",
                ];
                const fetchedReports: Record<
                    PeriodType,
                    Record<string, ReportData>
                > = {
                    harian: {},
                    mingguan: {},
                    bulanan: {},
                    tahunan: {},
                };

                for (let period of periods) {
                    const response = await axios.get(
                        "/public/laporan-keuangan2/periode",
                        {
                            params: { periode: period },
                        },
                    );
                    fetchedReports[period] = response.data;
                }

                setReports(fetchedReports);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching reports:", error);
                setLoading(false);
            }
        };

        fetchReports();
    }, []);

    const formatCurrency = (amount: number) => {
        return `Rp ${amount.toLocaleString()}`;
    };

    const calculateBalance = (pemasukan: number, pengeluaran: number) => {
        return pemasukan - pengeluaran;
    };

    const handleReportClick = (period: PeriodType, date: string) => {
        const report = reports[period][date];
        setSelectedReport(report);
    };

    const handleCloseModal = () => {
        setSelectedReport(null);
    };

    const formatDate = (date: string, period: PeriodType) => {
        const d = new Date(date);

        if (period === "harian") {
            const options: Intl.DateTimeFormatOptions = {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
            };
            return `Laporan ${d.toLocaleDateString("id-ID", options)}`;
        }

        if (period === "mingguan") {
            const now = new Date();
            const monthName = now.toLocaleString("id-ID", { month: "long" });
            return `${date} Bulan ${monthName}`;
        }

        if (period === "bulanan") {
            const monthName = d.toLocaleString("id-ID", { month: "long" });
            return `Laporan Bulan ${monthName} ${d.getFullYear()}`;
        }

        if (period === "tahunan") {
            return `Laporan Tahun ${d.getFullYear()}`;
        }

        return date;
    };

    // Chart Data Preparation
    const prepareChartData = () => {
        const labels = Object.keys(reports[selectedPeriod]);
        const pemasukanData = labels.map(
            (key) => reports[selectedPeriod][key].total_pemasukan,
        );
        const pengeluaranData = labels.map(
            (key) => reports[selectedPeriod][key].total_pengeluaran,
        );

        return {
            labels,
            datasets: [
                {
                    label: "Pemasukan",
                    data: pemasukanData,
                    backgroundColor: "rgba(34, 197, 94, 0.5)", // green
                },
                {
                    label: "Pengeluaran",
                    data: pengeluaranData,
                    backgroundColor: "rgba(244, 63, 94, 0.5)", // red
                },
            ],
        };
    };

    return (
        <section
            id={id}
            className="mb-10 font-poppins"
            data-aos="fade-right"
            data-aos-delay="200"
        >
            <div className="mb-[3rem] flex items-center justify-center px-4 py-4 sm:px-6 md:px-8">
                <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-lg sm:p-8">
                    <h3 className="mb-6 text-center text-lg font-semibold text-teal-700 sm:text-xl md:text-2xl">
                        Informasi Rekening Bank
                    </h3>
                    <div className="w-full space-y-4">
                        <div className="grid grid-cols-3 items-center gap-x-4 gap-y-2 sm:grid-cols-3">
                            <span className="font-semibold text-teal-700">
                                Nama Bank
                            </span>
                            <span className="text-center font-semibold text-teal-700 sm:col-span-1">
                                :
                            </span>
                            <span className="text-gray-700 sm:col-span-1">
                                {rekeningData?.nama_bank ||
                                    "Data tidak tersedia"}
                            </span>
                        </div>
                        <div className="grid grid-cols-3 items-center gap-x-4 gap-y-2 sm:grid-cols-3">
                            <span className="font-semibold text-teal-700">
                                Nomor Rekening
                            </span>
                            <span className="text-center font-semibold text-teal-700 sm:col-span-1">
                                :
                            </span>
                            <span className="text-gray-700 sm:col-span-1">
                                {rekeningData?.nomor_rekening ||
                                    "Data tidak tersedia"}
                            </span>
                        </div>
                        <div className="grid grid-cols-3 items-center gap-x-4 gap-y-2 sm:grid-cols-3">
                            <span className="font-semibold text-teal-700">
                                Atas Nama
                            </span>
                            <span className="text-center font-semibold text-teal-700 sm:col-span-1">
                                :
                            </span>
                            <span className="text-gray-700 sm:col-span-1">
                                {rekeningData?.atas_nama ||
                                    "Data tidak tersedia"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <h2 className="mb-6 text-center font-poppins text-4xl font-semibold text-gray-700">
                Laporan Keuangan
            </h2>
            <hr className="mx-auto my-1 mb-6 w-[20%] rounded-lg border-2 border-ijo" />
            <h3 className="mb-10 px-5 text-center font-poppins text-lg font-light text-gray-700">
                Laporan keuangan mencakup berbagai periode, mulai dari harian,
                mingguan, bulanan, hingga tahunan. Laporan ini mencakup
                pendapatan, pengeluaran, serta saldo akhir untuk memastikan
                transparansi dan akuntabilitas keuangan.
            </h3>

            {/* Period Selector (Dropdown or Buttons) */}
            <div className="mb-6 flex flex-wrap justify-center gap-2 sm:gap-4">
                {(
                    ["harian", "mingguan", "bulanan", "tahunan"] as PeriodType[]
                ).map((period) => (
                    <button
                        key={period}
                        onClick={() => setSelectedPeriod(period)}
                        className={`rounded border px-4 py-2 text-sm sm:text-base ${
                            selectedPeriod === period
                                ? "bg-ijo text-white"
                                : "bg-gray-200 text-gray-700"
                        }`}
                    >
                        {period.charAt(0).toUpperCase() + period.slice(1)}
                    </button>
                ))}
            </div>

            {/* Render Chart */}
            <div className="flex flex-col items-center justify-center px-4 pb-6">
                <h3 className="mb-4 text-center text-lg font-semibold text-gray-700 sm:text-xl">
                    {`Chart Laporan ${selectedPeriod}`}
                </h3>
                <div className="flex w-full items-center justify-center rounded-lg bg-white p-4 shadow-md sm:w-3/4">
                    <div className="w-full" style={{ height: "300px" }}>
                        {" "}
                        {/* Tinggi grafik responsif */}
                        <Bar
                            data={prepareChartData()}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false, // Proporsional untuk layar kecil
                            }}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Keuangan;
