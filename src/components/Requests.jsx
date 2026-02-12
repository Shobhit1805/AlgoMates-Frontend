import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addRequests, removeRequest } from "../utils/requestSlice";
import { useEffect, useState } from "react";
import UserCard from "./UserCard";

const Requests = () => {
  const requests = useSelector((store) => store.requests);
  const dispatch = useDispatch();

  const [selectedUser, setSelectedUser] = useState(null);

  const reviewRequest = async (status, _id) => {
    try {
      await axios.post(
        BASE_URL + "/request/review/" + status + "/" + _id,
        {},
        { withCredentials: true }
      );
      dispatch(removeRequest(_id));
      setSelectedUser(null);
    } catch (err) {}
  };

  const fetchRequests = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/requests/received", {
        withCredentials: true,
      });
      dispatch(addRequests(res.data.data));
    } catch (err) {}
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (!requests) return null;

  // ================= EMPTY STATE =================
  if (requests.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-bold mb-2">No Connection Requests</h2>
        <p className="opacity-70">
          When someone sends you a request, it’ll appear here.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-center mb-8">
          Connection Requests
        </h1>

        <div className="space-y-6">
          {requests.map((request) => {
            const user = request.fromUserId;
            const { firstName, lastName, photoUrl, age, gender, about } = user;

            return (
              <div
                key={request._id}
                className="
                  bg-gradient-to-b from-white via-base-100 to-base-200/60
                  ring-1 ring-base-300/60
                  rounded-2xl
                  p-5
                  shadow-lg
                  hover:shadow-xl
                  transition-all
                  flex flex-col sm:flex-row
                  gap-4
                "
              >
                {/* AVATAR */}
                <div className="flex justify-center sm:justify-start">
                  <img
                    src={photoUrl}
                    alt="profile"
                    className="w-20 h-20 rounded-full object-cover ring-2 ring-base-300"
                  />
                </div>

                {/* INFO */}
                <div className="flex-1 text-center sm:text-left">
                  <h2 className="text-xl font-bold">
                    {firstName} {lastName}
                  </h2>

                  {age && gender && (
                    <p className="text-sm opacity-70">
                      {age} • {gender}
                    </p>
                  )}

                  <p className="mt-2 text-sm opacity-80 line-clamp-2 italic">
                    {about || "No bio provided"}
                  </p>

                  {/* VIEW PROFILE */}
                  <button
                    className="mt-3 text-sm font-medium text-primary hover:underline"
                    onClick={() => setSelectedUser(user)}
                  >
                    View full profile →
                  </button>
                </div>

                {/* ACTIONS */}
                <div className="flex sm:flex-col gap-3 justify-center">
                  <button
                    className="btn btn-outline rounded-full"
                    onClick={() =>
                      reviewRequest("rejected", request._id)
                    }
                  >
                    Reject
                  </button>

                  <button
                    className="btn btn-primary rounded-full"
                    onClick={() =>
                      reviewRequest("accepted", request._id)
                    }
                  >
                    Accept
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= PROFILE PREVIEW MODAL ================= */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="relative">
            <UserCard user={selectedUser} />

            {/* CLOSE BUTTON */}
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

export default Requests;
