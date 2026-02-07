import React, { useEffect } from 'react'
import ProfileInfo from './ProfileInfo'
import NewDm from './newDm'
import { apiClient } from '../../../../lib/api-client'
import { GET_DM_CONTACTS_ROUTE, GET_USER_CHANNELS_ROUTE } from '../../../../utils/constants'
import { useDispatch, useSelector } from 'react-redux'
import { setChannels, setDirectMessagesContacts } from '../../../../redux/chatSlice'
import ContactList from './ContactList'
import CreateChannel from './CreateChannel'

const ContactsContainer = () => {
  const {directMessagesContacts, channels} = useSelector(store => store.chat)
  const dispatch = useDispatch();

  useEffect(() => {
    const getDmContacts = async () => {
      const response = await apiClient.get(GET_DM_CONTACTS_ROUTE, {
        withCredentials: true,
      })
      if (response?.data?.dmContacts){
        dispatch(setDirectMessagesContacts(response.data.dmContacts));
      }
    }

    const getChannels = async () => {
      const response = await apiClient.get(GET_USER_CHANNELS_ROUTE, {
        withCredentials: true,
      })
      if (response?.data?.channels){
        dispatch(setChannels(response.data.channels));
      }
    }

    getDmContacts();
    getChannels();
  }, [setChannels, setDirectMessagesContacts])

  return (
    <div className='relative md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-[#1b1c24] border-r-2 border-[#2f303b] w-full'>
      <div className='pt-3'>
        <div className='flex p-5 justify-start items-center gap-2'>
          <span className='text-3xl font-semibold'>QuickChat</span>
        </div>
      </div>
      <div className='my-5'>
        <div className='flex items-center justify-between pr-10'>
          <Title text="Direct Messages" />
          <NewDm/>
        </div>
        <div className='max-h-[38vh] overflow-y-auto scrollbar-hidden'>
           <ContactList dmContacts={directMessagesContacts}/>
        </div>
      </div>
      <div className='my-5'>
        <div className='flex items-center justify-between pr-10'>
          <Title text="Channels" />
          <CreateChannel/>
        </div>
        <div className='max-h-[38vh] overflow-y-auto scrollbar-hidden'>
           <ContactList dmContacts={channels} isChannel={true}/>
        </div>
      </div>
      <ProfileInfo/>
    </div>
  )
}

export default ContactsContainer

const Title = ({text}) => {
  return (
    <h2 className='uppercase tracking-widest text-neutral-400 pl-5 font-light text-opacity-90 text-sm'>{text}</h2>
  )
}
