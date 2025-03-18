"use client";
import { Button } from "@/components/ui/button";
import { formatDateThai } from "@/lib/utils";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Weather = () => {
  const [weatherConfigs, setWeatherConfigs] = useState<Record<string, boolean>>(
    {
      weatherconfig6: false,
    }
  );

  const [prevWeatherText, setPrevWeatherText] = useState<
    Record<string, string>
  >({
    aqi0: "",
    aqi25: "",
    aqi50: "",
    aqi100: "",
  });

  const [weatherText, setWeatherText] = useState<Record<string, string>>({
    aqi0: "",
    aqi25: "",
    aqi50: "",
    aqi100: "",
  });

  const handleWeatherPOST = async (newWeatherConfigs: any) => {
    const response = await axios.post("/api/weather", newWeatherConfigs);
    if (response.status !== 200) {
      toast.error("Failed to update PM 2.5 configurations");
    }
  };

  const [currentTemperature, setCurrentTemperature] = useState<number>(0);
  const [currentRainfall, setCurrentRainfall] = useState<number>(0);
  const [currentWeatherTime, setCurrentWeatherTime] = useState("");
  const [currentWeatherText, setCurrentWeatherText] = useState("");
  const [currentWeatherPressureText, setCurrentWeatherPressureText] = useState("");

  const fetchWeather = async () => {
    const response = await axios.get("/api/weather/current");
    if (response.status === 200) {
      setCurrentTemperature(response.data.temp_c);
      setCurrentRainfall(response.data.precip_mm);
      setCurrentWeatherTime(formatDateThai(new Date(response.data.time)));
      setCurrentWeatherText(response.data.temperatureText);
      setCurrentWeatherPressureText(response.data.pressureText);
    }
    else {
      toast.error("Failed to fetch current AQI data");
    }
  }

  useEffect(() => {
    fetchWeatherConfigs();
    fetchWeatherText();
    fetchWeather();
  }, []);

  const fetchWeatherConfigs = async () => {
    const response = await axios.get("/api/weather");
    if (response.status === 200) {
      setWeatherConfigs(response.data);
    } else {
      toast.error("Failed to fetch Weather configurations");
    }
  };

  const fetchWeatherText = async () => {
    const response = await axios.get("/api/weather/text");
    if (response.status === 200) {
      setPrevWeatherText(response.data);
      setWeatherText(response.data);
    } else {
      toast.error("Failed to fetch Weather Text configurations");
    }
  };

  const handleNotifyMessage = async (config: string) => {
    const response = await axios.post("/api/weather/text/notify", {
      weatherConfig: config,
    });
    if (response.status !== 200) {
      toast.error("Failed to send notification");
    }
    toast.success("Notification sent successfully");
  };

  const toggleWeatherConfig = async (type: string) => {
    const newWeatherConfigs = {
      ...weatherConfigs,
      [type]: !weatherConfigs[type],
    };
    await handleWeatherPOST(newWeatherConfigs);
    setWeatherConfigs((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const handleSaveWeatherText = async (config: string) => {
    const response = await axios.post("/api/weather/text", {
      weatherConfig: config,
      weatherText: weatherText[config],
    });
    if (response.status !== 200) {
      toast.error("Failed to update Weather Text configurations");
    } else {
      setPrevWeatherText((prev) => ({
        ...prev,
        [config]: weatherText[config],
      }));
    }
  };

  return (
    <div className="p-9 w-full bg-slate-50 flex-col justify-start items-start gap-9 inline-flex">
      <div className="text-center text-purple-950 text-xl font-bold leading-[15px]">
        Weather Setting
      </div>
      {/* Alert Toggles */}
      <div className="flex gap-4 justify-between w-full">
        {[
          { time: "6.00 o'clock", type: "morning", config: "weatherconfig6" },
        ].map((alert) => (
          <div
            key={alert.type}
            className="flex gap-4 justify-between w-full"
          >
            <div className="text-purple-950 text-base font-bold">
              Notify {alert.time}
            </div>
            <div
              className={`w-[50px] h-7 p-0.5 ${
                weatherConfigs[alert.config] ? "bg-[#00d64f]" : "bg-gray-400"
              } rounded-[32px] flex items-center cursor-pointer transition-colors`}
              onClick={() => toggleWeatherConfig(alert.config)}
            >
              <div
                className={`w-6 h-6 bg-white rounded-full transition-transform ${
                  weatherConfigs[alert.config]
                    ? "translate-x-[20px]"
                    : "translate-x-0"
                }`}
              />
            </div>
            <div className="max-w-[50%] whitespace-normal flex flex-col gap-2">
              <div className="border rounded-lg bg-white">
                {/* temperature */}
                <div className="p-4 m-4 text-purple-950 text-sm font-bold flex items-center gap-2.5 mb-0">
                  <div className="text-2xl font-bold top-0 align-text-top">
                    Temperature: {currentTemperature}°C
                  </div>
                  <div className="text-base font-normal">
                    {
                      currentWeatherText
                    }
                  </div>
                </div>
                {/* Rainfall criteria */}
                <div className="p-4 m-4 text-purple-950 text-sm font-bold flex items-center gap-2.5 mb-0">
                  <div className="text-2xl font-bold top-0 align-text-top">
                  Rainfall criteria: {currentRainfall} mm
                  </div>
                  <div className="text-base font-normal">
                    {
                      currentWeatherPressureText
                    }
                  </div>
                </div>
                <div className="px-4 mx-4 text-purple-950 text-sm font-bold flex items-end gap-2.5 border-t py-2">
                  <div className="text-base font-normal text-right">
                    Last updated: {currentWeatherTime}
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        ))}
      </div>

      {/* อากาศร้อน */}
      {[
        {
          range: "Temperatures of 35°C or higher",
          quality: "Very hot to extreme heat",
          description: "Temperatures of 35°C or higher",
          bg: "bg-red-50",
          border: "border-cyan-800",
          config: "weathertexthot",
        },
      ].map((card) => (
        <div
          key={card.range}
          className={`p-4 ${card.bg} relative rounded-2xl ${card.border} border justify-start items-center gap-[50px] inline-flex w-full`}
        >
          <div className="w-[64px] text-purple-950 text-sm font-bold">
            Hot weather threshold
          </div>
          <div className="w-[60px] text-purple-950 text-sm font-bold">
            {card.range}
          </div>
          <div className="w-[123px] text-purple-950 text-sm font-bold">
            {card.quality}
          </div>
          <textarea
            className={`w-full h-[230px] px-4 py-2.5 rounded-md border border-gray-200 text-slate-500 text-base
                ${
                  prevWeatherText[card.config] !== weatherText[card.config]
                    ? "bg-yellow-50"
                    : "bg-white"
                }
                `}
            value={weatherText[card.config]}
            placeholder={card.description}
            onChange={(e) => {
              const newDescription = e.target.value;
              setWeatherText((prev) => ({
                ...prev,
                [card.config]: newDescription,
              }));
            }}
          />
          {prevWeatherText[card.config] !== weatherText[card.config] && (
            <div className="absolute mb-2 bottom-0 space-x-2">
              {weatherText[card.config] !== "" && (
                <Button
                  onClick={() => handleSaveWeatherText(card.config)}
                  className="bottom-0 bg-green-600 hover:bg-green-500 active:bg-green-600"
                >
                  Save Change
                </Button>
              )}
              <Button
                onClick={() =>
                  setWeatherText((aqi) => {
                    aqi[card.config] = prevWeatherText[card.config];
                    return { ...aqi };
                  })
                }
                className="bottom-0 bg-gray-600 hover:bg-gray-500 active:bg-gray-600"
              >
                Cancel
              </Button>
            </div>
          )}
          {weatherText[card.config] &&
            weatherText[card.config] !== "" &&
            prevWeatherText[card.config] === weatherText[card.config] && (
              <div className="absolute mt-2 top-0 space-x-2">
                <Button
                  onClick={() => handleNotifyMessage(card.config)}
                  className="bottom-0 bg-gray-600 hover:bg-gray-500 active:bg-gray-600"
                >
                  Test Notify
                </Button>
              </div>
            )}
        </div>
      ))}

      {/* อากาศเย็น */}
      {[
        {
          range: "Temperatures of 22.9°C or lower",
          quality: "Cool to very cold weather",
          description: "Temperatures of 22.9°C or lower",
          bg: "bg-sky-50",
          border: "border-cyan-800",
          config: "weathertextcold",
        },
      ].map((card) => (
        <div
          key={card.range}
          className={`p-4 ${card.bg} relative rounded-2xl ${card.border} border justify-start items-center gap-[50px] inline-flex w-full`}
        >
          <div className="w-[64px] text-purple-950 text-sm font-bold">
            Cold weather threshold
          </div>
          <div className="w-[60px] text-purple-950 text-sm font-bold">
            {card.range}
          </div>
          <div className="w-[123px] text-purple-950 text-sm font-bold">
            {card.quality}
          </div>
          <textarea
            className={`w-full h-[230px] px-4 py-2.5 rounded-md border border-gray-200 text-slate-500 text-base
                ${
                  prevWeatherText[card.config] !== weatherText[card.config]
                    ? "bg-yellow-50"
                    : "bg-white"
                }
                `}
            value={weatherText[card.config]}
            placeholder={card.description}
            onChange={(e) => {
              const newDescription = e.target.value;
              setWeatherText((prev) => ({
                ...prev,
                [card.config]: newDescription,
              }));
            }}
          />
          {prevWeatherText[card.config] !== weatherText[card.config] && (
            <div className="absolute mb-2 bottom-0 space-x-2">
              {weatherText[card.config] !== "" && (
                <Button
                  onClick={() => handleSaveWeatherText(card.config)}
                  className="bottom-0 bg-green-600 hover:bg-green-500 active:bg-green-600"
                >
                  Save Change
                </Button>
              )}
              <Button
                onClick={() =>
                  setWeatherText((aqi) => {
                    aqi[card.config] = prevWeatherText[card.config];
                    return { ...aqi };
                  })
                }
                className="bottom-0 bg-gray-600 hover:bg-gray-500 active:bg-gray-600"
              >
                Cancel
              </Button>
            </div>
          )}
          {weatherText[card.config] &&
            weatherText[card.config] !== "" &&
            prevWeatherText[card.config] === weatherText[card.config] && (
              <div className="absolute mt-2 top-0 space-x-2">
                <Button
                  onClick={() => handleNotifyMessage(card.config)}
                  className="bottom-0 bg-gray-600 hover:bg-gray-500 active:bg-gray-600"
                >
                  Test Notify
                </Button>
              </div>
            )}
        </div>
      ))}

      {/* เกณฑ์ปริมาณฝน */}
      {[
        {
          range: "Rainfall criteria: 0.1 - 35 mm",
          quality: "Light to moderate rain",
          description: "Rainfall criteria: 0.1 - 35 mm",
          bg: "bg-purple-50",
          border: "border-cyan-800",
          config: "weathertextrainlow",
        },
      ].map((card) => (
        <div
          key={card.range}
          className={`p-4 ${card.bg} relative rounded-2xl ${card.border} border justify-start items-center gap-[50px] inline-flex w-full`}
        >
          <div className="w-[64px] text-purple-950 text-sm font-bold">
            Rainfall criteria
          </div>
          <div className="w-[60px] text-purple-950 text-sm font-bold">
            {card.range}
          </div>
          <div className="w-[123px] text-purple-950 text-sm font-bold">
            {card.quality}
          </div>
          <textarea
            className={`w-full h-[230px] px-4 py-2.5 rounded-md border border-gray-200 text-slate-500 text-base
                ${
                  prevWeatherText[card.config] !== weatherText[card.config]
                    ? "bg-yellow-50"
                    : "bg-white"
                }
                `}
            value={weatherText[card.config]}
            placeholder={card.description}
            onChange={(e) => {
              const newDescription = e.target.value;
              setWeatherText((prev) => ({
                ...prev,
                [card.config]: newDescription,
              }));
            }}
          />
          {prevWeatherText[card.config] !== weatherText[card.config] && (
            <div className="absolute mb-2 bottom-0 space-x-2">
              {weatherText[card.config] !== "" && (
                <Button
                  onClick={() => handleSaveWeatherText(card.config)}
                  className="bottom-0 bg-green-600 hover:bg-green-500 active:bg-green-600"
                >
                  Save Change
                </Button>
              )}
              <Button
                onClick={() =>
                  setWeatherText((aqi) => {
                    aqi[card.config] = prevWeatherText[card.config];
                    return { ...aqi };
                  })
                }
                className="bottom-0 bg-gray-600 hover:bg-gray-500 active:bg-gray-600"
              >
                Cancel
              </Button>
            </div>
          )}
          {weatherText[card.config] &&
            weatherText[card.config] !== "" &&
            prevWeatherText[card.config] === weatherText[card.config] && (
              <div className="absolute mt-2 top-0 space-x-2">
                <Button
                  onClick={() => handleNotifyMessage(card.config)}
                  className="bottom-0 bg-gray-600 hover:bg-gray-500 active:bg-gray-600"
                >
                  Test Notify
                </Button>
              </div>
            )}
        </div>
      ))}

      {/* เกณฑ์ปริมาณฝน */}
      {[
        {
          range: "Rainfall criteria: 35.1 mm and above",
          quality: "Heavy to very heavy rain",
          description: "Rainfall criteria: 35.1 mm and above",
          bg: "bg-purple-50",
          border: "border-cyan-800",
          config: "weathertextrainhigh",
        },
      ].map((card) => (
        <div
          key={card.range}
          className={`p-4 ${card.bg} relative rounded-2xl ${card.border} border justify-start items-center gap-[50px] inline-flex w-full`}
        >
          <div className="w-[64px] text-purple-950 text-sm font-bold">
            Rainfall criteria
          </div>
          <div className="w-[60px] text-purple-950 text-sm font-bold">
            {card.range}
          </div>
          <div className="w-[123px] text-purple-950 text-sm font-bold">
            {card.quality}
          </div>
          <textarea
            className={`w-full h-[230px] px-4 py-2.5 rounded-md border border-gray-200 text-slate-500 text-base
                ${
                  prevWeatherText[card.config] !== weatherText[card.config]
                    ? "bg-yellow-50"
                    : "bg-white"
                }
                `}
            value={weatherText[card.config]}
            placeholder={card.description}
            onChange={(e) => {
              const newDescription = e.target.value;
              setWeatherText((prev) => ({
                ...prev,
                [card.config]: newDescription,
              }));
            }}
          />
          {prevWeatherText[card.config] !== weatherText[card.config] && (
            <div className="absolute mb-2 bottom-0 space-x-2">
              {weatherText[card.config] !== "" && (
                <Button
                  onClick={() => handleSaveWeatherText(card.config)}
                  className="bottom-0 bg-green-600 hover:bg-green-500 active:bg-green-600"
                >
                  Save Change
                </Button>
              )}
              <Button
                onClick={() =>
                  setWeatherText((aqi) => {
                    aqi[card.config] = prevWeatherText[card.config];
                    return { ...aqi };
                  })
                }
                className="bottom-0 bg-gray-600 hover:bg-gray-500 active:bg-gray-600"
              >
                Cancel
              </Button>
            </div>
          )}
          {weatherText[card.config] &&
            weatherText[card.config] !== "" &&
            prevWeatherText[card.config] === weatherText[card.config] && (
              <div className="absolute mt-2 top-0 space-x-2">
                <Button
                  onClick={() => handleNotifyMessage(card.config)}
                  className="bottom-0 bg-gray-600 hover:bg-gray-500 active:bg-gray-600"
                >
                  Test Notify
                </Button>
              </div>
            )}
        </div>
      ))}
      <div className="p-1"></div>
    </div>
  );
};

export default Weather;
