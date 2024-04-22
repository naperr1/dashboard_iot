import React, { useState, useEffect } from "react";
import "./Content.css";
import { FaTemperatureHigh, FaRegLightbulb } from "react-icons/fa6";
import { CiLight } from "react-icons/ci";
import LineChart from "../chart/LineChart";
import Header from "../Header/Header";
import icon1 from "../image/cloud.png";
import icon2 from "../image/cloudy.png";
import icon3 from "../image/sun.png";
import weather from "../image/weather.png";
import humidityIcon from "../image/humidity.png";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Device from "../device/Device";

const Content = () => {
  const [isToggled, setToggled] = useState(false);
  const [isLightToggled, setLightToggled] = useState(false);
  const [currentTemperature, setCurrentTemperature] = useState(30);
  const [humidity, setHumidity] = useState(30);
  const [lightIntensity, setLightIntensity] = useState(1024);

  const handleToggle = () => {
    setToggled(!isToggled);
  };

  const handleLightToggle = () => {
    setLightToggled(!isLightToggled);
  };

  const updateTemperature = (temperature) => {
    setCurrentTemperature(temperature);
  };

  const updateHumidity = (humidityValue) => {
    setHumidity(humidityValue);
  };

  const updateLightIntensity = (intensity) => {
    setLightIntensity(intensity);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/get-data-chart");
        const apiData = await response.json();

        if (apiData.length > 0) {
          const latestData = apiData[apiData.length - 1];
          setCurrentTemperature(latestData.temperature);
          setHumidity(latestData.humidity);
          setLightIntensity(latestData.light);

          if (latestData.temperature > 40) {
            toast.error("Nhiệt độ vượt quá 40°C!");
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    const interval = setInterval(fetchData, 2000);

    return () => clearInterval(interval);
  }, []);

  const getGradientColor = (value, minValue, maxValue, color1, color2) => {
    const percent = (value - minValue) / (maxValue - minValue);
    const red = Math.round(color1[0] + percent * (color2[0] - color1[0]));
    const green = Math.round(color1[1] + percent * (color2[1] - color1[1]));
    const blue = Math.round(color1[2] + percent * (color2[2] - color1[2]));
    return `linear-gradient(45deg, rgb(${red},${green},${blue}), rgb(${color2.join(
      ","
    )}))`;
  };

  useEffect(() => {
    const temperatureGradientColor = getGradientColor(
      currentTemperature,
      0,
      40,
      [0, 153, 247],
      [241, 23, 18]
    );

    const humidityGradientColor = getGradientColor(
      humidity,
      0,
      100,
      [156, 252, 248],
      [110, 123, 251]
    );

    const lightIntensityGradientColor = getGradientColor(
      lightIntensity,
      0,
      100,
      [209, 145, 60],
      [255, 209, 148]
    );

    console.log("Mã màu temperatureBox đã thay đổi:", temperatureGradientColor);
    console.log("Mã màu humidityBox đã thay đổi:", humidityGradientColor);
    console.log(
      "Mã màu lightIntensityBox đã thay đổi:",
      lightIntensityGradientColor
    );

    document.getElementById("temperatureBox").style.background =
      temperatureGradientColor;

    document.getElementById("humidityBox").style.background =
      humidityGradientColor;

    document.getElementById("lightIntensityBox").style.background =
      lightIntensityGradientColor;
  }, [currentTemperature, humidity, lightIntensity]);

  return (
    <div className="container" style={{ height: "calc(100vh - 75px)" }}>
      <div className="container_box" style={{ marginTop: "20px" }}>
        <div className="box temperature-box" id="temperatureBox">
          <img
            src={
              currentTemperature < 20
                ? icon1
                : currentTemperature < 30
                ? icon2
                : icon3
            }
            alt=""
          />
          <div className="temperature-box2">
            <FaTemperatureHigh className="icon" />
            <span>{currentTemperature}°C</span>
          </div>
        </div>

        <div className="box humidity-box" id="humidityBox">
          <img className="img-humidity" src={humidityIcon} alt="" />
          <div className="humidity-box2">
            <img src={weather} alt="" />
            <span>{humidity}%</span>
          </div>
        </div>

        <div className="box light-box" id="lightIntensityBox">
          <CiLight className="icon icon-light" />
          <div className="light-box2">
            <CiLight className="icon" />
            <span style={{ color: "#fff" }}>{lightIntensity}Lux</span>
          </div>
        </div>
      </div>

      <ToastContainer />

      <div className="container_body">
        <div className="chart">
          <LineChart
            updateTemperature={updateTemperature}
            updateHumidity={updateHumidity}
            updateLightIntensity={updateLightIntensity}
          />
        </div>

        <Device />
      </div>
    </div>
  );
};

export default Content;
