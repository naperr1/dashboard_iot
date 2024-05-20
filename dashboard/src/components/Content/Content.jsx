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
import { FaWind } from "react-icons/fa6";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Device from "../device/Device";
import ChartWind from "../chart/ChartWind";

const Content = () => {
  const [isToggled, setToggled] = useState(false);
  const [isLightToggled, setLightToggled] = useState(false);
  const [currentTemperature, setCurrentTemperature] = useState(30);
  const [humidity, setHumidity] = useState(30);
  const [lightIntensity, setLightIntensity] = useState(1024);
  const [wind, setWind] = useState(10);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     const newWind = Math.floor(Math.random() * 21); // Random number from 0 to 20
  //     setWind(newWind);
  //   }, 5000); // 5 seconds

  //   return () => clearInterval(interval); // Cleanup function to clear interval when component unmounts
  // }, []);

  const updateTemperature = (temperature) => {
    setCurrentTemperature(temperature);
  };

  const updateHumidity = (humidityValue) => {
    setHumidity(humidityValue);
  };

  const updateLightIntensity = (intensity) => {
    setLightIntensity(intensity);
  };
  const updateWindSpeed = (speed) => {
    setWind(speed);
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
          setWind(latestData.wind_speed);

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
      50,
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
    const windIntensityGradientColor = getGradientColor(
      lightIntensity,
      0,
      30,
      [136, 205, 246],
      [188, 230, 255]
    );
    // console.log("Mã màu temperatureBox đã thay đổi:", temperatureGradientColor);
    // console.log("Mã màu humidityBox đã thay đổi:", humidityGradientColor);
    // console.log(
    //   "Mã màu lightIntensityBox đã thay đổi:",
    //   windIntensityGradientColor
    // );

    document.getElementById("temperatureBox").style.background =
      temperatureGradientColor;

    document.getElementById("humidityBox").style.background =
      humidityGradientColor;

    document.getElementById("lightIntensityBox").style.background =
      lightIntensityGradientColor;
    document.getElementById("windIntensityBox").style.background =
      windIntensityGradientColor;
  }, [currentTemperature, humidity, lightIntensity, wind]);

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
        <div className="box light-box" id="windIntensityBox">
          <FaWind className="icon icon-light" />
          <div className="light-box2">
            <FaWind className="icon" />
            <span style={{ color: "#fff" }}>{wind}m/s</span>
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
          <ChartWind updateWindSpeed={updateWindSpeed} />
        </div>

        <Device />
      </div>
    </div>
  );
};

export default Content;
