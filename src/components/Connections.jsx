import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionSlice";
import { Link } from "react-router-dom";
import UserCard from "./UserCard";

const Connections = () => {
  const connections = useSelector((store) => store.connections);
  const dispatch = useDispatch();
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchConnections = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      dispatch(addConnections(res.data.data));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (!connections) return null;

  // ================= EMPTY STATE =================
  if (connections.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-bold mb-2">No Connections Yet</h2>
        <p className="opacity-70">
          Start connecting with developers to see them here.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-center mb-8">
          Your Connections
        </h1>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 place-items-center">
          {connections.map((connection) => {
            const { _id, firstName, lastName, photoUrl, age, gender, about } =
              connection;

            return (
              <div
                key={ _id }
                className="
                  w-full max-w-sm
                  bg-gradient-to-b from-white via-base-100 to-base-200/60
                  ring-1 ring-base-300/60
                  rounded-2xl
                  p-5
                  shadow-lg
                  hover:shadow-xl
                  hover:-translate-y-1
                  transition-all duration-300
                  flex flex-col items-center text-center
                "
              >
                {/* AVATAR */}
                <img
                  src={photoUrl}
                  alt="profile"
                  className="w-20 h-20 rounded-full object-cover ring-2 ring-base-300 mb-3"
                />

                {/* INFO */}
                <h2 className="text-xl font-bold">
                  {firstName} {lastName}
                </h2>

                {age && gender && (
                  <p className="text-sm opacity-70">
                    {age} • {gender}
                  </p>
                )}

                <p className="mt-2 text-sm opacity-80 italic line-clamp-2">
                  {about || "No bio provided"}
                </p>

                {/* ACTIONS */}
                <div className="mt-4 flex flex-col gap-2 w-full">
                  <button
                    onClick={() => setSelectedUser(connection)}
                    className="btn btn-outline rounded-full"
                  >
                    View Profile
                  </button>

                  <Link to={`/chat/${_id}`}>
                    <button className="btn btn-primary w-full rounded-full">
                      Chat
                    </button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/*PROFILE PREVIEW*/}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="relative">
            <UserCard user={selectedUser} />

            {/* CLOSE */}
            <button
              onClick={() => setSelectedUser(null)}
              className="absolute -top-4 -right-4 btn btn-circle btn-sm"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Connections;
