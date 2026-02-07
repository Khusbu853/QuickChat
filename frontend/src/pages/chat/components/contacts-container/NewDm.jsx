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
import Lottie from 'react-lottie';
import { animationDefaultOptions } from '@/lib/utils';
import { SEARCH_CONTACTS_ROUTE } from "../../../../utils/constants";
import { apiClient } from "../../../../lib/api-client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";
import { useDispatch } from "react-redux";
import { setSelectedChatData, setSelectedChatType } from "../../../../redux/chatSlice";

const NewDm = () => {
  const dispatch = useDispatch();
  const [openNewContactModal, setOpenNewContactModal] = useState(false);
  const [searchedContacts, setSearchedContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const debouncedSearch = setTimeout(() => {
      searchContacts(searchTerm);
    }, 300);

    return () => clearTimeout(debouncedSearch);
  }, [searchTerm]);

  const searchContacts = async (searchTerm) => {
    try {
        if(searchTerm.length > 0) {
            const response = await apiClient.post(SEARCH_CONTACTS_ROUTE, {searchTerm: searchTerm}, {
                withCredentials: true
            });
            if(response.status === 200 && response.data.contacts) {
                setSearchedContacts(response.data.contacts);
            }
        } else {
            setSearchedContacts([]);
        }
    } catch (error) {
      console.error("Error searching contacts:", error);
    }
  }

  const selectNewContact = (contact) => {
    setOpenNewContactModal(false);
    dispatch(setSelectedChatType("contact"));
    dispatch(setSelectedChatData(contact));
    setSearchTerm("");
    setSearchedContacts([]);
  }

  return (
    <>
    <Tooltip>
      <TooltipTrigger asChild>
        <FaPlus
          onClick={() => setOpenNewContactModal(true)}
          className="text-neutral-400 font-light text-opacity-90 text-start hover:text-neutral-100 cursor-pointer transition-all duration-300"
        />
      </TooltipTrigger>

      <TooltipContent>
        Select New Contact
      </TooltipContent>
    </Tooltip>

    <Dialog open={openNewContactModal} onOpenChange={setOpenNewContactModal}>
        <DialogContent className="bg-[#181920] text-white border-none h-100 w-100 flex flex-col">
            <DialogHeader>
            <DialogTitle>Please select a contact</DialogTitle>
            <DialogDescription>
            </DialogDescription>
            </DialogHeader>
            <div>
                <input
                    placeholder="Search Contacts..."
                    className="w-full bg-[#2a2b33] text-white px-4 py-2 rounded-md outline-none"
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            
            {searchedContacts.length <= 0 ? (
                <div className='flex-1 md:flex flex-col justify-center items-center duration-1000 transition-all'>
                    <Lottie
                        options={animationDefaultOptions}
                        height={100}
                        width={100}
                        isClickToPauseDisabled={true}
                    />
                    <div className='text-opacity-80 text-white flex flex-col gap-5 items-center mt-5 lg:text-3xl text-xl transition-all duration-300 text-center'>
                        <h6>HI! Search new Contacts.</h6>
                    </div>
                </div>
            ) : <ScrollArea className="flex-1 rounded-md border border-[#2a2b33] p-2">
            <div className="flex flex-col gap-3">
                {searchedContacts.map((contact) => (
                <div
                    key={contact._id}
                    className="flex items-center gap-4 p-3 hover:bg-[#2a2b33] rounded-md cursor-pointer transition-all"
                    onClick={() => selectNewContact(contact)}
                >
                    <Avatar className="h-12 w-12 rounded-full overflow-hidden shrink-0">
                    {contact.image ? (
                        <AvatarImage
                        src={contact.image}
                        alt="Profile"
                        className="h-full w-full object-cover"
                        />
                    ) : (
                        <div
                        className={`uppercase h-full w-full text-lg font-semibold flex items-center justify-center rounded-full ${getColor(contact?.color)}`}
                        >
                        {contact.firstName?.[0] || contact.email?.[0] || "U"}
                        </div>
                    )}
                    </Avatar>

                    <div className="flex flex-col text-white">
                    <span className="font-medium text-sm">
                        {contact.firstName} {contact.lastName}
                    </span>
                    <span className="font-normal text-xs">
                        {contact.email}
                    </span>
                    </div>
                </div>
                ))}
            </div>
            </ScrollArea>}
        </DialogContent>
    </Dialog>
    </>
  );
};

export default NewDm;

