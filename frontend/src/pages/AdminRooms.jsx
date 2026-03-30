import React, { useState, useEffect } from 'react';
import adminService from '../services/adminService';

const AdminRooms = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);

    const [formData, setFormData] = useState({
        roomNumber: '',
        type: 'Single',
        price: '',
        capacity: '',
        description: '',
        status: 'available',
        amenities: [],
        images: []
    });

    const amenitiesList = ['WiFi', 'TV', 'AC', 'Mini Bar', 'Ocean View', 'Balcony', 'Breakfast Included'];

    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        try {
            const data = await adminService.getRooms();
            setRooms(data.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching rooms:", error);
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;
        setFormData(prev => {
            let amenities = [...prev.amenities];
            if (checked) amenities.push(value);
            else amenities = amenities.filter(a => a !== value);
            return { ...prev, amenities };
        });
    };

    const handleImagesChange = (e) => {
        const value = e.target.value;
        const ArrayOfImages = value.split(',').map(url => url.trim()).filter(url => url);
        setFormData(prev => ({ ...prev, images: ArrayOfImages }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editMode) {
                console.log("Saving room changes...");
                console.log("Room ID:", formData._id);
                console.log("Form Data:", formData);

                const response = await fetch(
                    `http://localhost:5000/api/v1/admin/rooms/${formData._id}`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${localStorage.getItem("token")}`
                        },
                        body: JSON.stringify(formData)
                    }
                );

                const data = await response.json();

                console.log("Server response:", data);

                if (!response.ok) {
                    throw new Error(data.message || "Failed to process request");
                }

                alert("Room updated successfully");
            } else {
                await adminService.createRoom(formData);
            }
            fetchRooms();
            closeModal();
        } catch (error) {
            console.error("Update error:", error);
            alert(error.message || 'Failed to process request');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to disable this room? It will be marked as Maintenance.')) {
            try {
                const response = await fetch(
                    `http://localhost:5000/api/v1/admin/rooms/${id}`,
                    {
                        method: "DELETE",
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`
                        }
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message);
                }

                alert("Room deleted successfully");
                window.location.reload();

            } catch (error) {
                console.error(error);
                alert("Failed to delete room");
            }
        }
    };

    const openModal = (room = null) => {
        if (room) {
            setEditMode(true);
            setFormData({ ...room, images: room.images || [] });
        } else {
            setEditMode(false);
            setFormData({
                roomNumber: '',
                type: 'Single',
                price: '',
                capacity: '',
                description: '',
                status: 'available',
                amenities: [],
                images: []
            });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    if (loading) return <div className="vh-100 d-flex justify-content-center align-items-center"><div className="spinner-border text-primary"></div></div>;

    return (
        <div className="container-fluid py-4 fade-in">
            <div className="d-flex justify-content-between align-items-center border-bottom pb-4 mb-4">
                <h1 className="fw-bolder text-dark mb-0 fs-2 tracking-wider">Room <span className="text-primary">Management</span></h1>
                <button onClick={() => openModal()} className="btn btn-primary fw-bold px-4 rounded-pill shadow-sm transition hover-scale" style={{ background: 'linear-gradient(to right, #2563eb, #1d4ed8)', border: 'none' }}>
                    <i className="bi bi-plus-lg me-2"></i> Add New Room
                </button>
            </div>

            <div className="card shadow-sm border-0 rounded-4">
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th className="text-secondary fw-bold small text-uppercase tracking-wider py-3 px-4">Room No.</th>
                                    <th className="text-secondary fw-bold small text-uppercase tracking-wider py-3">Type</th>
                                    <th className="text-secondary fw-bold small text-uppercase tracking-wider py-3">Price / Night</th>
                                    <th className="text-secondary fw-bold small text-uppercase tracking-wider py-3">Capacity</th>
                                    <th className="text-secondary fw-bold small text-uppercase tracking-wider py-3 text-center">Status</th>
                                    <th className="text-secondary fw-bold small text-uppercase tracking-wider py-3 text-end px-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rooms.map((room) => (
                                    <tr key={room._id} className="transition border-bottom">
                                        <td className="px-4 py-3">
                                            <div className="fw-bolder text-dark fs-5">{room.roomNumber}</div>
                                            <div className="small text-muted text-truncate" style={{ maxWidth: '150px' }}>{room.description}</div>
                                        </td>
                                        <td><span className="fw-bold text-primary">{room.type} Room</span></td>
                                        <td className="fw-bold text-success">₹ {room.price.toLocaleString("en-IN")}</td>
                                        <td className="fw-semibold text-secondary"><i className="bi bi-people-fill me-2"></i>{room.capacity} Guests</td>
                                        <td className="text-center">
                                            <span className={`badge border shadow-sm px-3 py-2 rounded-pill text-uppercase ${room.status === 'available' ? 'bg-success bg-opacity-10 text-success border-success' : 'bg-danger bg-opacity-10 text-danger border-danger'
                                                }`}>
                                                {room.status}
                                            </span>
                                        </td>
                                        <td className="text-end px-4">
                                            <div className="btn-group shadow-sm">
                                                <button onClick={() => openModal(room)} className="btn btn-light border-secondary text-primary fw-bold px-3 hover-bg-light">
                                                    Edit
                                                </button>
                                                <button onClick={() => handleDelete(room._id)} className="btn btn-light border-secondary text-danger fw-bold px-3 hover-bg-light">
                                                    Disable
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal Layer */}
            {showModal && (
                <>
                    <div className="modal-backdrop fade show" style={{ zIndex: 1050 }}></div>
                    <div className="modal fade show d-block" tabIndex="-1" style={{ zIndex: 1055 }}>
                        <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                            <div className="modal-content border-0 shadow-lg rounded-4">
                                <div className="modal-header bg-light border-bottom">
                                    <h5 className="modal-title fw-bolder tracking-wider text-dark">
                                        {editMode ? 'Edit Existing Room' : 'Create New Room'}
                                    </h5>
                                    <button type="button" className="btn-close shadow-sm" onClick={closeModal}></button>
                                </div>
                                <div className="modal-body p-4">
                                    <form onSubmit={handleSubmit} id="roomForm">
                                        <div className="row g-3">
                                            <div className="col-md-6">
                                                <label className="form-label text-muted fw-bold small text-uppercase">Room Number</label>
                                                <input type="text" className="form-control bg-light border-0 shadow-sm" name="roomNumber" value={formData.roomNumber} onChange={handleInputChange} required />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label text-muted fw-bold small text-uppercase">Room Type</label>
                                                <select className="form-select bg-light border-0 shadow-sm fw-bold text-dark cursor-pointer" name="type" value={formData.type} onChange={handleInputChange}>
                                                    <option value="Single">Single</option>
                                                    <option value="Double">Double</option>
                                                    <option value="Deluxe">Deluxe</option>
                                                    <option value="Suite">Suite</option>
                                                </select>
                                            </div>
                                            <div className="col-md-4">
                                                <label className="form-label text-muted fw-bold small text-uppercase">Price / Night (₹)</label>
                                                <input type="number" className="form-control bg-light border-0 shadow-sm text-success fw-bold" name="price" value={formData.price} onChange={handleInputChange} required min="0" />
                                            </div>
                                            <div className="col-md-4">
                                                <label className="form-label text-muted fw-bold small text-uppercase">Max Capacity</label>
                                                <input type="number" className="form-control bg-light border-0 shadow-sm fw-bold text-primary" name="capacity" value={formData.capacity} onChange={handleInputChange} required min="1" max="10" />
                                            </div>
                                            <div className="col-md-4">
                                                <label className="form-label text-muted fw-bold small text-uppercase">Current Status</label>
                                                <select className="form-select bg-light border-0 shadow-sm fw-bold text-dark cursor-pointer" name="status" value={formData.status} onChange={handleInputChange}>
                                                    <option value="available">Available</option>
                                                    <option value="maintenance">Under Maintenance</option>
                                                </select>
                                            </div>
                                            <div className="col-12">
                                                <label className="form-label text-muted fw-bold small text-uppercase">Marketing Description</label>
                                                <textarea className="form-control bg-light border-0 shadow-sm" name="description" rows="3" value={formData.description} onChange={handleInputChange} required></textarea>
                                            </div>
                                            <div className="col-12">
                                                <label className="form-label text-muted fw-bold small text-uppercase">Image URLs (comma separated)</label>
                                                <input type="text" className="form-control bg-light border-0 shadow-sm text-primary font-monospace small" placeholder="https://img1.jpg, https://img2.jpg" value={formData.images.join(', ')} onChange={handleImagesChange} />
                                            </div>

                                            <div className="col-12 mt-4">
                                                <label className="form-label text-dark fw-bold border-bottom pb-2 w-100">Room Amenities</label>
                                                <div className="d-flex flex-wrap gap-4 mt-2">
                                                    {amenitiesList.map(amenity => (
                                                        <div className="form-check form-switch" key={amenity}>
                                                            <input
                                                                className="form-check-input shadow-sm cursor-pointer"
                                                                type="checkbox"
                                                                id={`amenity-${amenity}`}
                                                                value={amenity}
                                                                onChange={handleCheckboxChange}
                                                                checked={formData.amenities.includes(amenity)}
                                                            />
                                                            <label className="form-check-label text-secondary fw-semibold cursor-pointer" htmlFor={`amenity-${amenity}`}>{amenity}</label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                                <div className="modal-footer bg-light border-top p-3 justify-content-between">
                                    <button type="button" className="btn btn-outline-secondary fw-bold px-4 rounded-pill" onClick={closeModal}>Cancel</button>
                                    <button type="submit" form="roomForm" className="btn btn-primary fw-bold px-5 rounded-pill shadow-sm transition hover-scale">
                                        {editMode ? 'Save Changes' : 'Create Room'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            <style>{`
                .tracking-wider { letter-spacing: 0.05em; }
                .fade-in { animation: fadeIn 0.4s ease-in; }
                .cursor-pointer { cursor: pointer; }
                .hover-scale { transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1); }
                .hover-scale:hover { transform: scale(1.05); }
                .hover-bg-light:hover { background-color: #f8f9fa !important; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
        </div>
    );
};

export default AdminRooms;
