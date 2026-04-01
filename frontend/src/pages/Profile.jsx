import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { userService } from "../services/api";

const Profile = () => {
  const { user, updateUser, logout } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    password: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await userService.getProfile();
        if (res.data.success) {
          const userData = res.data.data;
          setProfile(userData);
          setFormData({
            name: userData.name || "",
            phone: userData.phone || "",
            password: "",
          });
          setPreview(
            userData.profileImage
              ? `http://localhost:5000${userData.profileImage}`
              : "",
          );
        }
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load profile.");
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchProfile();
  }, [user]);

  useEffect(() => {
    if (!imageFile) {
      return;
    }
    const objectUrl = URL.createObjectURL(imageFile);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [imageFile]);

  if (!user) {
    return <div className="p-8">Please login to view profile.</div>;
  }

  const validatePhone = (value) => /^\d{10,15}$/.test(value);
  const validatePassword = (value) =>
    value === "" || /^(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/.test(value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!validatePhone(formData.phone)) {
      setError("Phone must be 10 to 15 digits");
      return;
    }

    if (!validatePassword(formData.password)) {
      setError("Password must be min 8 chars with number and special char");
      return;
    }

    try {
      const form = new FormData();
      form.append("name", formData.name);
      form.append("phone", formData.phone);
      if (formData.password) form.append("password", formData.password);
      if (imageFile) form.append("image", imageFile);

      const res = await userService.updateProfile(form);
      if (res.data.success) {
        const updatedUser = res.data.data;
        if (updatedUser.profileImage) {
          updatedUser.profileImage = `http://localhost:5000${updatedUser.profileImage}`;
          setPreview(updatedUser.profileImage);
        }
        setProfile(updatedUser);
        updateUser(updatedUser);
        setMessage("Profile updated successfully");
        setEditMode(false);
        setFormData((prev) => ({ ...prev, password: "" }));
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (
      !["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
        file.type,
      )
    ) {
      setError("Only JPG, PNG, WEBP images are allowed");
      return;
    }
    setImageFile(file);
    setError("");
  };

  if (loading) {
    return <div className="p-8">Loading profile...</div>;
  }

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-64px)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-3xl shadow-xl">
        <div className="flex flex-wrap items-center justify-between border-b pb-6 mb-6">
          <div className="flex items-center space-x-4">
            <img
              src={preview || "/default-avatar.png"}
              alt="Profile"
              className="h-24 w-24 rounded-full object-cover border border-gray-200 shadow-sm"
            />
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900">
                {profile?.name}
              </h1>
              <p className="text-sm text-gray-500">{profile?.email}</p>
            </div>
          </div>
          <div className="space-x-2">
            <button
              className="px-4 py-2 text-sm font-medium rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-50"
              onClick={() => setEditMode(!editMode)}
            >
              {editMode ? "Cancel" : "Edit Profile"}
            </button>
            <button
              className="px-4 py-2 text-sm font-medium rounded-lg bg-red-600 text-white hover:bg-red-700"
              onClick={logout}
            >
              Logout
            </button>
          </div>
        </div>

        {message && (
          <div className="mb-4 p-3 text-green-700 bg-green-50 border border-green-200 rounded">
            {message}
          </div>
        )}
        {error && (
          <div className="mb-4 p-3 text-red-700 bg-red-50 border border-red-200 rounded">
            {error}
          </div>
        )}

        {!editMode ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Name
              </h3>
              <p className="text-lg font-medium text-gray-900 bg-gray-50 p-3 rounded-xl border border-gray-100">
                {profile?.name}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Phone
              </h3>
              <p className="text-lg font-medium text-gray-900 bg-gray-50 p-3 rounded-xl border border-gray-100">
                {profile?.phone || "Not provided"}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Joined
              </h3>
              <p className="text-lg font-medium text-gray-900 bg-gray-50 p-3 rounded-xl border border-gray-100">
                {new Date(
                  profile?.createdAt || Date.now(),
                ).toLocaleDateString()}
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="mt-1 block w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="mt-1 block w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password (optional)
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="mt-1 block w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Leave blank to keep current password"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Profile Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="mt-1 block w-full text-sm text-gray-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition"
            >
              Save Changes
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;
