import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const LlamaChart = () => {
  const [feesData, setFeesData] = useState([]);
  const [dateTimeData, setDateTimeData] = useState([]);

  const fetchLlamaData = async () => {
    try {
      const response = await axios.get(
        "https://api.llama.fi/summary/fees/lyra?dataType=dailyFees"
      );
      const data = response?.data?.totalDataChart || [];

      console.log(data);
      const formattedData = data.map((dataPoint) => {
        const dateObj = new Date(dataPoint[0] * 1000);
        const date = dateObj.toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
        });
        const time = dateObj.toLocaleTimeString(undefined, {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false, // Use 24-hour format
        });
        return `${date}, ${time}`;
      });
      const fees = data.map((dataPoint) => dataPoint[1]);

      setDateTimeData(formattedData);
      setFeesData(fees);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchLlamaData();
  }, []);

  const data = {
    labels: dateTimeData,
    datasets: [
      {
        label: `$`,
        data: feesData,
        borderColor: "#5D8AA8",
        backgroundColor: "#5D8AA8",
        fill: true,
        pointRadius: 0, // Set the point radius
        pointHoverRadius: 6, // Set the hover radius
        pointStyle: "circle",
        pointHoverBackgroundColor: "rgb(150, 200, 293)",
      },
    ],
  };

  const options = {
    responsive: true,
  };

  return <Line options={options} data={data} />;
};

export default LlamaChart;
