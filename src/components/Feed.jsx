import axios from "axios";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import { addFeed } from "../utils/feedSlice";
import UserCard from "./UserCard";

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();

  const getFeed = async () => {
    try {
      const res = await axios.get(BASE_URL + "/feed", {
        withCredentials: true,
      });
      dispatch(addFeed(res?.data?.data));
    } catch (err) {
      console.error("Error fetching feed:", err);
    }
  };

  useEffect(() => {
    getFeed();
  }, [dispatch]);

  if (!feed) return;

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      {feed && feed.length > 0 ? (
        <div className="w-full flex justify-center">
          <UserCard user={feed[0]} />
        </div>
      ) : (
        <div className="text-center opacity-70">
          <h2 className="text-lg md:text-xl font-semibold">
            No Developers Found
          </h2>
          <p className="text-sm mt-2">Please check back later.</p>
        </div>
      )}
    </div>
  );
};

export default Feed;
