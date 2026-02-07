import {createSlice} from "@reduxjs/toolkit"

const chatSlice = createSlice({
    name: "chat",
    initialState: {
        selectedChatType: undefined,
        selectedChatData: undefined,
        selectedCharMessages: [],
        directMessagesContacts: [],
        channels: [],
    },
    reducers : {
        setDirectMessagesContacts: (state, action) => {
            state.directMessagesContacts = action.payload
        },
        setSelectedChatType: (state, action) => {
            state.selectedChatType = action.payload
        },
        setSelectedChatData: (state, action) => {
            state.selectedChatData = action.payload
        },
        setSelectedCharMessages: (state, action) => {
            state.selectedCharMessages = action.payload
        },
        closeChat: (state) => {
            state.selectedChatType = undefined
            state.selectedChatData = undefined
            state.selectedCharMessages = []
        },
        addMessage: (state, action) => {
            const messageData = action.payload;
            const selectedChatType = state.selectedChatType;

            state.selectedCharMessages.push({
                ...messageData,
                receiver:
                selectedChatType === "contact"
                    ? messageData?.receiver?._id
                    : messageData.receiver,
                sender:
                selectedChatType === "contact"
                    ? messageData?.sender?._id
                    : messageData.sender,
            });
        },
        setChannels: (state, action) => {
            const incomingChannel = Array.isArray(action.payload)
                ? action.payload
                : [action.payload];

            const map = new Map();

            [...state.channels, ...incomingChannel].forEach(channel => {
                map.set(channel._id, channel);
            });

            state.channels = Array.from(map.values());
        },
        addChannel: (state, action) => {
            state.channels = [action.payload, ...state.channels];
        },
        addChannelInChannelList: (state, action) => {
            const channels = state.channels
            const data = channels.find((channel) => channel._id === action.payload.channelId);
            const index = channels.findIndex((channel) => channel._id === action.payload.channelId);

            if (index !== -1 && index !== undefined) {
                channels.splice(index, 1)
                channels.unshift(data)
            }
        },
        addDirectMessageInContactList: (state, action) => {
        const { message, userId } = action.payload;

        const fromId =
        message.sender._id === userId
            ? message.receiver._id
            : message.sender._id;

        const fromData =
        message.sender._id === userId
            ? message.receiver
            : message.sender;

        const dmContacts = state.directMessagesContacts;

        const index = dmContacts.findIndex(
        (contact) => contact._id === fromId
        );

        if (index !== -1) {
        dmContacts.splice(index, 1);
        }

        dmContacts.unshift(fromData);
    }

    }
    
})

export const {setSelectedChatType, setSelectedChatData, setSelectedCharMessages, closeChat, addMessage, setDirectMessagesContacts, setChannels, addChannel, addChannelInChannelList, addDirectMessageInContactList} = chatSlice.actions;

export default chatSlice.reducer;
