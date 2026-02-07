import React, {useEffect} from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import EmptyChatContainer from './components/empty-chat-container/EmptyChatContainer';
import ContactsContainer from './components/contacts-container/ContactsContainer';
import ChatContainer from './components/chat-container/ChatContainer';

const Chat = () => {
  const {user} = useSelector(store => store.auth);
  const {selectedChatType} = useSelector(store => store.chat);
  const navigate = useNavigate();

  useEffect(() => {
    if(!user){
      toast("Please setup profile to continue")
      navigate("/profile");
    }
  }, [user, navigate])

  return (
    <div className='flex h-screen text-white overflow-hidden'>
      <ContactsContainer/>
      {selectedChatType === undefined ? (
        <EmptyChatContainer/>
      ) : (
        <ChatContainer/>
      )}
    </div>
  )
}

export default Chat
