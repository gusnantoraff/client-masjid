import React from "react";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import { FaEye, FaTrash } from "react-icons/fa6";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { Checkbox } from "@mui/material";

type TableContentProps = {
    rows: any[];
    coaMap: any;
    isRestore: boolean;
    restoreItems: any[];
    onRestoreToggle: (id: any) => void;
    onRowAction: (action: string, row: any) => void;
};

export default function TableContent({
    rows,
    coaMap,
    isRestore,
    restoreItems,
    onRestoreToggle,
    onRowAction,
}: TableContentProps) {
    return (
        <>
            {/* Table Header */}
            <TableHead>
                <TableRow>
                    <TableCell
                        sx={{
                            fontFamily: "Satoshi",
                            fontWeight: "bold",
                            fontSize: "16px",
                        }}
                    >
                        Jenis
                    </TableCell>
                    <TableCell
                        sx={{
                            fontFamily: "Satoshi",
                            fontWeight: "bold",
                            fontSize: "16px",
                        }}
                    >
                        Tanggal
                    </TableCell>
                    <TableCell
                        sx={{
                            fontFamily: "Satoshi",
                            fontWeight: "bold",
                            fontSize: "16px",
                        }}
                    >
                        Jumlah
                    </TableCell>
                    <TableCell
                        sx={{
                            fontFamily: "Satoshi",
                            fontWeight: "bold",
                            fontSize: "16px",
                        }}
                    >
                        Tipe
                    </TableCell>
                    <TableCell
                        sx={{
                            fontFamily: "Satoshi",
                            fontWeight: "bold",
                            fontSize: "16px",
                        }}
                    >
                        Deskripsi
                    </TableCell>
                    <TableCell
                        sx={{
                            fontFamily: "Satoshi",
                            fontWeight: "bold",
                            fontSize: "16px",
                        }}
                    >
                        File
                    </TableCell>
                    <TableCell
                        sx={{
                            fontFamily: "Satoshi",
                            fontWeight: "bold",
                            fontSize: "16px",
                        }}
                    >
                        Oleh
                    </TableCell>
                    <TableCell
                        sx={{
                            fontFamily: "Satoshi",
                            fontWeight: "bold",
                            fontSize: "16px",
                        }}
                    >
                        Status
                    </TableCell>
                    <TableCell
                        sx={{
                            fontFamily: "Satoshi",
                            fontWeight: "bold",
                            fontSize: "16px",
                        }}
                    >
                        Aksi
                    </TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {rows.map((row, index) => (
                    <TableRow
                        key={index}
                        sx={{
                            backgroundColor:
                                index % 2 === 0 ? "#f5f5f5" : "#ffffff",
                        }}
                    >
                        <TableCell>{row.name}</TableCell>
                        <TableCell>{row.date}</TableCell>
                        <TableCell
                            style={{
                                color: row.amount < 0 ? "red" : "green",
                            }}
                        >
                            {row.amount.toLocaleString("id-ID", {
                                style: "currency",
                                currency: "IDR",
                            })}
                        </TableCell>
                        <TableCell>{coaMap[row.tipe]}</TableCell>
                        <TableCell>{row.description}</TableCell>
                        <TableCell
                            style={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                maxWidth: "10px",
                            }}
                        >
                            {row.file}
                        </TableCell>
                        <TableCell>{coaMap[row.oleh]}</TableCell>
                        <TableCell>
                            {row.amount < 0 ? (
                                <div
                                    style={{
                                        color: "red",
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                >
                                    <ArrowUpwardIcon />
                                    <span>Pengeluaran</span>
                                </div>
                            ) : (
                                <div
                                    style={{
                                        color: "green",
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                >
                                    <ArrowDownwardIcon />
                                    <span>Pemasukan</span>
                                </div>
                            )}
                        </TableCell>
                        <TableCell className="space-x-2">
                            {isRestore ? (
                                // Saat dalam mode restore, hanya tampilkan checkbox
                                <Checkbox
                                    checked={restoreItems.includes(row.id)}
                                    onChange={() => onRestoreToggle(row.id)}
                                    inputProps={{
                                        "aria-label": "Restore Checkbox",
                                    }}
                                />
                            ) : (
                                // Saat tidak dalam mode restore, tampilkan tombol aksi
                                <>
                                    <button
                                        onClick={() => onRowAction("view", row)}
                                        className="text-blue-500"
                                    >
                                        <FaEye size={20} />
                                    </button>
                                    <button
                                        onClick={() =>
                                            onRowAction("delete", row)
                                        }
                                        className="text-red-500"
                                    >
                                        <FaTrash size={20} />
                                    </button>
                                </>
                            )}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </>
    );
}
