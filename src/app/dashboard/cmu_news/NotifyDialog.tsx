"use client";

import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// Props for our NotifyDialog
interface NotifyDialogProps {
    postId: string;
    onNotifySuccess?: () => void; // callback after notification is sent, optional
}

const NotifyDialog: React.FC<NotifyDialogProps> = ({ postId, onNotifySuccess }) => {
    const [open, setOpen] = useState(false);

    const handleNotify = async () => {
        try {
            // Send POST request with postId to /api/news/notify
            await axios.post(`/api/news/${postId}/notify`);
            toast.success("Notification sent successfully!");
            setOpen(false);

            if (onNotifySuccess) {
                onNotifySuccess();
            }
        } catch (error) {
            toast.error("An error occurred while sending the notification.");
            console.error(error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="secondary">
                    Notify
                </Button>
            </DialogTrigger>
            <DialogContent>
                <div className="flex flex-col gap-4">
                    <p className="text-gray-800">
                        Are you sure you want to send a notification for this post?
                    </p>
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleNotify}>
                            Send Notification
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default NotifyDialog;