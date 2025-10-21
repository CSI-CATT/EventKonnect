// client/services/eventService.js
import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || ''; // e.g., http://localhost:5000

export const fetchAdminEvents = async (token) => {
  const res = await axios.get(`${API_BASE}/api/events`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const deleteEvent = async (id, token) => {
  await axios.delete(`${API_BASE}/api/events/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const updateEvent = async (id, payload, token) => {
  const res = await axios.put(`${API_BASE}/api/events/${id}`, payload, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};
