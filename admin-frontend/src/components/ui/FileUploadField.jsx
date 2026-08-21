// ─── FileUploadField ───────────────────────────────────────────────────────
// Reusable file input with drag-over highlight and file name display.
// Calls onChange(file) when user selects a file.

import { useRef, useState } from 'react';
import * as Icon from './Icons';

export default function FileUploadField({
  id,
  label,
  accept = 'image/*',
  onChange,
  currentUrl = null,     // existing URL for edit mode
  required = false,
  hint,
}) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState('');

  const handleFile = (file) => {
    if (!file) return;
    setFileName(file.name);
    onChange(file);
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleInputChange = (e) => {
    handleFile(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const isImage = accept.includes('image');
  const displayUrl = preview || currentUrl;

  return (
    <div className="form-group">
      <label className="form-label" htmlFor={id}>
        {label}{required && <span className="form-required">*</span>}
      </label>

      {/* Image preview */}
      {isImage && displayUrl && (
        <div className="image-preview-wrapper" style={{ marginBottom: '8px' }}>
          <img
            src={displayUrl}
            alt="Preview"
            className="image-preview"
          />
        </div>
      )}

      {/* Drop zone */}
      <div
        className={`file-drop-zone ${dragOver ? 'drag-over' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        aria-label={`Upload ${label}`}
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          id={id}
          type="file"
          accept={accept}
          onChange={handleInputChange}
          style={{ display: 'none' }}
        />
        <div className="file-drop-icon" aria-hidden="true">
          {isImage ? <Icon.Image size={24} /> : <Icon.FileText size={24} />}
        </div>
        <div className="file-drop-text">
          {fileName ? 'Change file' : 'Click or drag & drop'}
        </div>
        <div className="file-drop-hint">
          {hint || (isImage ? 'PNG, JPG, WEBP supported' : 'PDF supported')}
        </div>
      </div>

      {/* Chosen file name */}
      {fileName && (
        <div className="file-chosen">
          <span className="file-chosen-icon" aria-hidden="true">
            <Icon.FileText size={14} />
          </span>
          {fileName}
        </div>
      )}
    </div>
  );
}
