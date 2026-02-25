import React, { createContext, useState } from 'react';

export const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
    const [bookingDetails, setBookingDetails] = useState({
        room: null,
        checkIn: '',
        checkOut: '',
        guests: 1,
        totalPrice: 0,
    });
    const [searchParams, setSearchParams] = useState({
        checkin: '',
        checkout: '',
        guests: '1',
        type: '',
    });

    const updateBookingDetails = (details) => {
        setBookingDetails(prev => ({ ...prev, ...details }));
    };

    const updateSearchParams = (params) => {
        setSearchParams(prev => ({ ...prev, ...params }));
    };

    const clearBookingDetails = () => {
        setBookingDetails({
            room: null,
            checkIn: '',
            checkOut: '',
            guests: 1,
            totalPrice: 0,
        });
    };

    return (
        <BookingContext.Provider
            value={{
                bookingDetails,
                updateBookingDetails,
                clearBookingDetails,
                searchParams,
                updateSearchParams
            }}
        >
            {children}
        </BookingContext.Provider>
    );
};
