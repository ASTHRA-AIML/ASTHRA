// ─── NewsletterForm ────────────────────────────────────────────────────────
// Create/Edit newsletter with cover image + PDF upload.

import { useState } from 'react';
import FileUploadField from '../ui/FileUploadField';
import { uploadMedia } from '../../api/upload';
import { Spinner } from '../ui/Spinner';
import * as Icon from '../ui/Icons';

const EMPTY = {
  title: '',
  newsletter_date: '',
  description: '',
  cover_image_url: '',
  pdf_url: '',
};

export default function NewsletterForm({ initial = null, onSubmit, isSubmitting }) {
  const [form, setForm] = useState(initial ? {
    title: initial.title || '',
    newsletter_date: initial.newsletter_date || '',
    description: initial.description || '',
    cover_image_url: initial.cover_image_url || '',
    pdf_url: initial.pdf_url || '',
  } : EMPTY);

  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState({ cover: false, pdf: false });
  const [pdfFileName, setPdfFileName] = useState('');

  const set = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required.';
    if (!form.newsletter_date) errs.newsletter_date = 'Date is required.';
    if (!form.cover_image_url) errs.cover_image_url = 'Cover image is required.';
    if (!form.pdf_url) errs.pdf_url = 'PDF is required.';
    if (!form.description.trim()) errs.description = 'Description is required.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleCoverUpload = async (file) => {
    setUploading((u) => ({ ...u, cover: true }));
    try {
      const url = await uploadMedia(file, 'asthra/newsletters/covers');
      set('cover_image_url', url);
    } catch (e) {
      setErrors((prev) => ({ ...prev, cover_image_url: `Upload failed: ${e.message}` }));
    } finally {
      setUploading((u) => ({ ...u, cover: false }));
    }
  };

  const handlePdfUpload = async (file) => {
    setUploading((u) => ({ ...u, pdf: true }));
    setPdfFileName(file.name);
    try {
      const url = await uploadMedia(file, 'asthra/newsletters/pdfs');
      set('pdf_url', url);
    } catch (e) {
      setErrors((prev) => ({ ...prev, pdf_url: `Upload failed: ${e.message}` }));
    } finally {
      setUploading((u) => ({ ...u, pdf: false }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(form);
  };

  return (
    <form id="newsletter-form" onSubmit={handleSubmit} noValidate>
      {/* Title */}
      <div className="form-group">
        <label className="form-label" htmlFor="nl-title">
          Title <span className="form-required">*</span>
        </label>
        <input
          id="nl-title"
          className={`form-input ${errors.title ? 'error' : ''}`}
          value={form.title}
          onChange={(e) => set('title', e.target.value)}
          placeholder="e.g. ASTHRA Bulletin — May 2025"
          maxLength={255}
        />
        {errors.title && <span className="form-error"><Icon.Warning size={12} /> {errors.title}</span>}
      </div>

      {/* Date */}
      <div className="form-group">
        <label className="form-label" htmlFor="nl-date">
          Newsletter Date <span className="form-required">*</span>
        </label>
        <input
          id="nl-date"
          type="date"
          className={`form-input ${errors.newsletter_date ? 'error' : ''}`}
          value={form.newsletter_date}
          onChange={(e) => set('newsletter_date', e.target.value)}
        />
        {errors.newsletter_date && <span className="form-error"><Icon.Warning size={12} /> {errors.newsletter_date}</span>}
      </div>

      {/* Cover image */}
      <FileUploadField
        id="nl-cover"
        label="Cover Image"
        accept="image/*"
        required
        currentUrl={form.cover_image_url}
        onChange={handleCoverUpload}
        hint="The thumbnail shown on the newsletters list"
      />
      {uploading.cover && (
        <div className="upload-progress"><Spinner /> Uploading cover image…</div>
      )}
      {errors.cover_image_url && <span className="form-error"><Icon.Warning size={12} /> {errors.cover_image_url}</span>}

      {/* PDF upload */}
      <FileUploadField
        id="nl-pdf"
        label="Newsletter PDF"
        accept=".pdf,application/pdf"
        required={!form.pdf_url}
        onChange={handlePdfUpload}
        hint="PDF file — will be hosted on Cloudinary"
      />
      {uploading.pdf && (
        <div className="upload-progress"><Spinner /> Uploading PDF…</div>
      )}
      {form.pdf_url && !uploading.pdf && (
        <div className="file-chosen" style={{ marginTop: 4 }}>
          <span className="file-chosen-icon"><Icon.Check size={14} /></span>
          {pdfFileName || 'PDF uploaded'}
          <a href={form.pdf_url} target="_blank" rel="noopener noreferrer" style={{ marginLeft: 8, fontSize: 12 }}>
            View ↗
          </a>
        </div>
      )}
      {errors.pdf_url && <span className="form-error"><Icon.Warning size={12} /> {errors.pdf_url}</span>}

      {/* Description */}
      <div className="form-group">
        <label className="form-label" htmlFor="nl-desc">
          Description <span className="form-required">*</span>
        </label>
        <textarea
          id="nl-desc"
          className={`form-textarea ${errors.description ? 'error' : ''}`}
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
          placeholder="Brief description of this newsletter edition…"
          rows={4}
        />
        {errors.description && <span className="form-error"><Icon.Warning size={12} /> {errors.description}</span>}
      </div>
    </form>
  );
}
