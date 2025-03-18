"use client";
import { useRouter } from "next-nprogress-bar";
import React from "react";

const Dashboard = () => {
  const router = useRouter();
  return (
    <div className="p-9 bg-slate-50 flex-col justify-start items-start gap-9 inline-flex overflow-hidden">
      <div className="text-center text-purple-950 text-xl font-bold leading-[15px]">
        Notification Setting
      </div>
      <div className="justify-start items-center space-y-4 ">
        <div className="">
          <div className=" text-purple-950 text-base font-bold py-4">
            {" "}
            Auto-Notification
          </div>
          <div className="justify-start items-center gap-4 inline-flex ">
            <button
              className="h-[47px] px-8 py-4 bg-green-500 rounded-lg shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] border border-[#e2e2e2] justify-start items-center gap-4 flex overflow-hidden text-white text-base font-medium leading-[15px]"
              onClick={() => router.push("/dashboard/pm2.5")}
            >
              AQI
            </button>

            <button
              className="h-[47px] px-8 py-4 bg-green-500 rounded-lg shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] border border-[#e2e2e2] justify-start items-center gap-4 flex overflow-hidden text-white text-base font-medium leading-[15px]"
              onClick={() => router.push("/dashboard/weather")}
            >
              Weather
            </button>
          </div>
        </div>
        <div>
          <div className="text-purple-950 text-base font-bold py-4">
            News-Post
          </div>
          <div className="justify-start items-center gap-4 inline-flex">
            <button
              className="h-[47px] px-8 py-4 bg-violet-500 rounded-lg shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] border border-[#e2e2e2] justify-start items-center gap-4 flex overflow-hidden text-white text-base font-medium leading-[15px]"
              onClick={() => router.push("/dashboard/cmu_news")}
            >
              News
            </button>

            
          </div>
        </div>
      </div>
      <div className="text-center text-purple-950 text-base font-bold leading-[15px]">
        Extra Menu
      </div>
      <div className="justify-start items-center gap-4 inline-flex">
        <div className="justify-start items-center gap-4 inline-flex">
          <button
            className="px-8 py-4 bg-[#f4b814] rounded-lg shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] border border-[#e2e2e2] justify-start items-center gap-4 flex overflow-hidden"
            onClick={() => router.push("/dashboard/emergency_call")}
          >
            <div className="text-center text-white text-base font-medium leading-[15px]">
              Emergency Call
            </div>
          </button>
        </div>
        <div className="justify-start items-center gap-4 inline-flex"></div>
      </div>
    </div>
  );
};

export default Dashboard;
