import React, {useState, useEffect} from "react";
import { Button } from "./components/ui/button";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Auth from "./pages/auth/Auth";
import Chat from "./pages/chat/Chat";
import Profile from "./pages/profile/Profile";
import { useDispatch, useSelector } from "react-redux";
import { apiClient } from "./lib/api-client";
import { GET_USER_INFO } from "./utils/constants";
import { setUser } from "./redux/authSlice";

const App = () => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  const PrivateRoute = ({ children }) => {
    if (!user) return <Navigate to="/auth" />;
    return children;
  };

  const AuthRoute = ({ children }) => {
    if (!user) return children;

    if (!user.profileSetup) {
      return <Navigate to="/profile" />;
    }

    return <Navigate to="/chat" />;
  };


  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await apiClient.get(GET_USER_INFO, {
          withCredentials: true,
        });

        if (response?.data?.user?._id) {
          dispatch(setUser(response.data.user));
        } else {
          dispatch(setUser(null));
        }
      } catch (error) {
        dispatch(setUser(null));
      } finally {
        setLoading(false);
      }
    };

    if(!user) {
      getUserData();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) return <div>Loading....</div>;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthRoute><Auth /></AuthRoute>} />
        <Route
          path="/chat"
          element={
            <PrivateRoute>
              {user?.profileSetup ? <Chat /> : <Navigate to="/profile" />}
            </PrivateRoute>
          }
        />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/auth" />} />
      </Routes>
    </BrowserRouter>
  );
};


export default App;
