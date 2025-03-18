"use client";
import {
  EmergencyConfig,
} from "@/app/api/emergency/function";
import StationCard from "./StationCard";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { handleApiError } from "@/types/api/apiError";
import AddStationDialog from "./AddStationDialog";
import { useSession } from "next-auth/react";
import { RoleTypes } from "@/types/prisma/RBACTypes";
import NormalStationCard from "./NormalStationCard";

const EmergencyCall = () => {
  const [stations, setStations] = useState<EmergencyConfig>({
    emergency1: null,
    emergency2: null,
    emergency3: null,
  });

  const getEmergencyConfigs = async () => {
    try {
      const res = await axios.get("/api/emergency/public");
      const data = res.data as EmergencyConfig;
      setStations(data);
    } catch (e) {
      toast.error(handleApiError(e));
    }
  };

  const {data: session} = useSession();

  useEffect(() => {
    getEmergencyConfigs();
  }, []);

  return (
    <div className="w-[1390px] p-9 bg-slate-50 flex-col justify-start items-center gap-4 inline-flex overflow-auto ">
      <div className="self-stretch h-44 flex-col justify-start items-start gap-4 flex">
        <div className="self-stretch p-2 bg-[#b12020] justify-start items-center gap-2 inline-flex">
          <div className="text-white text-base font-bold font-['LINE Seed Sans TH'] leading-normal">
            {"Emergency Call"}
          </div>
          {session?.user?.role === RoleTypes.Admin || session?.user?.role === RoleTypes.SuperAdmin && <AddStationDialog topic="emergency1" getEmergencyConfig={getEmergencyConfigs}/>}
        </div>
        <div className="self-stretch px-2 flex-col justify-start items-start gap-4 flex">
          {stations.emergency1?.map((station) => (
            session?.user?.role === RoleTypes.Admin || session?.user?.role === RoleTypes.SuperAdmin ? <StationCard key={station.station} stationData={station} getEmergencyConfig={getEmergencyConfigs}/> : <NormalStationCard key={station.station} stationData={station}/>
          ))}
        </div>
        <div className="self-stretch p-2 bg-[#b12020] justify-start items-center gap-2 inline-flex">
          <div className="text-white text-base font-bold font-['LINE Seed Sans TH'] leading-normal">
            {"Local Hospital in Chiang Mai"}
          </div>
          {session?.user?.role === RoleTypes.Admin || session?.user?.role === RoleTypes.SuperAdmin && <AddStationDialog topic="emergency2" getEmergencyConfig={getEmergencyConfigs}/>}
        </div>
        <div className="self-stretch px-2 flex-col justify-start items-start gap-4 flex">
          {stations.emergency2?.map((station) => (
            session?.user?.role === RoleTypes.Admin || session?.user?.role === RoleTypes.SuperAdmin ? <StationCard key={station.station} stationData={station} getEmergencyConfig={getEmergencyConfigs}/> : <NormalStationCard key={station.station} stationData={station}/>
          ))}
        </div>
        <div className="self-stretch p-2 bg-[#b12020] justify-start items-center gap-2 inline-flex">
          <div className="text-white text-base font-bold font-['LINE Seed Sans TH'] leading-normal">
            {"International Center @CMU"}
          </div>
          {session?.user?.role === RoleTypes.Admin || session?.user?.role === RoleTypes.SuperAdmin && <AddStationDialog topic="emergency3" getEmergencyConfig={getEmergencyConfigs}/>}
        </div>
        <div className="self-stretch px-2 flex-col justify-start items-start gap-4 flex">
          {stations.emergency3?.map((station) => (
            session?.user?.role === RoleTypes.Admin || session?.user?.role === RoleTypes.SuperAdmin ? <StationCard key={station.station} stationData={station} getEmergencyConfig={getEmergencyConfigs}/> : <NormalStationCard key={station.station} stationData={station}/>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmergencyCall;
