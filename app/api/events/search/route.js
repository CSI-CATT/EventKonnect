import { NextResponse } from 'next/server';
import { database, ref, get, query, orderByChild, equalTo, startAt, endAt } from '@/lib/firebase';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get('q');
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit')) || 50;

    if (!searchQuery || searchQuery.trim().length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'Search query is required' 
      }, { status: 400 });
    }

    const eventsRef = ref(database, 'events');
    const snapshot = await get(eventsRef);

    if (!snapshot.exists()) {
      return NextResponse.json({
        success: true,
        data: [],
        total: 0,
        query: searchQuery
      });
    }

    const allEvents = snapshot.val();
    const searchTerm = searchQuery.toLowerCase().trim();
    
    // Filter events based on search criteria
    let filteredEvents = Object.entries(allEvents)
      .map(([id, event]) => ({ id, ...event }))
      .filter(event => {
        const title = (event.title || '').toLowerCase();
        const description = (event.description || '').toLowerCase();
        const category = (event.category || '').toLowerCase();
        const venue = (event.venue || '').toLowerCase();
        const city = (event.city || '').toLowerCase();
        const eventType = (event.eventType || '').toLowerCase();
        const organizerName = (event.organizerName || '').toLowerCase();
        
        return (
          title.includes(searchTerm) ||
          description.includes(searchTerm) ||
          category.includes(searchTerm) ||
          venue.includes(searchTerm) ||
          city.includes(searchTerm) ||
          eventType.includes(searchTerm) ||
          organizerName.includes(searchTerm)
        );
      });

    // Apply category filter if provided
    if (category && category !== 'All') {
      filteredEvents = filteredEvents.filter(event => 
        event.category?.toLowerCase() === category.toLowerCase()
      );
    }

    // Sort by relevance (title matches first, then description, etc.)
    filteredEvents.sort((a, b) => {
      const aTitle = (a.title || '').toLowerCase();
      const bTitle = (b.title || '').toLowerCase();
      
      // Exact title matches first
      if (aTitle === searchTerm && bTitle !== searchTerm) return -1;
      if (bTitle === searchTerm && aTitle !== searchTerm) return 1;
      
      // Title starts with search term
      if (aTitle.startsWith(searchTerm) && !bTitle.startsWith(searchTerm)) return -1;
      if (bTitle.startsWith(searchTerm) && !aTitle.startsWith(searchTerm)) return 1;
      
      // Then by title contains
      if (aTitle.includes(searchTerm) && !bTitle.includes(searchTerm)) return -1;
      if (bTitle.includes(searchTerm) && !aTitle.includes(searchTerm)) return 1;
      
      // Finally by date (newest first)
      return new Date(b.date || 0) - new Date(a.date || 0);
    });

    // Apply limit
    const limitedEvents = filteredEvents.slice(0, limit);

    return NextResponse.json({
      success: true,
      data: limitedEvents,
      total: filteredEvents.length,
      query: searchQuery,
      category: category || null,
      limit
    });

  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

// Handle POST requests for more complex search queries
export async function POST(request) {
  try {
    const body = await request.json();
    const { 
      query: searchQuery, 
      category, 
      dateRange, 
      priceRange, 
      eventType,
      limit = 50 
    } = body;

    if (!searchQuery || searchQuery.trim().length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'Search query is required' 
      }, { status: 400 });
    }

    const eventsRef = ref(database, 'events');
    const snapshot = await get(eventsRef);

    if (!snapshot.exists()) {
      return NextResponse.json({
        success: true,
        data: [],
        total: 0,
        query: searchQuery
      });
    }

    const allEvents = snapshot.val();
    const searchTerm = searchQuery.toLowerCase().trim();
    
    // Filter events based on search criteria
    let filteredEvents = Object.entries(allEvents)
      .map(([id, event]) => ({ id, ...event }))
      .filter(event => {
        const title = (event.title || '').toLowerCase();
        const description = (event.description || '').toLowerCase();
        const category = (event.category || '').toLowerCase();
        const venue = (event.venue || '').toLowerCase();
        const city = (event.city || '').toLowerCase();
        const eventType = (event.eventType || '').toLowerCase();
        const organizerName = (event.organizerName || '').toLowerCase();
        
        const matchesSearch = (
          title.includes(searchTerm) ||
          description.includes(searchTerm) ||
          category.includes(searchTerm) ||
          venue.includes(searchTerm) ||
          city.includes(searchTerm) ||
          eventType.includes(searchTerm) ||
          organizerName.includes(searchTerm)
        );

        if (!matchesSearch) return false;

        // Apply additional filters
        if (category && category !== 'All' && event.category?.toLowerCase() !== category.toLowerCase()) {
          return false;
        }

        if (eventType && event.eventType?.toLowerCase() !== eventType.toLowerCase()) {
          return false;
        }

        if (dateRange) {
          const eventDate = new Date(event.date);
          const startDate = dateRange.start ? new Date(dateRange.start) : null;
          const endDate = dateRange.end ? new Date(dateRange.end) : null;
          
          if (startDate && eventDate < startDate) return false;
          if (endDate && eventDate > endDate) return false;
        }

        if (priceRange) {
          const eventPrice = parseFloat(event.price) || 0;
          const minPrice = priceRange.min || 0;
          const maxPrice = priceRange.max || Infinity;
          
          if (eventPrice < minPrice || eventPrice > maxPrice) return false;
        }

        return true;
      });

    // Sort by relevance
    filteredEvents.sort((a, b) => {
      const aTitle = (a.title || '').toLowerCase();
      const bTitle = (b.title || '').toLowerCase();
      
      if (aTitle === searchTerm && bTitle !== searchTerm) return -1;
      if (bTitle === searchTerm && aTitle !== searchTerm) return 1;
      
      if (aTitle.startsWith(searchTerm) && !bTitle.startsWith(searchTerm)) return -1;
      if (bTitle.startsWith(searchTerm) && !aTitle.startsWith(searchTerm)) return 1;
      
      if (aTitle.includes(searchTerm) && !bTitle.includes(searchTerm)) return -1;
      if (bTitle.includes(searchTerm) && !aTitle.includes(searchTerm)) return 1;
      
      return new Date(b.date || 0) - new Date(a.date || 0);
    });

    const limitedEvents = filteredEvents.slice(0, limit);

    return NextResponse.json({
      success: true,
      data: limitedEvents,
      total: filteredEvents.length,
      query: searchQuery,
      filters: {
        category: category || null,
        dateRange: dateRange || null,
        priceRange: priceRange || null,
        eventType: eventType || null
      },
      limit
    });

  } catch (error) {
    console.error('Advanced search API error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
