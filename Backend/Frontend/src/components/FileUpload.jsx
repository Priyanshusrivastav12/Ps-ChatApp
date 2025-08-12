import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { IoAttach, IoImage, IoDocument, IoClose } from 'react-icons/io5';
import { MdVideoFile, MdAudioFile } from 'react-icons/md';

function FileUpload({ onFileSelect, onCancel, maxFileSize = 10 * 1024 * 1024 }) { // 10MB default
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [modalRoot, setModalRoot] = useState(null);
  const fileInputRef = useRef(null);

  // Create modal root element
  useEffect(() => {
    let modalElement = document.getElementById('modal-root');
    if (!modalElement) {
      modalElement = document.createElement('div');
      modalElement.id = 'modal-root';
      modalElement.style.position = 'fixed';
      modalElement.style.top = '0';
      modalElement.style.left = '0';
      modalElement.style.width = '100%';
      modalElement.style.height = '100%';
      modalElement.style.zIndex = '99999';
      modalElement.style.pointerEvents = 'none';
      document.body.appendChild(modalElement);
    }
    setModalRoot(modalElement);
    
    return () => {
      // Clean up on unmount
      const element = document.getElementById('modal-root');
      if (element && element.children.length === 0) {
        document.body.removeChild(element);
      }
    };
  }, []);

  const allowedTypes = {
    image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    video: ['video/mp4', 'video/webm', 'video/ogg'],
    audio: ['audio/mp3', 'audio/wav', 'audio/ogg', 'audio/m4a'],
    document: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']
  };

  const getFileType = (mimeType) => {
    for (const [type, mimes] of Object.entries(allowedTypes)) {
      if (mimes.includes(mimeType)) {
        return type;
      }
    }
    return 'document';
  };

  const getFileIcon = (type) => {
    switch (type) {
      case 'image':
        return <IoImage className="text-green-500 text-2xl" />;
      case 'video':
        return <MdVideoFile className="text-red-500 text-2xl" />;
      case 'audio':
        return <MdAudioFile className="text-purple-500 text-2xl" />;
      default:
        return <IoDocument className="text-blue-500 text-2xl" />;
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFile = (file) => {
    if (file.size > maxFileSize) {
      throw new Error(`File size must be less than ${formatFileSize(maxFileSize)}`);
    }

    const fileType = getFileType(file.type);
    if (!Object.values(allowedTypes).flat().includes(file.type)) {
      throw new Error('File type not supported');
    }

    return fileType;
  };

  const createPreview = (file, type) => {
    if (type === 'image') {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleFileSelect = (file) => {
    try {
      const fileType = validateFile(file);
      setSelectedFile(file);
      createPreview(file, fileType);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const simulateUpload = async () => {
    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setUploadProgress(i);
    }

    // In a real app, you would upload to your server here
    const fileData = {
      file: selectedFile,
      type: getFileType(selectedFile.type),
      name: selectedFile.name,
      size: selectedFile.size,
      preview: preview
    };

    onFileSelect(fileData);
    setIsUploading(false);
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setPreview(null);
    setUploadProgress(0);
    setIsUploading(false);
    onCancel();
  };

  const modalContent = (
    <div 
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(8px)',
        zIndex: 99999,
        pointerEvents: 'all'
      }}
      onClick={(e) => e.target === e.currentTarget && handleCancel()}
    >
      <div 
        className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md p-6 max-h-[80vh] overflow-y-auto animate-fadeInUp"
        style={{
          position: 'relative',
          zIndex: 100000
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">Share File</h3>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-gray-700"
          >
            <IoClose className="text-xl" />
          </button>
        </div>

        {!selectedFile ? (
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
              isDragOver
                ? 'border-blue-500 bg-blue-500/10'
                : 'border-gray-600 hover:border-gray-500'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <IoAttach className="text-4xl text-gray-400 mx-auto mb-4" />
            <p className="text-white mb-2">Drag and drop a file here</p>
            <p className="text-gray-400 text-sm mb-4">or</p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Choose File
            </button>
            <p className="text-gray-500 text-xs mt-4">
              Max size: {formatFileSize(maxFileSize)}
            </p>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileInputChange}
              className="hidden"
              accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
            />
          </div>
        ) : (
          <div className="space-y-4">
            {/* File Preview */}
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                {getFileIcon(getFileType(selectedFile.type))}
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">{selectedFile.name}</p>
                  <p className="text-gray-400 text-sm">{formatFileSize(selectedFile.size)}</p>
                  <p className="text-gray-500 text-xs">{selectedFile.type}</p>
                </div>
              </div>
              
              {/* Image Preview */}
              {preview && (
                <div className="mt-3">
                  <img
                    src={preview}
                    alt="Preview"
                    className="max-w-full h-32 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>

            {/* Upload Progress */}
            {isUploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Uploading...</span>
                  <span className="text-white">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={handleCancel}
                disabled={isUploading}
                className="flex-1 px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={simulateUpload}
                disabled={isUploading}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? 'Uploading...' : 'Send File'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Use portal to render at document body level
  return modalRoot ? createPortal(modalContent, modalRoot) : null;
}

export default FileUpload;
