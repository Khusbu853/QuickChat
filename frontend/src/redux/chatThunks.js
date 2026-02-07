import { addDirectMessageInContactList } from "./chatSlice";

export const handleIncomingDM = (messageData) => (dispatch, getState) => {
  const userId = getState().auth.user?._id;

  if (!userId) return;

  dispatch(
    addDirectMessageInContactList({
      message: messageData,
      userId,
    })
  );
};
