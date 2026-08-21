// ─── MemberForm ───────────────────────────────────────────────────────────
// Create/Edit member. Photo upload optional.
// NOTE: Backend field is "acadamic_year" (typo preserved).

import { useState } from 'react';
import FileUploadField from '../ui/FileUploadField';
import { uploadMedia } from '../../api/upload';
import { Spinner } from '../ui/Spinner';
import * as Icon from '../ui/Icons';

const EMPTY = {
  name: '',
  photo_url: '',
  linkedin_url: '',
  position: '',
  acadamic_year: '',
};

export default function MemberForm({ initial = null, onSubmit, isSubmitting }) {
  const [form, setForm] = useState(initial ? {
    name: initial.name || '',
    photo_url: initial.photo_url || '',
    linkedin_url: initial.linkedin_url || '',
    position: initial.position || '',
    acadamic_year: initial.acadamic_year || '',
  } : EMPTY);

  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);

  const set = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required.';
    if (!form.position.trim()) errs.position = 'Position is required.';
    if (!form.acadamic_year.trim()) errs.acadamic_year = 'Academic year is required (e.g. 2025-26).';
    else if (!/^\d{4}-\d{2}$/.test(form.acadamic_year.trim())) {
      errs.acadamic_year = 'Format must be YYYY-YY (e.g. 2025-26).';
    }
    if (form.linkedin_url && !/^https?:\/\//.test(form.linkedin_url)) {
      errs.linkedin_url = 'Must be a valid URL starting with http(s)://';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePhotoUpload = async (file) => {
    setUploading(true);
    try {
      const url = await uploadMedia(file, 'asthra/members');
      set('photo_url', url);
    } catch (e) {
      setErrors((prev) => ({ ...prev, photo_url: `Upload failed: ${e.message}` }));
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(form);
  };

  return (
    <form id="member-form" onSubmit={handleSubmit} noValidate>
      {/* Name */}
      <div className="form-group">
        <label className="form-label" htmlFor="mem-name">
          Full Name <span className="form-required">*</span>
        </label>
        <input
          id="mem-name"
          className={`form-input ${errors.name ? 'error' : ''}`}
          value={form.name}
          onChange={(e) => set('name', e.target.value)}
          placeholder="e.g. Arjun Nair"
          maxLength={255}
        />
        {errors.name && <span className="form-error"><Icon.Warning size={12} /> {errors.name}</span>}
      </div>

      {/* Position + Academic Year — 2 cols */}
      <div className="form-row">
        <div className="form-group">
          <label className="form-label" htmlFor="mem-pos">
            Position <span className="form-required">*</span>
          </label>
          <input
            id="mem-pos"
            className={`form-input ${errors.position ? 'error' : ''}`}
            value={form.position}
            onChange={(e) => set('position', e.target.value)}
            placeholder="e.g. Treasurer"
            maxLength={100}
          />
          {errors.position && <span className="form-error"><Icon.Warning size={12} /> {errors.position}</span>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="mem-year">
            Academic Year <span className="form-required">*</span>
          </label>
          <input
            id="mem-year"
            className={`form-input ${errors.acadamic_year ? 'error' : ''}`}
            value={form.acadamic_year}
            onChange={(e) => set('acadamic_year', e.target.value)}
            placeholder="2025-26"
            maxLength={20}
          />
          {errors.acadamic_year && <span className="form-error"><Icon.Warning size={12} /> {errors.acadamic_year}</span>}
        </div>
      </div>

      {/* LinkedIn URL */}
      <div className="form-group">
        <label className="form-label" htmlFor="mem-linkedin">
          LinkedIn URL <span style={{ color: 'var(--color-text-muted)', fontWeight: 400 }}>(optional)</span>
        </label>
        <input
          id="mem-linkedin"
          type="url"
          className={`form-input ${errors.linkedin_url ? 'error' : ''}`}
          value={form.linkedin_url}
          onChange={(e) => set('linkedin_url', e.target.value)}
          placeholder="https://linkedin.com/in/arjunnair"
        />
        {errors.linkedin_url && <span className="form-error"><Icon.Warning size={12} /> {errors.linkedin_url}</span>}
      </div>

      {/* Photo upload */}
      <FileUploadField
        id="mem-photo"
        label="Profile Photo"
        accept="image/*"
        currentUrl={form.photo_url}
        onChange={handlePhotoUpload}
        hint="Square images work best (1:1 ratio)"
      />
      {uploading && (
        <div className="upload-progress"><Spinner /> Uploading photo…</div>
      )}
      {errors.photo_url && <span className="form-error"><Icon.Warning size={12} /> {errors.photo_url}</span>}
    </form>
  );
}
