import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { apiClient } from "../../../../lib/api-client";
import { GET_MESSAGES_ROUTE, GET_USER_CHANNELS_MESSAGES_ROUTE } from "../../../../utils/constants";
import { setSelectedCharMessages } from "../../../../redux/chatSlice";
import { FaFolderOpen, FaDownload } from "react-icons/fa";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";

const MessageContainer = () => {
  const scrollRef = useRef(null);
  const dispatch = useDispatch();

  const { user } = useSelector((store) => store.auth);
  const {
    selectedCharMessages,
    selectedChatType,
    selectedChatData,
  } = useSelector((store) => store.chat);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const response = await apiClient.post(
          GET_MESSAGES_ROUTE,
          { receiverId: selectedChatData?._id },
          { withCredentials: true }
        );

        if (response.data.messageData) {
          dispatch(setSelectedCharMessages(response.data.messageData));
        }
      } catch (error) {
        console.log("Error fetching messages", error);
      }
    };

    const getChannelMessages = async () => {
      try {
        const response = await apiClient.get(
          `${GET_USER_CHANNELS_MESSAGES_ROUTE}/${selectedChatData._id}`,
          { withCredentials: true }
        );

        if (response.data.messageData) {
          dispatch(setSelectedCharMessages(response.data.messageData));
        }
      } catch (error) {
        console.log("Error fetching messages", error);
      }
    };

    if (selectedChatData?._id ) {
      if (selectedChatType === "contact"){
        getMessages();
      } else if(selectedChatType === "channel") {
        getChannelMessages();
      }
    }
  }, [selectedChatData, selectedChatType, dispatch]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedCharMessages]);

  const handleDownload = async (fileUrl) => {
    try {
      const response = await fetch(fileUrl, {
        withCredentials: true
      });

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = fileUrl.split("/").pop();

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed", error);
    }
  };

  const renderDmMessages = (message) => {
    const isOwnMessage = message.sender === user?._id;

    const isFile = message.messageType === "file";
    const fileUrl = message.fileUrl;

    const isImage =
      isFile && /\.(jpg|jpeg|png|webp|gif)$/i.test(fileUrl);

    return (
      <div
        className={`flex ${
          isOwnMessage ? "justify-end" : "justify-start"
        } mb-3`}
      >
        <div
          className={`
            max-w-[70%] px-4 py-3 text-sm leading-relaxed
            rounded-2xl shadow-sm
            ${
              isOwnMessage
                ? "bg-linear-to-br from-[#7c3aed] to-[#5625e6] text-white rounded-br-sm"
                : "bg-[#161617] text-white border border-gray-700 rounded-bl-sm"
            }
          `}
        >
          {message.messageType === "text" && (
            <p className="wrap-break-word">{message.content}</p>
          )}

          {isFile && (
            <>
              {isImage ? (
                <img
                  src={fileUrl}
                  alt="uploaded"
                  className="rounded-md max-h-64 object-cover cursor-pointer"
                  onClick={() => window.open(fileUrl, "_blank")}
                />
              ) : (
                <div
                  onClick={() => handleDownload(fileUrl)}
                  className={`
                    flex items-center gap-3 p-3 rounded-lg border cursor-pointer
                    ${
                      isOwnMessage
                        ? "border-white/30"
                        : "border-gray-600"
                    }
                    hover:bg-white/10 transition
                  `}
                >
                  <FaFolderOpen className="text-xl text-blue-400 shrink-0" />

                  <span className="text-sm font-medium truncate flex-1">
                    {fileUrl?.split("/").pop()}
                  </span>

                  <FaDownload className="text-lg text-gray-300 hover:text-white shrink-0" />
                </div>
              )}
            </>
          )}

          <div
            className={`text-[11px] mt-1 flex justify-end ${
              isOwnMessage ? "text-white/70" : "text-gray-400"
            }`}
          >
            {moment(message.createdAt).format("hh:mm A")}
          </div>
        </div>
      </div>
    );
  };

  const renderChannelMessages = (message) => {
    const sender = message.sender;
    const isOwnMessage = sender._id === user?._id;

    const senderName =
      sender?.firstName || sender?.lastName
        ? `${sender?.firstName || ""} ${sender?.lastName || ""}`.trim()
        : sender?.email || "Unknown user";

    const isFile = message.messageType === "file";
    const fileUrl = message.fileUrl;
    const isImage =
      isFile && /\.(jpg|jpeg|png|webp|gif)$/i.test(fileUrl);

    return (
      <div
        className={`flex items-end gap-2 mb-3 ${
          isOwnMessage ? "justify-end" : "justify-start"
        }`}
      >

        {!isOwnMessage && (
          <div className="w-8 h-8 relative">
            <Avatar className="h-8 w-8 rounded-full overflow-hidden shadow-md">
              {sender?.image ? (
                <AvatarImage
                  src={sender.image}
                  alt={senderName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div
                  className={`uppercase h-full w-full text-xs border border-gray-500 flex items-center justify-center rounded-full ${getColor(
                    sender?.color
                  )}`}
                >
                  {sender?.firstName?.[0] ||
                    sender?.email?.[0] ||
                    "#"}
                </div>
              )}
            </Avatar>
          </div>
        )}

        {/* Message bubble */}
        <div
          className={`
            max-w-[70%] px-4 py-3 text-sm leading-relaxed
            rounded-2xl shadow-sm
            ${
              isOwnMessage
                ? "bg-linear-to-br from-[#7c3aed] to-[#5625e6] text-white rounded-br-sm"
                : "bg-[#161617] text-white border border-gray-700 rounded-bl-sm"
            }
          `}
        >
          {/* Sender name */}
          {!isOwnMessage && (
            <div className="text-xs font-semibold text-purple-400 mb-1">
              {senderName}
            </div>
          )}

          {message.messageType === "text" && (
            <p className="wrap-break-word">{message.content}</p>
          )}

          {isFile && (
            <>
              {isImage ? (
                <img
                  src={fileUrl}
                  alt="uploaded"
                  className="rounded-md max-h-64 object-cover cursor-pointer"
                  onClick={() => window.open(fileUrl, "_blank")}
                />
              ) : (
                <div
                  onClick={() => handleDownload(fileUrl)}
                  className="flex items-center gap-3 p-3 rounded-lg border border-gray-600 cursor-pointer hover:bg-white/10 transition"
                >
                  <FaFolderOpen className="text-xl text-blue-400 shrink-0" />
                  <span className="text-sm font-medium truncate flex-1">
                    {fileUrl?.split("/").pop()}
                  </span>
                  <FaDownload className="text-lg text-gray-300 hover:text-white shrink-0" />
                </div>
              )}
            </>
          )}

          <div className="text-[11px] mt-1 flex justify-end text-gray-400">
            {moment(message.createdAt).format("hh:mm A")}
          </div>
        </div>
      </div>
    );
  };


  const renderMessages = () => {
    let lastDate = null;

    return selectedCharMessages.map((message) => {
      const messageDate = moment(message.createdAt).format("YYYY-MM-DD");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;

      return (
        <div key={message._id}>
          {showDate && (
            <div className="flex justify-center my-6">
              <span className="px-4 py-1 text-xs rounded-full bg-gray-200 text-gray-600">
                {moment(message.createdAt).format("LL")}
              </span>
            </div>
          )}

          {selectedChatType === "contact" &&
            renderDmMessages(message)}
          {selectedChatType === "channel" &&
            renderChannelMessages(message)}
        </div>
      );
    });
  };

  /* ===================== RENDER ===================== */
  return (
    <div className="flex-1 overflow-y-auto p-4 px-6 md:px-10">
      {renderMessages()}
      <div ref={scrollRef} />
    </div>
  );
};

export default MessageContainer;

