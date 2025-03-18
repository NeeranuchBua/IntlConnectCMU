'use client';
import { ImageInventory } from "@/images/ImageInventory";
import Image from "next/image";
import React from "react";
import { useState } from "react";

const Display = () => {
  const [isLineAlertOn, setIsLineAlertOn] = useState(false);

  const handleToggle = () => {
    setIsLineAlertOn((prevState) => !prevState);
  };

  return (
    <div className="w-[1390px] h-[900px] p-9 bg-slate-50 flex-col justify-start items-start gap-9 inline-flex overflow-hidden">
      <div className="text-center text-purple-950 text-xl font-bold leading-[15px]">
        Display Setting
      </div>
      <div className="w-[463px] justify-between items-center inline-flex">
        <div className="justify-start items-center gap-4 flex">
          <Image className="w-8 h-8" src={ImageInventory.icons.line.src} width={32} height={32} alt="alternativeImage"/>
          <div className="text-center text-purple-950 text-base font-bold leading-[15px]">
            Notify LINE
          </div>
        </div>
        {/* Toggle Switch */}
        <div
          className={`w-[50px] h-7 p-0.5 ${
            isLineAlertOn ? "bg-[#00d64f]" : "bg-gray-400"
          } rounded-[32px] flex items-center cursor-pointer transition-colors`}
          onClick={handleToggle}
        >
          <div
            className={`w-6 h-6 bg-white rounded-full transition-transform ${
              isLineAlertOn ? "translate-x-[20px]" : "translate-x-0"
            }`}
          />
        </div>
      </div>
    </div>
  );
};

export default Display;
