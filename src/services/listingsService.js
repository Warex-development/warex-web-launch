import { useAuthStore } from "../store/authStore";
const API = import.meta.env.VITE_API_URL;

const getToken = () => useAuthStore.getState().token;

const headers = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

// ─── BUYER ─────────────────────────────────────────────────────────────────────
// Phase 6: Buyer sees ONLY approved listings
export const getApprovedListings = async (page = 1, limit = 20) => {
  const url = page
    ? `${API}/api/listings?page=${page}&limit=${limit}`
    : `${API}/api/listings`;
  const res = await fetch(url, { headers: headers() });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to fetch listings");
  }
  return res.json();
};

// ─── SELLER ────────────────────────────────────────────────────────────────────
// Phase 6: Seller sees own listings (pending / approved / rejected)
export const getMyListings = async (page, limit = 20) => {
  const url = page
    ? `${API}/api/listings/my?page=${page}&limit=${limit}`
    : `${API}/api/listings/my`;
  const res = await fetch(url, { headers: headers() });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to fetch my listings");
  }
  return res.json();
};

// Phase 2: Manual listing — status always forced to 'pending' by backend
export const createListing = async (data) => {
  const res = await fetch(`${API}/api/listings`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(data),
  });
  const resData = await res.json();
  if (!res.ok) {
    const err = new Error(resData.message || "Failed to create listing");
    err.duplicate = resData.duplicate || false;
    err.existing_request_id = resData.existing_request_id || null;
    err.existing_status = resData.existing_status || null;
    throw err;
  }
  return resData;
};

export const updateListing = async (id, data) => {
  const res = await fetch(`${API}/api/listings/${id}`, {
    method: "PUT",
    headers: headers(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to update listing");
  }
  return res.json();
};

export const deleteListing = async (id) => {
  const res = await fetch(`${API}/api/listings/${id}`, {
    method: "DELETE",
    headers: headers(),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to delete listing");
  }
  return res.json();
};

// Phase 3: Bulk upload — sends Excel/CSV file; all rows get status='pending'
export const bulkUploadListings = async (file, onProgress) => {
  const formData = new FormData();
  formData.append("file", file);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${API}/api/listings/bulk-upload`);
    xhr.setRequestHeader("Authorization", `Bearer ${getToken()}`);

    if (onProgress) {
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          onProgress(Math.round((e.loaded / e.total) * 100));
        }
      };
    }

    xhr.onload = () => {
      const data = JSON.parse(xhr.responseText);
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(data);
      } else {
        reject(new Error(data.message || "Bulk upload failed"));
      }
    };

    xhr.onerror = () => reject(new Error("Network error during bulk upload"));
    xhr.send(formData);
  });
};

// ─── ADMIN ─────────────────────────────────────────────────────────────────────
// Phase 5: Admin approval flow

// GET /api/listings/admin/pending — pending queue
export const adminGetPendingListings = async () => {
  const res = await fetch(`${API}/api/listings/admin/pending`, {
    headers: headers(),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to fetch pending listings");
  }
  return res.json();
};

// GET /api/listings/admin/all?status=&page=&limit=
export const adminGetAllListings = async (status, page = 1, limit = 20) => {
  let url = `${API}/api/listings/admin/all`;
  const params = new URLSearchParams();
  if (status) params.append("status", status);
  if (page) params.append("page", page);
  if (limit) params.append("limit", limit);
  if (params.toString()) url += `?${params.toString()}`;

  const res = await fetch(url, { headers: headers() });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to fetch admin listings");
  }
  return res.json();
};

// PUT /api/listings/admin/approve/:id
export const adminApproveListing = async (id) => {
  const res = await fetch(`${API}/api/listings/admin/approve/${id}`, {
    method: "PUT",
    headers: headers(),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to approve listing");
  }
  return res.json();
};

// PUT /api/listings/admin/reject/:id — rejection_reason is REQUIRED
export const adminRejectListing = async (id, reason) => {
  if (!reason || !reason.trim()) {
    throw new Error("Rejection reason is required");
  }
  const res = await fetch(`${API}/api/listings/admin/reject/${id}`, {
    method: "PUT",
    headers: headers(),
    body: JSON.stringify({ reason }),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to reject listing");
  }
  return res.json();
};

// ─── SHARED ────────────────────────────────────────────────────────────────────
export const getCategories = async () => {
  const res = await fetch(`${API}/api/categories`);
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
};
