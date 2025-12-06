'use client';

import { useState, useRef } from 'react';
import { Upload, X, FileText, Image as ImageIcon, Loader2 } from 'lucide-react';

interface FileUploadProps {
  onUpload: (url: string) => void;
  currentUrl?: string;
  accept?: string;
  label?: string;
}

export function FileUpload({ onUpload, currentUrl, accept = 'image/*,application/pdf', label }: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(currentUrl || '');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Erreur lors de l upload');
        setUploading(false);
        return;
      }

      setPreview(data.url);
      onUpload(data.url);
    } catch (err) {
      setError('Erreur lors de l upload');
    }
    setUploading(false);
  };

  const handleRemove = () => {
    setPreview('');
    onUpload('');
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const isPdf = preview?.endsWith('.pdf');

  return (
    <div>
      {label && <label className="label">{label}</label>}
      
      {preview ? (
        <div className="relative inline-block">
          {isPdf ? (
            <div className="w-32 h-32 bg-primary-100 rounded-xl flex flex-col items-center justify-center">
              <FileText className="w-12 h-12 text-primary-500" />
              <span className="text-xs text-primary-600 mt-2">PDF</span>
            </div>
          ) : (
            <img
              src={preview}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-xl"
            />
          )}
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-neutral-300 rounded-xl p-6 text-center cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition-colors"
        >
          {uploading ? (
            <div className="flex flex-col items-center">
              <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
              <span className="text-sm text-neutral-500 mt-2">Upload en cours...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <Upload className="w-8 h-8 text-neutral-400" />
              <span className="text-sm text-neutral-500 mt-2">
                Cliquez pour telecharger
              </span>
              <span className="text-xs text-neutral-400 mt-1">
                JPG, PNG, WebP, GIF ou PDF (max 5MB)
              </span>
            </div>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />

      {error && (
        <p className="text-sm text-red-500 mt-2">{error}</p>
      )}
    </div>
  );
}

export default FileUpload;