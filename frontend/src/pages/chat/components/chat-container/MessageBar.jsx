import React, {useEffect, useRef, useState} from 'react'
import { GrAttachment } from 'react-icons/gr';
import { IoSend } from 'react-icons/io5';
import { RiEmojiStickerLine } from 'react-icons/ri';
import EmojiPicker from 'emoji-picker-react';

const MessageBar = () => {
    const emojiRef = useRef();
    const [message, setMessage] = useState("");
    const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);

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
        // Logic to send the message
        console.log("Sending message:", message);
        setMessage("");
    }

  return (
    <div className='h-[10vh] bg-[#1c1d25] flex justify-center items-center px-8 mb-6 gap-4'>
      <div className='flex-1 flex bg-[#2a2b33] rounded-md items-center gap-5 pr-5'>
        <input
          type='text'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder='Type a message...'
          className='bg-transparent flex-1 outline-none text-white px-5 py-3 rounded-md'
        />
        <button className='text-neutral-500 cursor-pointer focus:border-none focus:outline-none focus:text-white duration-300 transition-all'>
            <GrAttachment className='text-2xl'/>
        </button>
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
      <button className='bg-purple-600 cursor-pointer hover:bg-purple-700 rounded-md flex items-center justify-center p-4 focus:border-none focus:outline-none focus:ring-2 focus:ring-purple-500 duration-300 transition-all'
      onClick={handleSendMessage}
      >
        <IoSend className='2xl'/>
      </button>
    </div>
    
  )
}

export default MessageBar
