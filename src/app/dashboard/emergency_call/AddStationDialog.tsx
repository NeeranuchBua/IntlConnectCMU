'use client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogDescription, DialogTrigger, DialogHeader, DialogContent } from '@/components/ui/dialog';
import { handleApiError } from '@/types/api/apiError';
import axios from 'axios';
import { useState } from 'react';
import { toast } from 'react-toastify';

const AddStationDialog = ({topic,getEmergencyConfig}:{topic:string, getEmergencyConfig: any}) => {
  const [newStation, setNewStation] = useState<string>('');
  const [contact, setContact] = useState<string>('');
  const handleAddStation = async () => {
    try {
      await axios.post(`/api/emergency/${topic}`, {station: newStation, contact});
      toast.success('Station added');
      setNewStation('');
      setContact('');
      getEmergencyConfig();
    } catch (e) {
      toast.error(handleApiError(e));
    }
  }
  return (
    <Dialog>
      <DialogTrigger>
        <div data-svg-wrapper className="cursor-pointer">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="32" height="32" rx="16" fill="#F8FAFC" />
            <path d="M16 26C21.5228 26 26 21.5228 26 16C26 10.4772 21.5228 6 16 6C10.4772 6 6 10.4772 6 16C6 21.5228 10.4772 26 16 26Z" stroke="#A867BF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 16H20" stroke="#A867BF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 12V20" stroke="#A867BF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </DialogTrigger>
      <DialogContent className="p-6 bg-white rounded-lg shadow-lg w-full max-w-md mx-auto">
        <DialogHeader className="text-lg font-semibold">Add Station</DialogHeader>
        <DialogDescription>
          <div className="mt-4 space-y-2">
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-lg"
              placeholder="Station Name"
              value={newStation}
              onChange={(e) => setNewStation(e.target.value)}
            />
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-lg"
              placeholder="Contact"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
            />
            <Button onClick={handleAddStation} className="w-full mt-4 bg-green-500 text-white rounded-lg py-2">
              Add
            </Button>
          </div>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}

export default AddStationDialog