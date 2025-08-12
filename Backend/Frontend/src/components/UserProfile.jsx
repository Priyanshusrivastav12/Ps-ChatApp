import React, { useState, useRef } from 'react';
import { IoClose, IoCamera, IoSave, IoPersonCircle } from 'react-icons/io5';
import { MdEdit, MdCheck, MdClose } from 'react-icons/md';
import { useAuth } from '../context/AuthProvider';

function UserProfile({ isOpen, onClose }) {
  const [authUser] = useAuth();
  const [isEditing, setIsEditing] = useState(false);
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
    try {
      // In a real implementation, you would make an API call to update the user profile
      console.log('Saving profile data:', profileData);
      
      // Update localStorage temporarily
      const updatedUser = {
        ...authUser,
        user: {
          ...authUser.user,
          ...profileData
        }
      };
      localStorage.setItem('ChatApp', JSON.stringify(updatedUser));
      
      setIsEditing(false);
      // You could show a success message here
    } catch (error) {
      console.error('Error saving profile:', error);
      // Show error message
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

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Profile Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <IoClose className="text-2xl" />
          </button>
        </div>

        {/* Avatar Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-700 border-4 border-gray-600">
              {(previewAvatar || profileData.avatar) ? (
                <img
                  src={previewAvatar || profileData.avatar}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <IoPersonCircle className="text-gray-400 text-6xl" />
                </div>
              )}
            </div>
            
            {isEditing && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <IoCamera className="text-white text-2xl" />
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
          
          <h3 className="text-white text-xl font-semibold mt-3">
            {profileData.fullname}
          </h3>
          <p className="text-gray-400 text-sm">{authUser?.user?.email}</p>
        </div>

        {/* Profile Fields */}
        <div className="space-y-6">
          {/* Full Name */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Display Name
            </label>
            {isEditing ? (
              <input
                type="text"
                value={profileData.fullname}
                onChange={(e) => setProfileData(prev => ({ ...prev, fullname: e.target.value }))}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                placeholder="Enter your display name"
              />
            ) : (
              <div className="px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white">
                {profileData.fullname}
              </div>
            )}
          </div>

          {/* Bio */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Bio
            </label>
            {isEditing ? (
              <textarea
                value={profileData.bio}
                onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 resize-none"
                rows="3"
                placeholder="Tell us about yourself..."
                maxLength="200"
              />
            ) : (
              <div className="px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white min-h-[80px]">
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
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Status
            </label>
            {isEditing ? (
              <div className="space-y-2">
                {statusOptions.map((option) => (
                  <label
                    key={option.value}
                    className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
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
                    <div className={`w-3 h-3 rounded-full ${option.color} mr-3`}></div>
                    <span className="text-white">{option.label}</span>
                  </label>
                ))}
              </div>
            ) : (
              <div className="flex items-center px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg">
                <div className={`w-3 h-3 rounded-full mr-3 ${
                  statusOptions.find(opt => opt.value === profileData.status)?.color
                }`}></div>
                <span className="text-white">
                  {statusOptions.find(opt => opt.value === profileData.status)?.label}
                </span>
              </div>
            )}
          </div>

          {/* Account Info */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Account Information
            </label>
            <div className="space-y-3">
              <div className="flex justify-between items-center px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg">
                <span className="text-gray-300">Email</span>
                <span className="text-white">{authUser?.user?.email}</span>
              </div>
              <div className="flex justify-between items-center px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg">
                <span className="text-gray-300">Member since</span>
                <span className="text-white">
                  {new Date(authUser?.user?.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 mt-8">
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                className="flex-1 px-4 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2"
              >
                <MdClose className="text-lg" />
                <span>Cancel</span>
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <MdCheck className="text-lg" />
                <span>Save Changes</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <MdEdit className="text-lg" />
              <span>Edit Profile</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
