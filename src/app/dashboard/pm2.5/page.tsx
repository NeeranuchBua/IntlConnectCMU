"use client";
import { Button } from "@/components/ui/button";
import { formatDateThai } from "@/lib/utils";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const PM25 = () => {
  const [loading, setLoading] = useState(true);

  const [pm25Configs, setPm25Configs] = useState<Record<string, boolean>>({
    pm25config6: false,
    pm25config12: false,
    pm25config18: false,
    aqi100image: false,
  });

  const [prevAQIText, setPrevAQIText] = useState<Record<string, string>>({
    aqi0: "",
    aqi25: "",
    aqi50: "",
    aqi100: "",
    aqi200: "",
  });

  const [aqiText, setAqiText] = useState<Record<string, string>>({
    aqi0: "",
    aqi25: "",
    aqi50: "",
    aqi100: "",
    aqi200: "",
  });

  const handlePM25POST = async (newPM25Configs: any) => {
    const response = await axios.post("/api/pm2.5", newPM25Configs);
    if (response.status !== 200) {
      toast.error("Failed to update PM 2.5 configurations");
    }
  }

  const fetchAQI = async () => {
    const response = await axios.get("/api/pm2.5/current");
    if (response.status === 200) {
      setCurrentAQI(response.data?.aqi);
      setCurrentAQIText(response.data?.notificationAQIText);
      setCurrentAQITime(response.data?.time);
    }
    else {
      toast.error("Failed to fetch current AQI data");
    }
  }

  const handleAQINotify = async () => {
    const response = await axios.post("/api/pm2.5/current");
    if (response.status !== 200) {
      toast.error("Failed to send notification");
    }
    toast.success("Notification sent successfully");
  }

  useEffect(() => {
    fetchPM25Configs();
    fetchAQIText();
    fetchAQI();
  }, []);

  const fetchPM25Configs = async () => {
    setLoading(true);
    const response = await axios.get("/api/pm2.5");
    if (response.status === 200) {
      setPm25Configs(response.data);
    }
    else {
      toast.error("Failed to fetch PM 2.5 configurations");
    }
    setLoading(false);
  };

  const fetchAQIText = async () => {
    setLoading(true);
    const response = await axios.get("/api/pm2.5/aqitext");
    if (response.status === 200) {
      setPrevAQIText(response.data);
      setAqiText(response.data);
    }
    else {
      toast.error("Failed to fetch AQI text configurations");
    }
    setLoading(false);
  }

  const handleSaveAQIText = async (config: string) => {
    const response = await axios.post("/api/pm2.5/aqitext", { aqiConfig: config, aqitext: aqiText[config] });
    if (response.status !== 200) {
      toast.error("Failed to update AQI text configurations");
    }
    else {
      setPrevAQIText((prev) => ({
        ...prev,
        [config]: aqiText[config],
      }));
    }
  }

  const handleNotifyMessage = async (config: string) => {
    const response = await axios.post("/api/pm2.5/aqitext/notify", { aqiConfig: config });
    if (response.status !== 200) {
      toast.error("Failed to send notification");
    }
    toast.success("Notification sent successfully");
  }

  const togglePm25Config = async (type: string) => {
    const newPM25Configs = { ...pm25Configs, [type]: !pm25Configs[type] };
    await handlePM25POST(newPM25Configs);
    setPm25Configs((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const [currentAQI, setCurrentAQI] = useState(0);
  const [currentAQITime, setCurrentAQITime] = useState("");
  const [currentAQIText, setCurrentAQIText] = useState("");

  if (loading) {
    return (
      <div className="p-9 w-full bg-slate-50 flex-col justify-start items-start gap-9 inline-flex">

      </div>
    )
  }


  return (
    <div className="p-9 relative w-full bg-slate-50 flex-col justify-start items-start gap-9 inline-flex">
      <div className="flex gap-4 justify-between w-full">
        <div className="flex-col justify-start items-start gap-9 inline-flex">
          <div className="text-center text-purple-950 text-xl font-bold leading-[15px]">
            AQI Notify Setting
          </div>
          {/* Alert Toggles */}
          <div className="flex flex-col gap-4">
            {[
              { time: "6.00 o'clock", type: "morning", config: "pm25config6" },
              { time: "12.00 o'clock", type: "noon", config: "pm25config12" },
              { time: "18.00 o'clock", type: "evening", config: "pm25config18" },
            ].map((alert) => (
              <div
                key={alert.type}
                className="w-[463px] justify-between items-center inline-flex"
              >
                <div className="text-purple-950 text-base font-bold">
                  Notify {alert.time}
                </div>
                <div
                  className={`w-[50px] h-7 p-0.5 ${pm25Configs[alert.config] ? "bg-[#00d64f]" : "bg-gray-400"
                    } rounded-[32px] flex items-center cursor-pointer transition-colors`}
                  onClick={() => togglePm25Config(alert.config)}
                >
                  <div
                    className={`w-6 h-6 bg-white rounded-full transition-transform ${pm25Configs[alert.config] ? "translate-x-[20px]" : "translate-x-0"
                      }`}
                  />
                </div>
              </div>
            ))}
          </div>

        </div>
        <div className="max-w-[50%] whitespace-normal flex flex-col gap-2">
          <div className="border rounded-lg bg-white">
            <div className="p-4 m-4 text-purple-950 text-sm font-bold flex items-center gap-2.5 mb-0">
              <div className="text-2xl font-bold top-0 align-text-top">AQI: {currentAQI}</div>
              <div className="text-base font-normal">{currentAQIText}</div>
            </div>
            <div className="px-4 mx-4 text-purple-950 text-sm font-bold flex items-end gap-2.5 border-t py-2">
              <div className="text-base font-normal text-right">Last updated: {formatDateThai(new Date(currentAQITime))}</div>
            </div>
          </div>
          <Button onClick={() => handleAQINotify()} className="bg-purple-950 right-0 ml-auto m-4 hover:bg-purple-900 active:bg-purple-950">
            Notify AQI
          </Button>
        </div>
      </div>


      {/* AQI Data Cards */}
      {[
        {
          range: "0-25",
          quality: "Excellent air quality",
          description:
            "Placeholder",
          bg: "bg-cyan-50",
          border: "border-cyan-800",
          config: "aqi0",
        },
        {
          range: "26-50",
          quality: "Good air quality",
          description:
            "Placeholder",
          bg: "bg-green-50",
          border: "border-green-800",
          config: "aqi25",
        },
        {
          range: "51-100",
          quality: "Moderate air quality",
          description: "Placeholder",
          bg: "bg-yellow-50",
          border: "border-yellow-800",
          config: "aqi50",
        },
        {
          range: "101-200",
          quality: "Air quality is beginning to affect health",
          description: "Placeholder",
          bg: "bg-orange-50",
          border: "border-orange-800",
          config: "aqi100",
        },
        {
          range: ">200",
          quality: "Air quality is harmful to health",
          description:
            "Placeholder",
          bg: "bg-red-50",
          border: "border-red-800",
          config: "aqi200",
        },
      ].map((card) => (
        <div
          key={card.range}
          className={`p-4 ${card.bg} relative rounded-2xl ${card.border} border justify-start items-center gap-[50px] inline-flex w-full`}
        >
          <div className="w-[64px] text-purple-950 text-sm font-bold">
            AQI Value
          </div>
          <div className="w-[60px] text-purple-950 text-sm font-bold">
            {card.range}
          </div>
          <div className="w-[123px] text-purple-950 text-sm font-bold">
            {card.quality}
          </div>
          <div className="flex-col flex-grow justify-start items-start gap-2 inline-flex">
            <div className="text-slate-600 text-base font-normal">
            Output message
            </div>
            <textarea
              className={`self-stretch h-[230px] px-4 py-2.5 rounded-md border border-gray-200 text-slate-500 text-base
                ${prevAQIText[card.config] !== aqiText[card.config] ? "bg-yellow-50" : "bg-white"}
                `}
              value={aqiText[card.config]}
              placeholder={card.description}
              onChange={(e) => {
                const newDescription = e.target.value;
                setAqiText((prev) => ({
                  ...prev,
                  [card.config]: newDescription,
                }));
              }}
            />
          </div>
          {
            prevAQIText[card.config] !== aqiText[card.config] && (
              <div className="absolute mb-2 bottom-0 space-x-2">
                {aqiText[card.config] !== "" &&
                  <Button onClick={() => handleSaveAQIText(card.config)} className="bottom-0 bg-green-600 hover:bg-green-500 active:bg-green-600">
                    Save Change
                  </Button>}
                <Button onClick={() => setAqiText((aqi) => {
                  aqi[card.config] = prevAQIText[card.config];
                  return { ...aqi };
                })} className="bottom-0 bg-gray-600 hover:bg-gray-500 active:bg-gray-600">
                  Cancel
                </Button>
              </div>
            )
          }
          {
            aqiText[card.config] && aqiText[card.config] !== "" && prevAQIText[card.config] === aqiText[card.config] && (
              <div className="absolute mt-2 top-0 space-x-2">
                <Button onClick={() =>
                  handleNotifyMessage(card.config)
                } className="bottom-0 bg-gray-600 hover:bg-gray-500 active:bg-gray-600">
                  Test Notify
                </Button>
              </div>
            )
          }
        </div>
      ))}
      <div className="p-1"></div>
    </div>
  );
};

export default PM25;
