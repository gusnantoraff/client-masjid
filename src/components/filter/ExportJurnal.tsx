import React, { useState } from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { jsPDF } from "jspdf";
import "jspdf-autotable"; // Import for autoTable support
import { AiOutlineExport } from "react-icons/ai";
import MenuItemMUI from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import GridOnIcon from "@mui/icons-material/GridOn";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

export default function ExportJurnal({ filteredRows, exportFileName, pageTitle }) {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleExport = (format) => {
        if (format === "CSV") {
            exportToCSV();
        } else if (format === "PDF") {
            exportToPDF();
        }
        setAnchorEl(null);
    };

    const exportToCSV = () => {
        const csvContent =
            "data:text/csv;charset=utf-8," +
            ["Jenis,Tanggal,Jumlah,Deskripsi,File,Oleh,Status"]
                .concat(
                    filteredRows.map((row) =>
                        [
                            row.name,
                            row.date,
                            row.amount,
                            row.description,
                            row.file,
                            row.oleh,
                            row.status,
                        ].join(",")
                    )
                )
                .join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `${exportFileName}.csv`);
        document.body.appendChild(link);
        link.click();

        if (document.body.contains(link)) {
            document.body.removeChild(link);
        } else {
            console.warn("Link not found in document body:", link);
        }
    };

    const exportToPDF = () => {
        const doc = new jsPDF("p", "cm", "a4");
        const headers = [
            "No",
            "Jenis",
            "Tanggal",
            "Jumlah",
            "Deskripsi",
            "File",
            "Oleh",
            "Status",
        ];
        const tableData = filteredRows.map((row, index) => [
            index + 1,
            row.name,
            row.date,
            row.amount.toLocaleString("id-ID", {
                style: "currency",
                currency: "IDR",
            }),
            row.description,
            row.file,
            row.oleh,
            row.status,
        ]);

        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text(pageTitle, 10.5, 1, { align: "center" });

        doc.autoTable({
            head: [headers],
            body: tableData,
            startY: 2,
            theme: "grid",
        });

        doc.save(`${exportFileName}.pdf`);
    };

    return (
        <div>
            <Button
                onClick={(e) => setAnchorEl(e.currentTarget)}
                variant="outlined"
                                        startIcon={<AiOutlineExport />}
                                        style={{
                                            color: "#008080", // Warna teks dan ikon hijau toska
                                            borderColor: "#008080", // Warna border hijau toska
                                        }}
            >
                Export
            </Button>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
            >
                <MenuItemMUI
                                            onClick={() => handleExport("CSV")}
                                        >
                                            <ListItemIcon>
                                                <GridOnIcon fontSize="small" />
                                            </ListItemIcon>
                                            <ListItemText primary="Export to CSV" />
                                        </MenuItemMUI>
                                        <MenuItemMUI
                                            onClick={() => handleExport("PDF")}
                                        >
                                            <ListItemIcon>
                                                <PictureAsPdfIcon fontSize="small" />
                                            </ListItemIcon>
                                            <ListItemText primary="Export to PDF" />
                                        </MenuItemMUI>
            </Menu>
        </div>
    );
}
