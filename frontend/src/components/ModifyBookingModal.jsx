import React, { useState, useEffect } from "react";
import { bookingService } from "../services/api";

const ModifyBookingModal = ({ booking, onClose, onSaved }) => {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(booking.guests || 1);
  const [price, setPrice] = useState(booking.totalPrice || 0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const rate = booking.room?.price || booking.room?.pricePerNight || 0;

  useEffect(() => {
    setCheckIn(new Date(booking.checkIn).toISOString().slice(0, 10));
    setCheckOut(new Date(booking.checkOut).toISOString().slice(0, 10));
  }, [booking]);

  useEffect(() => {
    if (!checkIn || !checkOut) return;
    const inDate = new Date(checkIn);
    const outDate = new Date(checkOut);
    if (outDate > inDate) {
      const nights = Math.ceil((outDate - inDate) / (1000 * 60 * 60 * 24));
      setPrice(nights * rate * guests);
    } else {
      setPrice(0);
    }
  }, [checkIn, checkOut, guests, rate]);

  const submit = async () => {
    setError("");
    const inDate = new Date(checkIn);
    const outDate = new Date(checkOut);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!checkIn || !checkOut)
      return setError("Please provide both check-in and check-out dates");
    if (outDate <= inDate) return setError("Check-out must be after check-in");
    if (inDate < today) return setError("Check-in cannot be in the past");

    setLoading(true);
    try {
      const res = await bookingService.modifyBooking(booking._id, {
        checkIn,
        checkOut,
        guests,
      });
      if (res.data.success) {
        onSaved(res.data.data);
      } else {
        setError("Failed to modify booking");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6">
        <h3 className="text-xl font-bold mb-4">Modify Booking</h3>
        {error && (
          <div className="text-red-600 bg-red-50 p-2 rounded mb-3">{error}</div>
        )}
        <div className="grid grid-cols-1 gap-4">
          <label>
            Check-in
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-full border p-2 rounded"
            />
          </label>
          <label>
            Check-out
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full border p-2 rounded"
            />
          </label>
          <label>
            Guests
            <input
              type="number"
              min="1"
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="w-full border p-2 rounded"
            />
          </label>
          <div className="text-sm font-semibold">
            Updated Price: ₹ {price.toFixed(2)}
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg">
            Cancel
          </button>
          <button
            onClick={submit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-blue-300"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModifyBookingModal;
