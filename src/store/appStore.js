import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useAuthStore } from './authStore'

const API_URL = import.meta.env.VITE_API_URL

export const useAppStore = create(
  persist(
    (set, get) => ({
      // State
      listings: [],
      requests: [],
      deals: [],
      notifications: [],
      leads: [],
      registrations: [],
      users: [],
      loading: false,
      error: null,

      // Fetchers
      fetchMyListings: async (page = 1, limit = 20) => {
        try {
          const token = useAuthStore.getState().token;
          if (!token) return;
          set({ loading: true, error: null });
          const url = page ? `${API_URL}/api/listings/my?page=${page}&limit=${limit}` : `${API_URL}/api/listings/my`;
          const res = await fetch(url, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (!res.ok) throw new Error('Failed to fetch listings');
          const data = await res.json();
          const list = Array.isArray(data) ? data : (data.data || data.listings || []);
          set({ listings: list, loading: false });
          return data;
        } catch (err) {
          set({ error: err.message, loading: false });
          return null;
        }
      },

      fetchMyRequests: async (page = 1, limit = 20) => {
        try {
          const token = useAuthStore.getState().token;
          if (!token) return;
          set({ loading: true, error: null });
          const url = page ? `${API_URL}/api/requests/my?page=${page}&limit=${limit}` : `${API_URL}/api/requests/my`;
          const res = await fetch(url, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (!res.ok) throw new Error('Failed to fetch requests');
          const data = await res.json();
          const list = Array.isArray(data) ? data : (data.data || data.requests || []);
          set({ requests: list, loading: false });
          return data;
        } catch (err) {
          set({ error: err.message, loading: false });
          return null;
        }
      },

      fetchMyDeals: async (page = 1, limit = 20) => {
        try {
          const token = useAuthStore.getState().token;
          if (!token) return;
          set({ loading: true, error: null });
          const url = page ? `${API_URL}/api/deals/my?page=${page}&limit=${limit}` : `${API_URL}/api/deals/my`;
          const res = await fetch(url, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (!res.ok) throw new Error('Failed to fetch deals');
          const data = await res.json();
          const list = Array.isArray(data) ? data : (data.data || data.deals || []);
          set({ deals: list, loading: false });
          return data;
        } catch (err) {
          set({ error: err.message, loading: false });
          return null;
        }
      },

      fetchNotifications: async (page = 1, limit = 50) => {
        try {
          const token = useAuthStore.getState().token;
          if (!token) return;
          set({ loading: true, error: null });
          const url = page ? `${API_URL}/api/notifications/my?page=${page}&limit=${limit}` : `${API_URL}/api/notifications/my`;
          const res = await fetch(url, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (!res.ok) throw new Error('Failed to fetch notifications');
          const data = await res.json();
          const list = Array.isArray(data) ? data : (data.data || data.notifications || []);
          set({ notifications: list, loading: false });
          return data;
        } catch (err) {
          set({ error: err.message, loading: false });
          return null;
        }
      },

      // Actions
      addListing: async (listingData) => {
        try {
          const token = useAuthStore.getState().token;
          const res = await fetch(`${API_URL}/api/listings`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(listingData)
          });
          if (!res.ok) throw new Error('Failed to add listing');
          const data = await res.json();
          get().fetchMyListings();
          return data.listing?.id;
        } catch (err) {
          console.error(err);
          return null;
        }
      },

      addRequest: async (requestData) => {
        try {
          const token = useAuthStore.getState().token;
          const res = await fetch(`${API_URL}/api/requests`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(requestData)
          });
          if (!res.ok) throw new Error('Failed to add request');
          const data = await res.json();
          get().fetchMyRequests();
          return data.request?.request_id;
        } catch (err) {
          console.error(err);
          return null;
        }
      },

      markRead: async (id) => {
        try {
          const token = useAuthStore.getState().token;
          await fetch(`${API_URL}/api/notifications/${id}/read`, {
            method: 'PUT',
            headers: { Authorization: `Bearer ${token}` }
          });
          get().fetchNotifications();
        } catch (err) {
          console.error(err);
        }
      },

      markAllRead: async () => {
        try {
          const token = useAuthStore.getState().token;
          await fetch(`${API_URL}/api/notifications/read-all`, {
            method: 'PUT',
            headers: { Authorization: `Bearer ${token}` }
          });
          get().fetchNotifications();
        } catch (err) {
          console.error(err);
        }
      },

      fetchPendingRegistrations: async (page = 1, limit = 20) => {
        try {
          const token = useAuthStore.getState().token;
          set({ loading: true });
          const url = page ? `${API_URL}/api/protected/admin/pending-users?page=${page}&limit=${limit}` : `${API_URL}/api/protected/admin/pending-users`;
          const res = await fetch(url, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const data = await res.json();
          const list = Array.isArray(data) ? data : (data.data || data.users || []);
          set({ registrations: list, loading: false });
          return data;
        } catch (err) {
          set({ error: err.message, loading: false });
          return null;
        }
      },

      approveUser: async (userId) => {
        try {
          const token = useAuthStore.getState().token;
          const res = await fetch(`${API_URL}/api/protected/admin/approve-user/${userId}`, {
            method: 'PUT',
            headers: { Authorization: `Bearer ${token}` }
          });
          if (!res.ok) throw new Error('Failed to approve user');
          get().fetchPendingRegistrations();
          return { success: true };
        } catch (err) {
          return { success: false, error: err.message };
        }
      },

      rejectUser: async (userId, reason) => {
        try {
          const token = useAuthStore.getState().token;
          const res = await fetch(`${API_URL}/api/protected/admin/reject-user/${userId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ reason })
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.message || 'Failed to reject user');
          get().fetchPendingRegistrations();
          return { success: true };
        } catch (err) {
          return { success: false, error: err.message };
        }
      },

      fetchAllUsers: async (page = 1, limit = 20) => {
        try {
          const token = useAuthStore.getState().token;
          set({ loading: true });
          const url = page ? `${API_URL}/api/protected/admin/users?page=${page}&limit=${limit}` : `${API_URL}/api/protected/admin/users`;
          const res = await fetch(url, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const data = await res.json();
          const list = Array.isArray(data) ? data : (data.data || data.users || []);
          set({ users: list, loading: false });
          return data;
        } catch (err) {
          set({ error: err.message, loading: false });
          return null;
        }
      },

      fetchAllRequests: async (page = 1, limit = 20) => {
        try {
          const token = useAuthStore.getState().token;
          set({ loading: true });
          const url = page ? `${API_URL}/api/requests/admin/all?page=${page}&limit=${limit}` : `${API_URL}/api/requests/admin/all`;
          const res = await fetch(url, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const data = await res.json();
          const list = Array.isArray(data) ? data : (data.data || data.requests || []);
          set({ requests: list, loading: false });
          return data;
        } catch (err) {
          set({ error: err.message, loading: false });
          return null;
        }
      },

      fetchAllDeals: async (page = 1, limit = 20) => {
        try {
          const token = useAuthStore.getState().token;
          set({ loading: true });
          const url = page ? `${API_URL}/api/deals/admin/all?page=${page}&limit=${limit}` : `${API_URL}/api/deals/admin/all`;
          const res = await fetch(url, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const data = await res.json();
          const list = Array.isArray(data) ? data : (data.data || data.deals || []);
          set({ deals: list, loading: false });
          return data;
        } catch (err) {
          set({ error: err.message, loading: false });
          return null;
        }
      },

      // Admin: fetch ALL listings (all statuses) for dashboard stats
      fetchAdminListings: async () => {
        try {
          const token = useAuthStore.getState().token;
          if (!token) return;
          const res = await fetch(`${API_URL}/api/listings/admin/all`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (!res.ok) return;
          const data = await res.json();
          const list = Array.isArray(data) ? data : (data.data || data.listings || []);
          set({ listings: list });
          return data;
        } catch (err) {
          console.error('fetchAdminListings error:', err.message);
          return null;
        }
      },

      fetchRevenueAnalytics: async () => {
        try {
          const res = await fetch(`${API_URL}/api/analytics/revenue`, {
            headers: { 'Authorization': `Bearer ${useAuthStore.getState().token}` }
          })
          const data = await res.json()
          return data
        } catch (error) {
          console.error('Fetch Revenue Error:', error)
          return { total_revenue: 0, deal_revenue: 0, membership_revenue: 0, breakdown: [] }
        }
      },

      fetchDealsAnalytics: async () => {
        try {
          const token = useAuthStore.getState().token;
          const res = await fetch(`${API_URL}/api/analytics/deals`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const data = await res.json();
          return data;
        } catch (err) {
          console.error(err);
          return null;
        }
      },

      fetchUsersAnalytics: async () => {
        try {
          const token = useAuthStore.getState().token;
          const res = await fetch(`${API_URL}/api/analytics/users`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const data = await res.json();
          return data.data || null;
        } catch (err) {
          console.error(err);
          return null;
        }
      },

      fetchInventoryAnalytics: async () => {
        try {
          const token = useAuthStore.getState().token;
          const res = await fetch(`${API_URL}/api/analytics/inventory`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const data = await res.json();
          return data.data || null;
        } catch (err) {
          console.error(err);
          return null;
        }
      },
    }),
    {
      name: 'warex-app',
    }
  )
)
