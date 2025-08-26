import React, { useState, useRef, useEffect } from 'react';
import { IoClose, IoCamera, IoSave, IoPersonCircle } from 'react-icons/io5';
import { MdEdit, MdCheck, MdClose } from 'react-icons/md';
import { useAuth } from '../context/AuthProvider';
import useBodyScrollLock from '../hooks/useBodyScrollLock';
import axios from 'axios';
import { API_CONFIG } from '../config/api';
import toast from 'react-hot-toast';

function UserProfile({ isOpen, onClose }) {
  const [authUser, setAuthUser] = useAuth();
  useBodyScrollLock(isOpen);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profileData, setProfileData] = useState({
    fullname: authUser?.user?.fullname || '',
    bio: authUser?.user?.bio || 'Hey there! I am using ChatApp.',
    avatar: authUser?.user?.avatar || null,
    status: authUser?.user?.status || 'online'
  });
  const [previewAvatar, setPreviewAvatar] = useState(null);
  const fileInputRef = useRef(null);

  const statusOptions = [
    { value: 'online', label: 'Online', color: 'bg-green-500' },
    { value: 'away', label: 'Away', color: 'bg-yellow-500' },
    { value: 'busy', label: 'Busy', color: 'bg-red-500' },
    { value: 'offline', label: 'Invisible', color: 'bg-gray-500' }
  ];

  // Sync profileData with authUser changes
  useEffect(() => {
    if (authUser?.user && !isEditing) {
      setProfileData({
        fullname: authUser.user.fullname || '',
        bio: authUser.user.bio || 'Hey there! I am using ChatApp.',
        avatar: authUser.user.avatar || null,
        status: authUser.user.status || 'online'
      });
    }
  }, [authUser, isEditing]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewAvatar(e.target.result);
        setProfileData(prev => ({ ...prev, avatar: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (isSaving) return;
    
    setIsSaving(true);
    try {
      const response = await axios.put(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USER.UPDATE_PROFILE}`,
        profileData,
        {
          ...API_CONFIG.AXIOS_CONFIG,
          withCredentials: true,
        }
      );
      
      if (response.data && response.data.user) {
        // Update the auth context with the new user data
        const updatedAuthUser = {
          ...authUser,
          user: response.data.user
        };
        
        // Update localStorage
        localStorage.setItem('ChatApp', JSON.stringify(updatedAuthUser));
        
        // Update auth context
        setAuthUser(updatedAuthUser);
        
        setIsEditing(false);
        setPreviewAvatar(null);
        toast.success('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error(error.response?.data?.error || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setProfileData({
      fullname: authUser?.user?.fullname || '',
      bio: authUser?.user?.bio || 'Hey there! I am using ChatApp.',
      avatar: authUser?.user?.avatar || null,
      status: authUser?.user?.status || 'online'
    });
    setPreviewAvatar(null);
    setIsEditing(false);
  };

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-start justify-start p-2 sm:p-4 overflow-y-auto"
      onClick={handleBackdropClick}
      style={{ position: 'fixed' }}
    >
      <div 
        className="bg-gray-900 rounded-xl shadow-2xl w-full sm:w-80 md:w-96 ml-0 sm:ml-4 mt-2 sm:mt-4 p-3 sm:p-4 relative animate-in slide-in-from-left-2 duration-300 max-h-[calc(100vh-1rem)] sm:max-h-[calc(100vh-2rem)] overflow-y-auto max-w-sm mx-auto sm:mx-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h2 className="text-base sm:text-lg font-bold text-white">Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-gray-800 rounded-lg"
          >
            <IoClose className="text-lg sm:text-xl" />
          </button>
        </div>

        {/* Avatar Section */}
        <div className="flex flex-col items-center mb-4 sm:mb-6">
          <div className="relative group">
            <div className="w-20 sm:w-24 h-20 sm:h-24 rounded-full overflow-hidden bg-gray-700 border-3 border-gray-600 shadow-lg">
              {(previewAvatar || profileData.avatar) ? (
                <img
                  src={previewAvatar || profileData.avatar}
                  alt="Profile"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-700">
                  <IoPersonCircle className="text-gray-400 text-5xl sm:text-6xl" />
                </div>
              )}
            </div>
            
            {isEditing && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black/60"
              >
                <div className="bg-white rounded-full p-1.5 sm:p-2 shadow-lg">
                  <IoCamera className="text-gray-800 text-base sm:text-lg" />
                </div>
              </button>
            )}
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>
          
          <h3 className="text-white text-base sm:text-lg font-semibold mt-2">
            {profileData.fullname}
          </h3>
          <p className="text-gray-400 text-xs sm:text-sm">{authUser?.user?.email}</p>
        </div>

        {/* Profile Fields */}
        <div className="space-y-3 sm:space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-gray-300 text-xs sm:text-sm font-medium mb-1">
              Display Name
            </label>
            {isEditing ? (
              <input
                type="text"
                value={profileData.fullname}
                onChange={(e) => setProfileData(prev => ({ ...prev, fullname: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 text-xs sm:text-sm"
                placeholder="Enter your display name"
              />
            ) : (
              <div className="px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white text-xs sm:text-sm">
                {profileData.fullname}
              </div>
            )}
          </div>

          {/* Bio */}
          <div>
            <label className="block text-gray-300 text-xs sm:text-sm font-medium mb-1">
              Bio
            </label>
            {isEditing ? (
              <textarea
                value={profileData.bio}
                onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 resize-none text-xs sm:text-sm"
                rows="2"
                placeholder="Tell us about yourself..."
                maxLength="200"
              />
            ) : (
              <div className="px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white min-h-[50px] sm:min-h-[60px] text-xs sm:text-sm">
                {profileData.bio}
              </div>
            )}
            {isEditing && (
              <div className="text-right text-xs text-gray-400 mt-1">
                {profileData.bio.length}/200
              </div>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="block text-gray-300 text-xs sm:text-sm font-medium mb-1">
              Status
            </label>
            {isEditing ? (
              <div className="space-y-1.5 sm:space-y-2">
                {statusOptions.map((option) => (
                  <label
                    key={option.value}
                    className={`flex items-center p-2 rounded-lg cursor-pointer transition-colors ${
                      profileData.status === option.value
                        ? 'bg-blue-600/20 border border-blue-500/50'
                        : 'bg-gray-800/50 border border-gray-700 hover:bg-gray-700/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="status"
                      value={option.value}
                      checked={profileData.status === option.value}
                      onChange={(e) => setProfileData(prev => ({ ...prev, status: e.target.value }))}
                      className="sr-only"
                    />
                    <div className={`w-2 h-2 rounded-full ${option.color} mr-2`}></div>
                    <span className="text-white text-xs sm:text-sm">{option.label}</span>
                  </label>
                ))}
              </div>
            ) : (
              <div className="flex items-center px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg">
                <div className={`w-2 h-2 rounded-full mr-2 ${
                  statusOptions.find(opt => opt.value === profileData.status)?.color
                }`}></div>
                <span className="text-white text-xs sm:text-sm">
                  {statusOptions.find(opt => opt.value === profileData.status)?.label}
                </span>
              </div>
            )}
          </div>

          {/* Account Info */}
          <div>
            <label className="block text-gray-300 text-xs sm:text-sm font-medium mb-1">
              Account Information
            </label>
            <div className="space-y-1.5 sm:space-y-2">
              <div className="flex justify-between items-center px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg">
                <span className="text-gray-300 text-xs sm:text-sm">Email</span>
                <span className="text-white text-xs sm:text-sm truncate ml-2">{authUser?.user?.email}</span>
              </div>
              <div className="flex justify-between items-center px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg">
                <span className="text-gray-300 text-xs sm:text-sm">Member since</span>
                <span className="text-white text-xs sm:text-sm">
                  {new Date(authUser?.user?.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2 mt-4 sm:mt-6">
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                className="flex-1 px-3 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center space-x-1 text-xs sm:text-sm"
              >
                <MdClose className="text-base sm:text-lg" />
                <span>Cancel</span>
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors flex items-center justify-center space-x-1 text-xs sm:text-sm"
              >
                {isSaving ? (
                  <>
                    <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <MdCheck className="text-base sm:text-lg" />
                    <span>Save</span>
                  </>
                )}
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center space-x-1 text-xs sm:text-sm"
            >
              <MdEdit className="text-base sm:text-lg" />
              <span>Edit Profile</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
