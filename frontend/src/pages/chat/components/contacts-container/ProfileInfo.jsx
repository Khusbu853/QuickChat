import React from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { getColor } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { FiEdit2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { IoPowerSharp } from "react-icons/io5";
import { apiClient } from "@/lib/api-client";
import { LOGOUT_ROUTE } from "@/utils/constants";
import { toast } from "sonner";
import { setUser } from "../../../../redux/authSlice";

const ProfileInfo = () => {
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
        const response = await apiClient.post(LOGOUT_ROUTE, {}, {
            withCredentials: true
        }); 
        if(response.status === 200) {
            navigate('/auth');
            dispatch(setUser(null));
            toast.success(response.data.message);
        }
    } catch (error) {
        console.error("Logout failed:", error);
        toast.error(response?.data?.message || "Logout failed. Please try again.");
    }
  };

  return (
    <div className="absolute bottom-0 left-0 h-20 w-full flex items-center justify-between px-5 bg-[#2a2b33]">
      
      {/* Left Section */}
      <div className="flex items-center gap-3">
        <Avatar className="h-12 w-12 rounded-full overflow-hidden shadow-lg">
          {user?.image ? (
            <AvatarImage
              src={user.image}
              alt="Profile"
              className="h-full w-full object-cover"
            />
          ) : (
            <div
              className={`uppercase h-full w-full text-lg border border-gray-500 flex items-center justify-center rounded-full ${getColor(
                user?.color
              )}`}
            >
              {user?.firstName?.[0] || user?.email?.[0] || "U"}
            </div>
          )}
        </Avatar>

        <div className="flex flex-col leading-tight">
          <h3 className="font-medium text-sm">
            {user?.firstName} {user?.lastName}
          </h3>
          <p className="text-xs text-neutral-400">{user?.email}</p>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        <Tooltip>
          <TooltipTrigger asChild>
            <FiEdit2
              onClick={() => navigate("/profile")}
              className="cursor-pointer text-purple-500 text-xl hover:scale-110 transition"
            />
          </TooltipTrigger>
          <TooltipContent>Edit Profile</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <IoPowerSharp
              className="cursor-pointer text-red-500 text-xl hover:scale-110 transition"
                onClick={handleLogout}
            />
          </TooltipTrigger>
          <TooltipContent>Logout</TooltipContent>
        </Tooltip>
      </div>

    </div>
  );
};

export default ProfileInfo;

