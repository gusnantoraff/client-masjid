"use client";
import fetchWithAuth from "@/utils/fetch";
import * as React from "react";
import Chart from "react-apexcharts";

export default function PengeluaranChart({ filter }) {
  const [data, setData] = React.useState({
    series: [],
    labels: [],
  });
  const [noData, setNoData] = React.useState(false);

  React.useEffect(() => {
    // Fetch data from API
    const fetchData = async () => {
      try {
        const result = await fetchWithAuth("https://backend-masjid-production.up.railway.app/pengeluaran-kas");
        // Filter data based on month and year
        const filteredData = result.filter((item) => {
          const date = new Date(item.tanggal);
          const itemMonth = date.getMonth() + 1; // Month starts from 0
          const itemYear = date.getFullYear();

          return (
            (!filter.month || itemMonth === parseInt(filter.month)) &&
            (!filter.year || itemYear === parseInt(filter.year))
          );
        });

        if (filteredData.length === 0) {
          setNoData(true);
          return; // Stop further processing
        } else {
          setNoData(false); // If data exists, reset the noData flag
        }

        // Process data for the chart based on filtered data
        const groupedData = filteredData.reduce((acc, item) => {
          const label = item.jenis;
          const amount = parseFloat(item.jumlah);

          if (acc[label]) {
            acc[label] += amount; // Sum amounts with the same label
          } else {
            acc[label] = amount;
          }
          return acc;
        }, {});

        // Set data for the chart
        setData({
          labels: Object.keys(groupedData),
          series: Object.values(groupedData),
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [filter]); // Refetch data when filter changes

  return (
    <div>
    {/* If no data is found, show a warning */}
    {noData ? (
      <div style={{ color: "red", fontWeight: "bold" }}>
        Tidak ada data untuk bulan dan tahun yang dipilih.
      </div>
    ) : (
    <Chart
      options={{
        labels: data.labels,
        legend: {
          position: "bottom",
          fontSize: "14px",
          fontFamily: "Arial",
          fontWeight: 600,
          labels: {
            colors: ["#000000"],
            useSeriesColors: false,
          },
          formatter: function (seriesName, opts) {
            const value = opts.w.globals.series[opts.seriesIndex];
            return `${seriesName}: Rp${value.toLocaleString("id-ID")}`;
          },
        },
        dataLabels: {
          enabled: true,
          formatter: function (val) {
            return `${val.toFixed(1)}%`;
          },
          dropShadow: {
            enabled: false,
          },
          style: {
            fontSize: "16px",
            fontFamily: "Arial",
            fontWeight: "bold",
            colors: ["#ffffff"],
          },
        },
        plotOptions: {
          pie: {
            dataLabels: {
              offset: 0,
            },
          },
        },
        theme: {
          mode: "light",
          palette: "palette1",
          monochrome: {
            enabled: true,
            color: "#f44336",
            shadeTo: "light",
            shadeIntensity: 0.65,
          },
        },
        chart: {
          background: "transparent", // Set background to transparent
        },
      }}
      series={data.series}
      type="pie"
      width="100%"
      height={300}
    />
  )}
  </div>
);
}
