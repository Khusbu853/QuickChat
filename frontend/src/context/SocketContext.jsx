import { createContext, useRef, useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { HOST } from "../utils/constants";
import { io } from "socket.io-client";
import { addChannelInChannelList, addDirectMessageInContactList, addMessage } from "../redux/chatSlice";
import { handleIncomingDM } from "../redux/chatThunks";

const SocketContext = createContext(null);

export const useSocket = () => {
    return useContext(SocketContext);
}

export const SocketProvider = ({children}) => {
    const dispatch = useDispatch();
    const socket = useRef();
    const {user} = useSelector(store => store.auth);
    const {selectedChatData, selectedChatType} = useSelector(store => store.chat);

    useEffect(() => {
        if (!user) return;

        socket.current = io(HOST, {
            withCredentials: true,
            query: { userId: user._id },
        });

        socket.current.on("receiveMessage", (messageData) => {
            if (
            (selectedChatType !== undefined) &&
            (selectedChatData?._id === messageData?.sender?._id ||
                selectedChatData?._id === messageData?.receiver?._id)
            ) {
            dispatch(addMessage(messageData));
            }
            dispatch(handleIncomingDM(messageData))
        });

        socket.current.on("receiveChannelMessage", (messageData) => {
            if (
            (selectedChatType !== undefined) &&
            (selectedChatData?._id === messageData.channelId)
            ) {
            dispatch(addMessage(messageData));
            }
            dispatch(addChannelInChannelList(messageData))
        })

        return () => socket.current.disconnect();
    }, [user, selectedChatData, selectedChatType]);


    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
}