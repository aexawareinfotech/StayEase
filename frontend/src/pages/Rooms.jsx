import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { roomService } from '../services/api';
import { BookingContext } from '../context/BookingContext';

const Rooms = () => {
    const { searchParams, updateSearchParams } = useContext(BookingContext);
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchRooms = async () => {
        setLoading(true);
        try {
            const hasSearchParams = searchParams.checkin || searchParams.checkout || searchParams.type || searchParams.minPrice;
            const res = hasSearchParams ? await roomService.searchRooms(searchParams) : await roomService.getAllRooms();
            if (res.data.success) setRooms(res.data.data);
        } catch (err) {
            setError('Failed to fetch rooms');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRooms();
    }, []);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        updateSearchParams({ [name]: value });
    };

    const handleSearchClick = (e) => {
        e.preventDefault();
        fetchRooms();
    };

    const clearFilters = () => {
        updateSearchParams({ checkin: '', checkout: '', guests: '1', type: '', minPrice: '', maxPrice: '' });
        // After context updates, it won't auto-fetch, so we manually call fetchRooms without params
        roomService.getAllRooms().then(res => setRooms(res.data.data));
    };

    return (
        <div className="bg-gray-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
                {/* Sidebar Filters */}
                <div className="w-full md:w-1/4">
                    <div className="bg-white p-6 rounded-2xl shadow-lg sticky top-24">
                        <h3 className="text-xl font-bold text-gray-900 mb-6 border-b pb-3">Filters</h3>
                        <form onSubmit={handleSearchClick} className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Check-in</label>
                                <input type="date" name="checkin" value={searchParams.checkin || ''} onChange={handleFilterChange} className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" min={new Date().toISOString().split('T')[0]} />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Check-out</label>
                                <input type="date" name="checkout" value={searchParams.checkout || ''} onChange={handleFilterChange} className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" min={searchParams.checkin || new Date().toISOString().split('T')[0]} />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Room Type</label>
                                <select name="type" value={searchParams.type || ''} onChange={handleFilterChange} className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                                    <option value="">Any</option>
                                    <option value="Single">Single</option>
                                    <option value="Double">Double</option>
                                    <option value="Suite">Suite</option>
                                    <option value="Deluxe">Deluxe</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Guests</label>
                                <select name="guests" value={searchParams.guests || '1'} onChange={handleFilterChange} className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                                    {[1, 2, 3, 4, 5, 6].map(num => <option key={num} value={num}>{num}</option>)}
                                </select>
                            </div>
                            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow transition duration-150">
                                Apply Filters
                            </button>
                            <button type="button" onClick={clearFilters} className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition duration-150 mt-2">
                                Clear Filters
                            </button>
                        </form>
                    </div>
                </div>

                {/* Room List */}
                <div className="w-full md:w-3/4">
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-6">Available Rooms</h2>
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                    ) : error ? (
                        <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
                    ) : rooms.length === 0 ? (
                        <div className="bg-white p-10 text-center rounded-2xl shadow-sm">
                            <p className="text-gray-500 text-lg">No rooms found matching your criteria. Try adjusting your filters.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {rooms.map(room => (
                                <div key={room._id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col">
                                    <div className="h-48 bg-gray-200 relative">
                                        {/* Placeholder Image */}
                                        <img src={`https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80`} alt={room.type} className="w-full h-full object-cover" />
                                        <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-bold shadow text-blue-600">
                                            ₹ {room.price.toLocaleString("en-IN")} / night
                                        </div>
                                    </div>
                                    <div className="p-6 flex flex-col flex-grow">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-2xl font-bold text-gray-900">{room.type} Room</h3>
                                        </div>
                                        <p className="text-gray-600 mb-4 line-clamp-2 text-sm">{room.description}</p>
                                        <div className="flex flex-wrap gap-2 mb-6">
                                            {room.amenities.map((amenity, idx) => (
                                                <span key={idx} className="bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                                                    {amenity}
                                                </span>
                                            ))}
                                            <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                                                Up to {room.capacity} Guests
                                            </span>
                                        </div>
                                        <div className="mt-auto">
                                            <Link to={`/rooms/${room._id}`} className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition duration-200">
                                                View Details
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Rooms;
