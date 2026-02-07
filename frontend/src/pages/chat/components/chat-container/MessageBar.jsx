import React, {useEffect, useRef, useState} from 'react'
import { GrAttachment } from 'react-icons/gr';
import { IoSend } from 'react-icons/io5';
import { RiEmojiStickerLine } from 'react-icons/ri';
import EmojiPicker from 'emoji-picker-react';
import { useSelector } from 'react-redux';
import { useSocket } from '../../../../context/SocketContext';
import { apiClient } from '../../../../lib/api-client';
import { UPLOAD_FILE } from '../../../../utils/constants';

const MessageBar = () => {
    const {selectedChatType, selectedChatData} = useSelector(store => store.chat);
    const {user} = useSelector(store => store.auth);
    const socket = useSocket()
    const emojiRef = useRef();
    const fileInputRef = useRef();
    const [message, setMessage] = useState("");
    const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
    const isMessageEmpty = !message.trim();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (emojiRef.current && !emojiRef.current.contains(event.target)) {
                setEmojiPickerOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [emojiRef]);

    const handleEmojiSelect = (emoji) => {
        setMessage((prev) => prev + emoji.emoji);
    }

    const handleSendMessage = () => {
        if (selectedChatType === "contact") {
            socket.current.emit("sendMessage", {
                sender: user._id,
                receiver: selectedChatData._id,
                content: message,
                messageType: "text",
                fileUrl: undefined
            });
        } else if (selectedChatType === "channel") {
            socket.current.emit("sendChannelMessage", {
                sender: user._id,
                content: message,
                messageType: "text",
                fileUrl: undefined,
                channelId: selectedChatData?._id,
            })
        }
        setMessage("");
    }

    const handleAttachmentClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    }

    const handleAttachmentChange = async (event) => {
        try {
            const file = event.target.files[0]
            if(file) {
                const formData = new FormData();
                formData.append("file", file)
                const response = await apiClient.post(UPLOAD_FILE, formData, {
                    withCredentials: true
                })

                if (response.status === 200 && response.data){
                    if (selectedChatType === "contact") {
                        socket.current.emit("sendMessage", {
                            sender: user._id,
                            receiver: selectedChatData._id,
                            content: undefined,
                            messageType: "file",
                            fileUrl: response.data.filePath
                        });
                    } else if (selectedChatType === "channel") {
                        socket.current.emit("sendChannelMessage", {
                            sender: user._id,
                            content: undefined,
                            messageType: "file",
                            fileUrl: response.data.filePath,
                            channelId: selectedChatData?._id,
                        })
                    }
                   setMessage("");
                }
            }
        } catch (error) {
            console.log({error})
        }
    }

  return (
    <div className='h-[10vh] bg-[#1c1d25] flex justify-center items-center px-8 mb-4 gap-4'>
      <div className='flex-1 flex bg-[#2a2b33] rounded-md items-center gap-5 pr-5'>
        <input
          type='text'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder='Type a message...'
          className='bg-transparent flex-1 outline-none text-white px-5 py-3 rounded-md'
        />
        <button className='text-neutral-500 cursor-pointer focus:border-none focus:outline-none focus:text-white duration-300 transition-all'
        onClick={handleAttachmentClick}
        >
            <GrAttachment className='text-2xl'/>
        </button>
        <input type="file"
        className='hidden'
        ref={fileInputRef}
        onChange={handleAttachmentChange}
         />
        <div className='relative'>
            <button className='text-neutral-500 focus:border-none cursor-pointer focus:outline-none focus:text-white duration-300 transition-all'
            onClick={() => setEmojiPickerOpen(!emojiPickerOpen)}
            >
                <RiEmojiStickerLine className='text-2xl'/>
            </button>
            <div className='absolute bottom-16 right-0' ref={emojiRef}>
                <EmojiPicker
                    theme='dark'
                    open={emojiPickerOpen}
                    onEmojiClick={handleEmojiSelect}
                    autoFocusSearch={false}
                />
            </div>
        </div>
      </div>
      <button
        disabled={isMessageEmpty}
        onClick={handleSendMessage}
        className={`
            rounded-md flex items-center justify-center p-4
            focus:outline-none duration-300 transition-all
            ${
            isMessageEmpty
                ? "bg-purple-600/40 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700 cursor-pointer focus:ring-2 focus:ring-purple-500"
            }
        `}
        >
        <IoSend className="text-2xl" />
     </button>
    </div>
    
  )
}

export default MessageBar
