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

const LineChart = () => {
  const [data, setData] = useState({ labels: [], datasets: [] });
  const maxDataLength = 10; // Giới hạn số lượng điểm trên biểu đồ

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/get-data-chart");
        const apiData = await response.json();

        const labels = apiData.map((item) => item.id.toString());
        const temperatureData = apiData.map((item) => item.temperature);
        const humidityData = apiData.map((item) => item.humidity);
        const lightData = apiData.map((item) => item.light);

        setData({
          labels: labels.slice(-maxDataLength),
          datasets: [
            {
              label: "Temperature",
              data: temperatureData.slice(-maxDataLength),
              borderColor: "red",
              fill: false,
            },
            {
              label: "Humidity",
              data: humidityData.slice(-maxDataLength),
              borderColor: "blue",
              fill: false,
            },
            {
              label: "Light",
              data: lightData.slice(-maxDataLength),
              borderColor: "green",
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
        text: "Chart",
      },
    },
  };

  return (
    <div>
      <Line options={options} data={data} />
    </div>
  );
};

export default LineChart;
