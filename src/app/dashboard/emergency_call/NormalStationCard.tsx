"use client";
import { EmergencyRecord } from "@/app/api/emergency/function";

const NormalStationCard = ({ stationData }: { stationData: EmergencyRecord }) => {
  return (
    <div className="flex-col justify-start items-start gap-1 flex">
      <div className="self-stretch h-6 text-[#111111] text-sm font-bold font-['LINE Seed Sans TH'] leading-[21px]">
        {stationData.station}
      </div>
      <div className="pl-2 justify-start items-start gap-6 inline-flex">
        <div className="justify-center items-center gap-1 flex">
          <div className="text-[#111111] text-base font-normal font-['LINE Seed Sans TH'] leading-normal">
            Call :
          </div>
          <div className="text-[#244de0] text-base font-normal font-['LINE Seed Sans TH'] leading-normal">
            {stationData.contact}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NormalStationCard;
