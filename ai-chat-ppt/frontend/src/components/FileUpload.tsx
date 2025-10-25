import React, { useState, useRef } from 'react';
import { Upload, File, X } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onRemove: () => void;
  selectedFile: File | null;
  isLoading: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, onRemove, selectedFile, isLoading }) => {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return '📄';
      case 'doc':
      case 'docx':
        return '📝';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return '🖼️';
      case 'mp4':
      case 'avi':
      case 'mov':
        return '🎥';
      case 'mp3':
      case 'wav':
        return '🎵';
      default:
        return '📎';
    }
  };

  return (
    <div style={{ marginBottom: '1rem' }}>
      {!selectedFile ? (
        <div
          style={{
            border: '2px dashed #d1d5db',
            borderRadius: '8px',
            padding: '2rem',
            textAlign: 'center',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            background: dragActive ? '#eff6ff' : '#f9fafb',
            borderColor: dragActive ? '#3b82f6' : '#d1d5db',
            transform: dragActive ? 'scale(1.02)' : 'scale(1)',
            opacity: isLoading ? 0.6 : 1
          }}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={openFileDialog}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.mp4,.avi,.mov,.mp3,.wav"
            onChange={handleFileInput}
            style={{ display: 'none' }}
          />
          
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Upload style={{ width: '3rem', height: '3rem', color: '#6b7280' }} />
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#374151',
              margin: 0
            }}>Upload File</h3>
            <p style={{ color: '#6b7280', margin: 0 }}>Drag & drop your file here, or click to browse</p>
            <div style={{ marginTop: '0.5rem' }}>
              <span style={{
                fontSize: '0.875rem',
                color: '#9ca3af',
                background: '#f3f4f6',
                padding: '0.25rem 0.5rem',
                borderRadius: '4px'
              }}>Supported: PDF, Word, Images, Video, Audio</span>
            </div>
          </div>
        </div>
      ) : (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1rem',
          background: '#f0f9ff',
          border: '1px solid #0ea5e9',
          borderRadius: '8px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <span style={{ fontSize: '1.5rem' }}>{getFileIcon(selectedFile.name)}</span>
            <div>
              <h4 style={{
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#1f2937',
                margin: 0
              }}>{selectedFile.name}</h4>
              <p style={{
                fontSize: '0.75rem',
                color: '#6b7280',
                margin: 0
              }}>{formatFileSize(selectedFile.size)}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onRemove}
            disabled={isLoading}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '2rem',
              height: '2rem',
              background: '#fee2e2',
              border: '1px solid #fecaca',
              borderRadius: '4px',
              color: '#dc2626',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              opacity: isLoading ? 0.5 : 1
            }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
