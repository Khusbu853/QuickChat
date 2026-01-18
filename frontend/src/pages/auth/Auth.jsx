import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { apiClient } from "../../lib/api-client";
import { LOGIN_ROUTE, SIGNUP_ROUTE } from "../../utils/constants";
import { useNavigate } from "react-router-dom";
import { setUser } from "../../redux/authSlice";
import { useDispatch } from "react-redux";

const Auth = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("")

    const validateSignup = () => {
        if(!email.length) {
            toast.error("Email is required");
            return false
        }
        if(!password.length) {
            toast.error("password is required");
            return false
        }
        if(password !== confirmPassword) {
            toast.error("Password and confirm password should be same")
            return false
        }
        return true;
    }

    const validateLogin = () => {
        if(!email.length) {
            toast.error("Email is required");
            return false
        }
        if(!password.length) {
            toast.error("password is required");
            return false
        }
        return true;
    }

    const handleLogin = async () => {
      try {
          if(validateLogin()) {
              const response = await apiClient.post(LOGIN_ROUTE, {email, password}, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
              })
              if(response.data.user._id) {
                toast.success(response.data.message)
                dispatch(setUser(response?.data?.user))
                setTimeout(() => {
                  if(response.data.user.profileSetup) {
                    navigate('/chat');
                  } else {
                    navigate('/profile');
                  }
                }, 500);
              }
          }
      } catch (error) {
          console.log(error)
          toast.error(error.response.data.message)
      }
    }

    const handleSignup = async () => {
      try {
          if(validateSignup()) {
              const response = await apiClient.post(SIGNUP_ROUTE, {email, password}, 
                {
                  headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
              })
              if(response.data.success) {
                toast.success(response.data.message);
                dispatch(setUser(response?.data?.user))
                navigate('/profile');
              }
          }
      } catch (error) {
          console.log(error)
          toast.error(error.response.data.message)
      }
    }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-linear-to-br from-indigo-600 via-purple-600 to-pink-500 p-4">
      <div className="min-h-130 w-full max-w-5xl bg-white rounded-3xl shadow-2xl grid xl:grid-cols-2 overflow-hidden">
        <div className="hidden xl:flex flex-col items-center justify-center bg-linear-to-br from-indigo-600 to-purple-600 text-white p-10">
          <h1 className="text-4xl font-bold mb-4">QuickChat</h1>
          <p className="text-base text-center opacity-90 max-w-sm">
            Connect, chat and share moments instantly with your loved ones.
          </p>
        </div>

        {/* Right Auth Section */}
        <div className="flex flex-col px-5 sm:px-10 py-8 w-full">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-1">
              Welcome 👋
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Start chatting with your friends today
            </p>
          </div>

          <Tabs defaultValue="login" className="w-full max-w-md mx-auto">
            {/* Tabs */}
            <TabsList className="w-full bg-transparent mb-6 grid grid-cols-2 h-12">
              <TabsTrigger
                value="login"
                className="
                    w-full rounded-sm text-sm sm:text-base font-medium
                    data-[state=active]:border-b-2 
                    data-[state=active]:bg-indigo-600
                    data-[state=active]:text-white
                    border-2xl border-transparent
                    transition-all cursor-pointer
                "
              >
                Login
              </TabsTrigger>

              <TabsTrigger
                value="signup"
                className="
                    w-full rounded-sm text-sm sm:text-base font-medium
                    data-[state=active]:border-b-2 
                    data-[state=active]:bg-indigo-600
                    data-[state=active]:text-white
                    border-2xl border-transparent
                    transition-all cursor-pointer
                "
              >
                Signup
              </TabsTrigger>
            </TabsList>

            {/* Form Area */}
            <div className="min-h-65 sm:min-h-70">
              <TabsContent value="login">
                <div className="space-y-4">
                  <input
                    className="w-full p-3 sm:p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <input
                    type="password"
                    className="w-full p-3 sm:p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button className="w-full bg-purple-600 hover:bg-purple-700 text-white p-3 sm:p-4 rounded-xl font-semibold transition cursor-pointer"
                  onClick={handleLogin}
                  >
                    Login
                  </button>
                </div>
              </TabsContent>

              <TabsContent value="signup">
                <div className="space-y-4">
                  <input
                    className="w-full p-3 sm:p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <input
                    type="password"
                    className="w-full p-3 sm:p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <input
                    type="password"
                    className="w-full p-3 sm:p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button className="w-full bg-purple-600 hover:bg-purple-700 text-white p-3 sm:p-4 rounded-xl font-semibold transition cursor-pointer"
                  onClick={handleSignup}
                  >
                    Signup
                  </button>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Auth;
