import React from 'react'
import Lottie from 'react-lottie';
import { animationDefaultOptions } from '@/lib/utils';

const EmptyChatContainer = () => {
  return (
    <div className='flex-1 md:bg-[#1c1d25] md:flex flex-col justify-center items-center hidden duration-1000 transition-all'>
      <Lottie
        options={animationDefaultOptions}
        height={200}
        width={200}
        isClickToPauseDisabled={true}
      />
      <div className='text-opacity-80 text-white flex flex-col gap-5 items-center mt-10 lg:text-4xl text-3xl transition-all duration-300 text-center'>
        <h2>Welcome to QuickChat</h2>
        <p className='text-sm lg:text-base max-w-md'>
          Connect with friends and the world around you on QuickChat. Select a chat to start messaging.
        </p>
      </div>
    </div>
  )
}

export default EmptyChatContainer
