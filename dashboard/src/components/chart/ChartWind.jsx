import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ChartWind = () => {
  const [data, setData] = useState({ labels: [], datasets: [] });
  const maxDataLength = 10; // Giới hạn số lượng điểm trên biểu đồ

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/get-data-chart");
        const apiData = await response.json();

        const labels = apiData.map((item) => item.id.toString());
        const wind_speed = apiData.map((item) => item.wind_speed);

        setData({
          labels: labels.slice(-maxDataLength),
          datasets: [
            {
              label: "Wind",
              data: wind_speed.slice(-maxDataLength),
              borderColor: "red",
              fill: false,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    const interval = setInterval(fetchData, 2000);

    return () => clearInterval(interval);
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Chart wind_speed",
      },
    },
  };

  return (
    <div style={{ width: "50%" }}>
      <Line options={options} data={data} />
    </div>
  );
};

export default ChartWind;
