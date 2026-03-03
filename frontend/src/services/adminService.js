import api from "./api";

// Get all rooms (Admin)
const getRooms = async () => {
  const response = await api.get("/admin/rooms");
  return response.data;
};

// Create room
const createRoom = async (roomData) => {
  const response = await api.post("/admin/rooms", roomData);
  return response.data;
};

// Export properly
const adminService = {
  getRooms,
  createRoom,
};

export default adminService;