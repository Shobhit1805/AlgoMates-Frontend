import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";
import { useState } from "react";

const UserCard = ({ user }) => {
  const { _id, firstName, lastName, photoUrl, age, gender, about } = user;
  const dispatch = useDispatch();
  const [showMore, setShowMore] = useState(false);

  const handleSendRequest = async (status, userId) => {
    try {
      await axios.post(
        BASE_URL + "/request/send/" + status + "/" + userId,
        {},
        { withCredentials: true }
      );
      dispatch(removeUserFromFeed(userId));
    } catch (err) {}
  };

  return (
    <div
      className="
        w-full max-w-sm
        h-[480px] sm:h-[500px] md:h-[520px]
        rounded-3xl
        bg-base-100
        border border-base-300
        shadow-lg hover:shadow-2xl
        transition-all duration-300
        overflow-hidden
        flex flex-col
      "
    >
      {/* IMAGE */}
      <figure className="aspect-[4/3] w-full overflow-hidden">
        <img
          src={photoUrl}
          alt="profile"
          className="w-full h-full object-cover"
        />
      </figure>

      {/* CONTENT */}
      <div className="flex flex-col flex-1 px-6 py-4">
        {/* Name */}
        <h2 className="text-xl font-bold text-center">
          {firstName} {lastName}
        </h2>

        {/* Meta */}
        {age && gender && (
          <p className="text-center text-sm opacity-70 mt-1">
            {age} • {gender}
          </p>
        )}

        {/* BIO */}
        <div className="mt-3 text-sm text-center opacity-80">
          <p
            className={`italic ${
              showMore
                ? "max-h-32 overflow-y-auto"
                : "line-clamp-3"
            }`}
          >
            {about ? `“${about}”` : "No bio provided"}
          </p>

          {about && about.length > 80 && (
            <button
              onClick={() => setShowMore((prev) => !prev)}
              className="mt-1 text-xs font-medium text-primary hover:underline"
            >
              {showMore ? "See less" : "See more"}
            </button>
          )}
        </div>

        {/* PUSH ACTIONS DOWN */}
        <div className="flex-grow" />

        {/* ACTIONS */}
        <div className="flex gap-4 mt-4">
          <button
            className="btn btn-outline flex-1 rounded-full"
            onClick={() => handleSendRequest("ignored", _id)}
          >
            Skip
          </button>

          <button
            className="btn btn-primary flex-1 rounded-full"
            onClick={() => handleSendRequest("interested", _id)}
          >
            Connect
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
