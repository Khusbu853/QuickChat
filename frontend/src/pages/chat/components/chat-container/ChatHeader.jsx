import React from "react";
import { RiCloseFill } from "react-icons/ri";
import { closeChat,  } from "../../../../redux/chatSlice";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";

const ChatHeader = () => {
  const dispatch = useDispatch();
  const { selectedChatData, selectedChatType } = useSelector((store) => store.chat);

  const handleChatclose = () => {
    dispatch(closeChat());
  };

  return (
    <div className="h-[10vh] min-h-17.5 border-b border-[#2f303b] flex items-center justify-between px-6 bg-[#1f2029]">
      
      {/* Left Side */}
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 relative">
           <Avatar className="h-11 w-11 rounded-full overflow-hidden shadow-md">
            {selectedChatData?.image ? (
              <AvatarImage
                src={selectedChatData.image}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            ) : (
              <div
                className={`uppercase h-full w-full text-sm border border-gray-500 flex items-center justify-center rounded-full ${getColor(
                  selectedChatData?.color
                )}`}
              >
                {selectedChatData?.firstName?.[0] ||
                  selectedChatData?.email?.[0] ||
                  "#"}
              </div>
            )}
          </Avatar>
        </div>

        <div className="flex flex-col">
          {selectedChatType === "contact" ? (
            <h3 className="font-medium text-sm text-white">
              {selectedChatData?.firstName || selectedChatData?.lastName
                ? `${selectedChatData?.firstName || ""} ${selectedChatData?.lastName || ""}`
                : selectedChatData?.email}
            </h3>
          ) : (
            <h3 className="font-medium text-sm text-white">
              {selectedChatData?.name}
            </h3>
          )}
        </div>
      </div>

      {/* Right Side */}
      <button
        onClick={handleChatclose}
        className="text-neutral-400 cursor-pointer hover:text-white transition-all duration-300 focus:outline-none"
      >
        <RiCloseFill className="text-3xl" />
      </button>
    </div>
  );
};

export default ChatHeader;
