import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { FaPlus, FaTrash } from "react-icons/fa";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getColor, colors } from "../../lib/utils";
import { toast } from "sonner";
import { apiClient } from "../../lib/api-client";
import { ADD_PROFILE_IMAGE, DELETE_PROFILE_IMAGE, UPDATE_USER_INFO } from "../../utils/constants";
import { setUser } from "../../redux/authSlice";

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [image, setImage] = useState(null);
  const [hovered, setHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0);

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setSelectedColor(user.color || 0);
      setImage(user.image || null);
    }
  }, [user]);

  const validateProfile = () => {
    if (!firstName) {
      toast.error("First name is required");
      return false;
    }
    if (!lastName) {
      toast.error("Last name is required");
      return false;
    }
    return true;
  };

  const saveChanges = async () => {
    if (!validateProfile()) return;

    try {
      const response = await apiClient.post(
        UPDATE_USER_INFO,
        { firstName, lastName, color: selectedColor },
        { withCredentials: true }
      );

      if (response.status === 200 && response.data) {
        dispatch(setUser(response.data.user));
        toast.success(response.data.message);
        navigate("/chat");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Update failed");
    }
  };

  const handleNavigateBack = () => {
    if (user?.profileSetup) navigate("/chat");
    else toast.error("Please complete profile setup to continue");
  };

  const handlefileInputClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await apiClient.post(
        ADD_PROFILE_IMAGE,
        formData,
        { withCredentials: true }
      );

      if (response.status === 200 && response.data.image) {
        setImage(response.data.image);
        dispatch(setUser({ ...user, image: response.data.image }));
        toast.success("Profile image updated");
      }
    } catch {
      toast.error("Image upload failed");
    }
  };

  const handleDeleteImage = async () => {
    try {
      const response = await apiClient.post(
        DELETE_PROFILE_IMAGE,
        {},
        { withCredentials: true }
      );
      if (response.status === 200) {
        setImage(null);
        dispatch(setUser({ ...user, image: null }));
        toast.success("Profile image removed");
      }
    } catch {
      toast.error("Failed to remove image");
    }
  };

  return (
    <div className="min-h-screen bg-[#1b1b24] flex items-center justify-center px-4">
      <div className="bg-[#222231] rounded-2xl shadow-xl p-6 md:p-10 w-full max-w-3xl">

        {/* Back Button */}
        <div className="mb-6">
          <IoArrowBack
            className="text-white text-3xl cursor-pointer hover:scale-110 transition"
            onClick={handleNavigateBack}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-10 items-center">

          {/* Avatar Section */}
          <div
            className="flex justify-center"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <div className="relative">

              <Avatar className="h-36 w-36 md:h-48 md:w-48 rounded-full overflow-hidden shadow-lg">
                {image ? (
                  <AvatarImage
                    src={image}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div
                    className={`uppercase h-full w-full text-6xl border border-gray-500 flex items-center justify-center rounded-full ${getColor(selectedColor)}`}
                  >
                    {firstName?.[0] || user?.email?.[0] || "U"}
                  </div>
                )}
              </Avatar>

              {hovered && (
                <div
                  className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full cursor-pointer"
                  onClick={image ? handleDeleteImage : handlefileInputClick}
                >
                  {image ? (
                    <FaTrash className="text-3xl text-white hover:text-red-400" />
                  ) : (
                    <FaPlus className="text-3xl text-white hover:text-green-400" />
                  )}
                </div>
              )}

              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".png,.jpg,.jpeg,.svg,.webp"
                onChange={handleImageChange}
              />
            </div>
          </div>

          {/* Form Section */}
          <div className="flex flex-col gap-5 text-white">
            <input
              value={user?.email || ""}
              readOnly
              className="rounded-lg p-4 bg-[#2c2e3b] text-gray-400"
            />

            <input
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="rounded-lg p-4 bg-[#2c2e3b] focus:ring-2 focus:ring-purple-500"
            />

            <input
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="rounded-lg p-4 bg-[#2c2e3b] focus:ring-2 focus:ring-purple-500"
            />

            <div className="flex gap-4 mt-2">
              {colors.map((color, index) => (
                <div
                  key={index}
                  className={`h-8 w-8 rounded-full ${color} cursor-pointer transition hover:scale-110 ${
                    selectedColor === index ? "ring-4 ring-white" : ""
                  }`}
                  onClick={() => setSelectedColor(index)}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10">
          <button
            onClick={saveChanges}
            className="w-full bg-purple-600 cursor-pointer hover:bg-purple-700 py-3 rounded-xl font-semibold transition hover:scale-[1.02]"
          >
            Save Changes
          </button>
        </div>

      </div>
    </div>
  );
};

export default Profile;
