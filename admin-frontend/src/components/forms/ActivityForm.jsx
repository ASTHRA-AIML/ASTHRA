// ─── ActivityForm ─────────────────────────────────────────────────────────
// Used for both create and edit (pre-filled via `initial` prop).
// Handles thumbnail + additional images upload via /asthra/admin/upload.

import { useState } from 'react';
import FileUploadField from '../ui/FileUploadField';
import { uploadMedia } from '../../api/upload';
import { Spinner } from '../ui/Spinner';
import * as Icon from '../ui/Icons';

const EMPTY = {
  title: '',
  activity_date: '',
  description: '',
  thumbnail_url: '',
  image_url: [],   // additional images
};

export default function ActivityForm({ initial = null, onSubmit, isSubmitting }) {
  const [form, setForm] = useState(initial ? {
    title: initial.title || '',
    activity_date: initial.activity_date || '',
    description: initial.description || '',
    thumbnail_url: initial.thumbnail_url || '',
    image_url: initial.image_url || [],
  } : EMPTY);

  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState({ thumbnail: false, extra: false });

  const set = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required.';
    if (!form.activity_date) errs.activity_date = 'Date is required.';
    if (!form.thumbnail_url) errs.thumbnail_url = 'Thumbnail is required.';
    if (!form.description.trim()) errs.description = 'Description is required.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleThumbnailUpload = async (file) => {
    setUploading((u) => ({ ...u, thumbnail: true }));
    try {
      const url = await uploadMedia(file, 'asthra/activities/thumbnails');
      set('thumbnail_url', url);
    } catch (e) {
      setErrors((prev) => ({ ...prev, thumbnail_url: `Upload failed: ${e.message}` }));
    } finally {
      setUploading((u) => ({ ...u, thumbnail: false }));
    }
  };

  const handleExtraImageUpload = async (file) => {
    setUploading((u) => ({ ...u, extra: true }));
    try {
      const url = await uploadMedia(file, 'asthra/activities/gallery');
      set('image_url', [...form.image_url, url]);
    } catch (e) {
      setErrors((prev) => ({ ...prev, extra: `Upload failed: ${e.message}` }));
    } finally {
      setUploading((u) => ({ ...u, extra: false }));
    }
  };

  const removeExtraImage = (idx) => {
    set('image_url', form.image_url.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(form);
  };

  return (
    <form id="activity-form" onSubmit={handleSubmit} noValidate>
      {/* Title */}
      <div className="form-group">
        <label className="form-label" htmlFor="act-title">
          Title <span className="form-required">*</span>
        </label>
        <input
          id="act-title"
          className={`form-input ${errors.title ? 'error' : ''}`}
          value={form.title}
          onChange={(e) => set('title', e.target.value)}
          placeholder="e.g. Annual Tech Fest 2025"
          maxLength={255}
        />
        {errors.title && <span className="form-error"><Icon.Warning size={12} /> {errors.title}</span>}
      </div>

      {/* Date */}
      <div className="form-group">
        <label className="form-label" htmlFor="act-date">
          Activity Date <span className="form-required">*</span>
        </label>
        <input
          id="act-date"
          type="date"
          className={`form-input ${errors.activity_date ? 'error' : ''}`}
          value={form.activity_date}
          onChange={(e) => set('activity_date', e.target.value)}
        />
        {errors.activity_date && <span className="form-error"><Icon.Warning size={12} /> {errors.activity_date}</span>}
      </div>

      {/* Thumbnail */}
      <FileUploadField
        id="act-thumbnail"
        label="Thumbnail Image"
        accept="image/*"
        required
        currentUrl={form.thumbnail_url}
        onChange={handleThumbnailUpload}
        hint="Recommended: 16:9 ratio, min 800×450px"
      />
      {uploading.thumbnail && (
        <div className="upload-progress"><Spinner /> Uploading thumbnail…</div>
      )}
      {errors.thumbnail_url && <span className="form-error"><Icon.Warning size={12} /> {errors.thumbnail_url}</span>}

      {/* Description */}
      <div className="form-group">
        <label className="form-label" htmlFor="act-desc">
          Description <span className="form-required">*</span>
        </label>
        <textarea
          id="act-desc"
          className={`form-textarea ${errors.description ? 'error' : ''}`}
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
          placeholder="Describe the activity…"
          rows={5}
        />
        {errors.description && <span className="form-error"><Icon.Warning size={12} /> {errors.description}</span>}
      </div>

      {/* Additional images */}
      <div className="form-group">
        <label className="form-label">Additional Images (optional)</label>
        {form.image_url.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 8, marginBottom: 8 }}>
            {form.image_url.map((url, i) => (
              <div key={i} className="image-preview-wrapper">
                <img src={url} alt={`Extra ${i + 1}`} className="image-preview" style={{ height: 80, objectFit: 'cover' }} />
                <button
                  type="button"
                  className="image-preview-remove"
                  onClick={() => removeExtraImage(i)}
                  aria-label={`Remove image ${i + 1}`}
                >✕</button>
              </div>
            ))}
          </div>
        )}
        <FileUploadField
          id="act-extra-img"
          label=""
          accept="image/*"
          onChange={handleExtraImageUpload}
          hint="Add one image at a time"
        />
        {uploading.extra && (
          <div className="upload-progress"><Spinner /> Uploading image…</div>
        )}
        {errors.extra && <span className="form-error"><Icon.Warning size={12} /> {errors.extra}</span>}
      </div>
    </form>
  );
}
