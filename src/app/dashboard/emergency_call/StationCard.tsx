"use client";
import { EmergencyRecord } from "@/app/api/emergency/function";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { handleApiError } from "@/types/api/apiError";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";

const StationCard = ({ stationData,getEmergencyConfig }: { stationData: EmergencyRecord, getEmergencyConfig: any }) => {
  const [station, setStation] = useState<EmergencyRecord["station"]>(
    stationData.station
  );
  const [contact, setContact] = useState<EmergencyRecord["contact"]>(
    stationData.contact
  );
  const handleDeleteStation = async () => {
    try {
      await axios.delete(
        `/api/emergency/${stationData.topic}`,
        {
          data: { station: stationData.station },
        }
      );
      toast.success("Station deleted");
      getEmergencyConfig();
    } catch (e) {
      toast.error(handleApiError(e));
    }
  };
  const handleEditStation = async () => {
    try {
      await axios.post(
        `/api/emergency/${stationData.topic}`,
        { station, contact, stationOld: stationData.station }
      );
      toast.success("Station updated");
      getEmergencyConfig();
    } catch (e) {
      toast.error(handleApiError(e));
    }
  };
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
        <Dialog>
          <DialogTrigger>
            <button className="text-black bg-red-500 p-2 rounded-md text-sm font-normal font-['LINE Seed Sans TH'] leading-[21px]">
              Delete
            </button>
          </DialogTrigger>
          <DialogContent>
            <div className="flex-col justify-start items-start gap-4 flex">
              <div className="text-[#111111] text-base font-bold font-['LINE Seed Sans TH'] leading-normal">
                Confirm Delete {stationData.station}
              </div>
              <div className="flex justify-end items-center gap-4">
                <button
                  className="bg-[#b12020] text-white px-4 py-2 rounded-lg"
                  onClick={handleDeleteStation}
                >
                  Delete
                </button>
                <DialogClose className="bg-[#e0e0e0] text-[#111111] px-4 py-2 rounded-lg">
                  Cancel
                </DialogClose>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        <Dialog>
          <DialogTrigger>
            <button className="text-black bg-blue-500 p-2 rounded-md text-sm font-normal font-['LINE Seed Sans TH'] leading-[21px]">
              Edit
            </button>
          </DialogTrigger>
          <DialogContent>
            <div className="flex-col justify-start items-start gap-4 flex">
              <div className="text-[#111111] text-base font-bold font-['LINE Seed Sans TH'] leading-normal">
                Edit {stationData.station}
              </div>
              <div className="flex-col justify-start items-start gap-4 flex">
                <div className="flex justify-start items-center gap-4">
                  <div className="text-[#111111] text-base font-normal font-['LINE Seed Sans TH'] leading-normal">
                    Station Name:
                  </div>
                  <input
                    type="text"
                    value={station}
                    onChange={(e) => {
                      setStation(e.target.value);
                    }}
                  />
                </div>
                <div className="flex justify-start items-center gap-4">
                  <div className="text-[#111111] text-base font-normal font-['LINE Seed Sans TH'] leading-normal">
                    Contact :
                  </div>
                  <input
                    type="text"
                    value={contact}
                    onChange={(e) => {
                      setContact(e.target.value);
                    }}
                  />
                </div>
                <div className="flex justify-end items-center gap-4">
                  <button
                    className="bg-[#244de0] text-white px-4 py-2 rounded-lg"
                    onClick={handleEditStation}
                  >
                    Edit
                  </button>
                  <DialogClose className="bg-[#e0e0e0] text-[#111111] px-4 py-2 rounded-lg">
                    Cancel
                  </DialogClose>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default StationCard;
