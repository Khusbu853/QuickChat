import React, { useState, useEffect } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { FaPlus } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { CREATE_CHANNEL_ROUTE, GET_ALL_CONTACTS_ROUTE,} from "../../../../utils/constants";
import { apiClient } from "../../../../lib/api-client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";
import { useDispatch } from "react-redux";
import { setChannels, setSelectedChatData, setSelectedChatType } from "../../../../redux/chatSlice";
import MultipleSelector from "./MultipleSelector";


const CreateChannel = () => {
  const dispatch = useDispatch();
  const [openNewChannelModal, setOpenNewChannelModal] = useState(false);
  const [searchedContacts, setSearchedContacts] = useState([]);
  const [allContacts, setAllContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [channelName, setChannelName] = useState("");

  useEffect(() => {
    const getData = async () => {
        const response = await apiClient.get(GET_ALL_CONTACTS_ROUTE, {
            withCredentials: true
        });
        setAllContacts(response.data.contacts)
    }
    getData()
  }, [])

  const createChannel = async () => {
    try {
        if (channelName.length > 0 && selectedContacts.length > 0) {
            const response = await apiClient.post(CREATE_CHANNEL_ROUTE, {
                name: channelName,
                members: selectedContacts.map((contact) => contact.value),
            },
            {withCredentials: true}
        )
        if (response.status === 201) {
            setChannelName("");
            setSelectedContacts([]);
            setOpenNewChannelModal(false);
            dispatch(setChannels(response?.data?.channel))
        }
        }
    } catch (error) {
      console.error("Error in creating channel:", error);
    }
  }

  return (
    <>
    <Tooltip>
      <TooltipTrigger asChild>
        <FaPlus
          onClick={() => setOpenNewChannelModal(true)}
          className="text-neutral-400 font-light text-opacity-90 text-start hover:text-neutral-100 cursor-pointer transition-all duration-300"
        />
      </TooltipTrigger>

      <TooltipContent>
        Create New Channel
      </TooltipContent>
    </Tooltip>

    <Dialog open={openNewChannelModal} onOpenChange={setOpenNewChannelModal}>
        <DialogContent className="bg-[#181920] text-white border-none max-w-lg w-100 h-100 flex flex-col p-0">
            <DialogHeader className="px-6 py-4 border-b border-white/10">
                <DialogTitle className="text-lg font-semibold">
                Create New Channel
                </DialogTitle>
                <DialogDescription className="text-sm text-gray-400">
                Add a channel name and select members
                </DialogDescription>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                <input
                placeholder="Channel Name"
                className="w-full bg-[#2a2b33] text-white px-4 py-2 rounded-md outline-none focus:ring-2 focus:ring-purple-500"
                onChange={(e) => setChannelName(e.target.value)}
                value={channelName}
                />

                <MultipleSelector
                options={allContacts}
                placeholder="Search Contacts"
                value={selectedContacts}
                onChange={setSelectedContacts}
                />
            </div>


            <div className="px-6 py-4 border-t border-white/10">
                <button
                className="w-full cursor-pointer bg-purple-600 hover:bg-purple-700 active:scale-[0.98] text-white py-3 rounded-md font-semibold transition disabled:opacity-50"
                onClick={createChannel}
                disabled={!channelName || selectedContacts.length === 0}
                >
                Create Channel
                </button>
            </div>

        </DialogContent>
    </Dialog>
    </>
  );
};

export default CreateChannel;