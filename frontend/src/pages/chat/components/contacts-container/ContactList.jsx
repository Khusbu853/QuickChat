import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setSelectedCharMessages, setSelectedChatData, setSelectedChatType } from '../../../../redux/chatSlice';
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getColor } from '../../../../lib/utils';

const ContactList = ({ dmContacts = [], isChannel = false }) => {
  const dispatch = useDispatch();
  const { selectedChatData } = useSelector(store => store.chat);

  const handleContactclick = (contact) => {
    const prevChatId = selectedChatData?._id;

    dispatch(setSelectedChatType(isChannel ? "channel" : "contact"));
    dispatch(setSelectedChatData(contact));

    if (prevChatId && prevChatId !== contact?._id) {
      dispatch(setSelectedCharMessages([]));
    }
  };

  return (
    <div className="mt-5 flex flex-col gap-1 overflow-y-auto">
      {dmContacts.map(contact => (
        <div
          key={contact._id}
          onClick={() => handleContactclick(contact)}
          className={`
            flex items-center gap-3 px-4 py-3 cursor-pointer
            transition-colors
            ${selectedChatData?._id === contact._id
              ? "bg-gray-800"
              : "hover:bg-gray-700"}
          `}
        >
          <Avatar className="h-12 w-12 rounded-full overflow-hidden shadow-lg">
            {contact?.image ? (
              <AvatarImage src={contact.image} alt="Profile" />
            ) : (
              <div
                className={`uppercase h-full w-full text-6xl border border-gray-500 flex items-center justify-center rounded-full ${getColor(contact?.color)}`}
              >
                {contact?.firstName?.[0] || contact?.email?.[0] || "#"}
              </div>
            )}
          </Avatar>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">
              {isChannel
                ? contact?.name
                : contact?.firstName || contact?.lastName
                ? `${contact?.firstName ?? ""} ${contact?.lastName ?? ""}`
                : contact?.email}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};


export default ContactList
