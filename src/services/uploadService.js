import { useAuthStore } from '../store/authStore';

const API = import.meta.env.VITE_API_URL;

function getToken() {
  return useAuthStore.getState().token;
}

/**
 * Upload an image for a listing
 * @param {File} file 
 * @param {string} listingId 
 * @returns {Promise<{url: string}>}
 */
export async function uploadListingImage(file, listingId) {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('listingId', listingId);

  const res = await fetch(`${API}/api/uploads/listing-image`, {
    method: 'POST',
    headers: { 
      Authorization: `Bearer ${getToken()}` 
    },
    body: formData
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to upload listing image');
  }

  return res.json();
}

/**
 * Upload VAT document
 * @param {File} file 
 * @returns {Promise<{path: string}>}
 */
export async function uploadVatDocument(file) {
  const formData = new FormData();
  formData.append('document', file);

  const res = await fetch(`${API}/api/uploads/vat-document`, {
    method: 'POST',
    headers: { 
      Authorization: `Bearer ${getToken()}` 
    },
    body: formData
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to upload VAT document');
  }

  return res.json();
}

/**
 * Upload user avatar
 * @param {File} file 
 * @returns {Promise<{url: string}>}
 */
export async function uploadAvatar(file) {
  const formData = new FormData();
  formData.append('avatar', file);

  const res = await fetch(`${API}/api/uploads/avatar`, {
    method: 'POST',
    headers: { 
      Authorization: `Bearer ${getToken()}` 
    },
    body: formData
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to upload avatar');
  }

  return res.json();
}
