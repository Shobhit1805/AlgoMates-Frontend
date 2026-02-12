import { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserCard from "./UserCard";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";

const EditProfile = ({ user }) => {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl);
  const [age, setAge] = useState(user.age || "");
  const [gender, setGender] = useState(user.gender || "");
  const [about, setAbout] = useState(user.about || "");
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const saveProfile = async () => {
    setError("");
    try {
      const res = await axios.patch(
        BASE_URL + "/profile/edit",
        { firstName, lastName, photoUrl, age, gender, about },
        { withCredentials: true }
      );

      dispatch(addUser(res?.data?.data));
      setShowToast(true);

      setTimeout(() => {
        setShowToast(false);
        navigate("/");
      }, 1000);
    } catch (err) {
      setError(err.response?.data || "Something went wrong");
    }
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* ================= LEFT: FORM ================= */}
          <div className="card bg-base-200 shadow-xl rounded-3xl">
            <div className="card-body">

              <h2 className="text-2xl font-bold text-center mb-2">
                Edit Profile
              </h2>
              <p className="text-center text-sm opacity-70 mb-6">
                Update your details
              </p>

              {/* BASIC INFO */}
              <div className="space-y-4">
                <h3 className="font-semibold opacity-80">Basic Info</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="First Name"
                    className="input input-bordered w-full"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />

                  <input
                    type="text"
                    placeholder="Last Name"
                    className="input input-bordered w-full"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>

                <input
                  type="text"
                  placeholder="Photo URL"
                  className="input input-bordered w-full"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="number"
                    placeholder="Age"
                    className="input input-bordered w-full"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                  />

                  <input
                    type="text"
                    placeholder="Gender"
                    className="input input-bordered w-full"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                  />
                </div>
              </div>

              <div className="divider my-6"></div>

              {/* ABOUT */}
              <div className="space-y-2">
                <h3 className="font-semibold opacity-80">About You</h3>

                <textarea
                  className="textarea textarea-bordered w-full min-h-[100px]"
                  placeholder="Write something about yourself..."
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                />
              </div>

              {error && (
                <p className="text-red-500 text-sm mt-2">{error}</p>
              )}

              <div className="mt-6">
                <button
                  className="btn btn-primary w-full rounded-full"
                  onClick={saveProfile}
                >
                  Save Profile
                </button>
              </div>
            </div>
          </div>

          {/* ================= RIGHT: LIVE PREVIEW ================= */}
          <div className="flex flex-col items-center">
            <p className="mb-4 text-sm font-medium opacity-70">
              Live Preview
            </p>

            <UserCard
              user={{ firstName, lastName, photoUrl, age, gender, about }}
            />
          </div>
        </div>
      </div>

      {/* TOAST */}
      {showToast && (
        <div className="toast toast-top toast-center z-50">
          <div className="alert alert-success rounded-full shadow-lg">
            <span>Profile updated ✅</span>
          </div>
        </div>
      )}
    </>
  );
};

export default EditProfile;
