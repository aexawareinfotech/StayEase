import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { roomService } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { BookingContext } from '../context/BookingContext';

const RoomDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useContext(AuthContext);
    const { searchParams, updateBookingDetails } = useContext(BookingContext);

    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [checkin, setCheckin] = useState(searchParams.checkin || '');
    const [checkout, setCheckout] = useState(searchParams.checkout || '');
    const [guests, setGuests] = useState(searchParams.guests || '1');

    useEffect(() => {
        const fetchRoom = async () => {
            try {
                const res = await roomService.getRoomDetails(id);
                if (res.data.success) {
                    setRoom(res.data.data);
                }
            } catch (err) {
                setError('Failed to fetch room details');
            } finally {
                setLoading(false);
            }
        };
        fetchRoom();
    }, [id]);

    const handleBooking = () => {
        if (!token) {
            navigate('/auth');
            return;
        }
        if (!checkin || !checkout) {
            alert("Please select check-in and check-out dates.");
            return;
        }
        if (Number(guests) > room.capacity) {
            alert(`Maximum capacity is ${room.capacity}`);
            return;
        }

        const cin = new Date(checkin);
        const cout = new Date(checkout);
        const nights = Math.round(Math.abs((cout - cin) / (1000 * 60 * 60 * 24)));
        if (nights <= 0) {
            alert("Check-out must be after check-in.");
            return;
        }

        updateBookingDetails({
            room,
            checkIn: checkin,
            checkOut: checkout,
            guests: Number(guests),
            totalPrice: nights * room.price
        });

        navigate('/booking');
    };

    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        if (room && !selectedImage) {
            const categoryImages = {
                Single: "https://images.unsplash.com/photo-1505693314120-0d443867891c",
                Double: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
                Deluxe: "https://images.unsplash.com/photo-1590490360182-c33d57733427",
                Suite: "https://images.unsplash.com/photo-1578898886225-c7c8940473f0"
            };
            setSelectedImage(
                room.images && room.images.length > 0
                    ? room.images[0]
                    : (categoryImages[room.type] || categoryImages['Single'])
            );
        }
    }, [room, selectedImage]);

    if (loading) return <div className="min-h-screen flex justify-center items-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
    if (error) return <div className="text-center py-20 text-red-600">{error}</div>;
    if (!room) return <div className="text-center py-20">Room not found</div>;

    const categoryImages = {
        Single: [
            "https://images.unsplash.com/photo-1505693314120-0d443867891c",
            "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2"
        ],
        Double: [
            "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
            "https://images.unsplash.com/photo-1611892440504-42a792e24d32"
        ],
        Deluxe: [
            "https://images.unsplash.com/photo-1590490360182-c33d57733427",
            "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa"
        ],
        Suite: [
            "https://images.unsplash.com/photo-1578898886225-c7c8940473f0",
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
        ]
    };

    const displayImages = room.images && room.images.length > 0 ? room.images : (categoryImages[room.type] || categoryImages['Single']);

    return (
        <div className="bg-gray-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">
                <div className="md:flex">
                    <div className="md:w-1/2 p-6 flex flex-col justify-center bg-gray-100 rounded-l-3xl relative">
                        <div className="overflow-hidden rounded-2xl shadow-lg bg-white relative h-96 w-full flex items-center justify-center">
                            <img
                                src={selectedImage}
                                alt={room.type}
                                className="w-full h-full object-cover zoom-image"
                            />
                        </div>
                        <div className="flex justify-center gap-4 mt-6">
                            {displayImages.map((img, i) => (
                                <img
                                    key={i}
                                    src={img}
                                    onClick={() => setSelectedImage(img)}
                                    className={`w-20 h-20 rounded-xl object-cover cursor-pointer hover:opacity-80 transition hover:shadow-md ${selectedImage === img ? 'ring-4 ring-blue-500 shadow-lg' : 'opacity-70'}`}
                                    alt={`${room.type} view ${i + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="md:w-1/2 p-8 md:p-12">
                        <div className="flex justify-between items-center mb-4">
                            <h1 className="text-3xl font-extrabold text-gray-900">{room.type} Room - {room.roomNumber}</h1>
                            <span className="text-2xl font-bold text-blue-600">₹ {room.price.toLocaleString("en-IN")}<span className="text-sm text-gray-500 font-normal"> / night</span></span>
                        </div>
                        <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                            {room.description}
                        </p>

                        <div className="mb-8 p-6 bg-blue-50 rounded-2xl">
                            <h3 className="font-bold text-gray-900 mb-4 text-xl">Amenities</h3>
                            <div className="flex flex-wrap gap-3">
                                {room.amenities.map((item, idx) => (
                                    <span key={idx} className="bg-white border border-blue-200 text-blue-800 text-sm font-semibold px-4 py-2 rounded-xl shadow-sm">
                                        {item}
                                    </span>
                                ))}
                                <span className="bg-white border border-blue-200 text-emerald-700 text-sm font-semibold px-4 py-2 rounded-xl shadow-sm">
                                    Max {room.capacity} Guests
                                </span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-bold text-gray-900 text-xl border-b pb-2">Book This Room</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-700 font-semibold mb-1">Check-in</label>
                                    <input type="date" value={checkin} onChange={e => setCheckin(e.target.value)} className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500" min={new Date().toISOString().split('T')[0]} />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-700 font-semibold mb-1">Check-out</label>
                                    <input type="date" value={checkout} onChange={e => setCheckout(e.target.value)} className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500" min={checkin || new Date().toISOString().split('T')[0]} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-700 font-semibold mb-1">Guests</label>
                                <select value={guests} onChange={e => setGuests(e.target.value)} className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500">
                                    {[...Array(room.capacity)].map((_, i) => (
                                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                                    ))}
                                </select>
                            </div>

                            <button
                                onClick={handleBooking}
                                className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg transition duration-200 ease-in-out transform hover:-translate-y-1 text-lg"
                            >
                                Book Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoomDetails;
