import React from "react";

const TableGeneralLedger = ({ transactions }) => {
    const totalDebit = transactions.reduce((sum, trx) => sum + parseFloat(trx.debit || 0), 0);
    const totalKredit = transactions.reduce((sum, trx) => sum + parseFloat(trx.kredit || 0), 0);
    const totalNominal = totalDebit - totalKredit;

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="border-b">
                        <th>Tanggal</th>
                        <th>Tipe</th>
                        <th>Kode Akun</th>
                        <th>Nama Akun</th>
                        <th>Deskripsi</th>
                        <th>Debit</th>
                        <th>Kredit</th>
                        <th className="text-right">Nominal</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.length > 0 ? (
                        transactions.map((trx, index) => (
                            <tr key={index} className="border-b hover:bg-gray-50">
                                <td>{trx.tanggal}</td>
                                <td>{trx.jenis}</td>
                                <td>{trx.kodeAkun}</td>
                                <td>{trx.namaAkun}</td>
                                <td>{trx.keterangan}</td>
                                <td>{parseFloat(trx.debit).toLocaleString("id-ID", { style: "currency", currency: "IDR" })}</td>
                                <td>{parseFloat(trx.kredit).toLocaleString("id-ID", { style: "currency", currency: "IDR" })}</td>
                                <td className="text-right">
                                    {(parseFloat(trx.debit) - parseFloat(trx.kredit)).toLocaleString("id-ID", {
                                        style: "currency",
                                        currency: "IDR",
                                    })}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={8} className="py-4 text-center text-gray-500">
                                No transactions available.
                            </td>
                        </tr>
                    )}
                    <tr className="border-t font-bold">
                        <td colSpan={5} className="py-4 text-right">Total</td>
                        <td className="py-4">{totalDebit.toLocaleString("id-ID", { style: "currency", currency: "IDR" })}</td>
                        <td className="py-4">{totalKredit.toLocaleString("id-ID", { style: "currency", currency: "IDR" })}</td>
                        <td className="py-4 text-right">
                            {totalNominal.toLocaleString("id-ID", { style: "currency", currency: "IDR" })}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default TableGeneralLedger;
