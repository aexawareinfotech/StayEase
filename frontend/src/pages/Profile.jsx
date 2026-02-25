import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
    const { user } = useContext(AuthContext);

    if (!user) return null;

    return (
        <div className="bg-gray-50 min-h-[calc(100vh-64px)] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-3xl shadow-xl">
                <div className="flex items-center space-x-6 border-b pb-8 mb-8">
                    <div className="h-24 w-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-4xl font-extrabold shadow-sm">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900">{user.name}</h1>
                        <span className="inline-block mt-2 bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                            {user.role} Account
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Email Address</h3>
                        <p className="text-lg font-medium text-gray-900 bg-gray-50 p-3 rounded-xl border border-gray-100">{user.email}</p>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Phone Number</h3>
                        <p className="text-lg font-medium text-gray-900 bg-gray-50 p-3 rounded-xl border border-gray-100">{user.phone || 'Not provided'}</p>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Account Created</h3>
                        <p className="text-lg font-medium text-gray-900 bg-gray-50 p-3 rounded-xl border border-gray-100">{new Date(user.createdAt || Date.now()).toLocaleDateString()}</p>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-100">
                    <button className="bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-bold py-3 px-8 rounded-xl transition duration-150 shadow-sm">
                        Edit Profile
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;
