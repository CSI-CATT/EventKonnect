// client/pages/admin/dashboard.js
import { useEffect, useState } from 'react';
import { fetchAdminEvents, deleteEvent } from '../../services/eventService'; // adjust path if needed
import Link from 'next/link';

export default function AdminDashboard() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('date');
  const [loading, setLoading] = useState(true);
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        const data = await fetchAdminEvents(token);
        setEvents(data);
      } catch (err) {
        console.error('Failed fetching events', err);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    if (token) loadEvents();
    else setLoading(false);
  }, [token]);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    try {
      await deleteEvent(id, token);
      setEvents(prev => prev.filter(e => e.id !== id));
    } catch (err) {
      console.error('Delete failed', err);
      alert('Failed to delete event');
    }
  };

  // apply search, filter, sort
  const filteredEvents = events
    .filter(e => e.name?.toLowerCase().includes(search.toLowerCase()))
    .filter(e => filter === 'all' ? true : (e.status || '').toLowerCase() === filter)
    .sort((a, b) => sort === 'name' ? (a.name || '').localeCompare(b.name || '') : new Date(a.date) - new Date(b.date));

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Events</h1>

      <div className="mb-4 flex flex-col sm:flex-row gap-2 sm:items-center">
        <input
          type="text"
          placeholder="Search by name or keyword"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border p-2 rounded flex-1"
        />

        <select value={filter} onChange={e => setFilter(e.target.value)} className="border p-2 rounded">
          <option value="all">All statuses</option>
          <option value="upcoming">Upcoming</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <select value={sort} onChange={e => setSort(e.target.value)} className="border p-2 rounded">
          <option value="date">Sort by Date</option>
          <option value="name">Sort by Name</option>
        </select>
      </div>

      {loading ? <p>Loading events...</p> : (
        <>
          {filteredEvents.length === 0 ? (
            <div className="p-6 border rounded">
              <p className="text-gray-600">No events created yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y">
                <thead>
                  <tr>
                    <th className="px-3 py-2 text-left">Name</th>
                    <th className="px-3 py-2 text-left">Date</th>
                    <th className="px-3 py-2 text-left">Time</th>
                    <th className="px-3 py-2 text-left">Location</th>
                    <th className="px-3 py-2 text-left">Status</th>
                    <th className="px-3 py-2 text-left">Attendees</th>
                    <th className="px-3 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEvents.map(event => (
                    <tr key={event.id} className="border-t">
                      <td className="px-3 py-2">{event.name}</td>
                      <td className="px-3 py-2">{event.date}</td>
                      <td className="px-3 py-2">{event.time || '-'}</td>
                      <td className="px-3 py-2">{event.location || '-'}</td>
                      <td className="px-3 py-2">{event.status || 'N/A'}</td>
                      <td className="px-3 py-2">{event.attendees?.length || 0}</td>
                      <td className="px-3 py-2 flex gap-2">
                        <Link href={`/admin/events/${event.id}/edit`}><a className="px-2 py-1 rounded bg-blue-600 text-white">Edit</a></Link>
                        <button onClick={() => handleDelete(event.id)} className="px-2 py-1 rounded bg-red-600 text-white">Delete</button>
                        <Link href={`/admin/events/${event.id}`}><a className="px-2 py-1 rounded bg-green-600 text-white">View</a></Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
