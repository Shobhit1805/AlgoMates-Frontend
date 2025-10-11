import axios from 'axios'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { BASE_URL } from '../utils/constants'
import { addFeed } from '../utils/feedSlice'
import UserCard from './UserCard'

const Feed = () => {
    const feed = useSelector((store) => store.feed)
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

    return (
        <div className="flex justify-center my-10">
            {feed && feed.length > 0 ? (
                <UserCard user={feed[0]} />
            ) : (
                <div>Loading...</div>
            )}
        </div>
    )
}

export default Feed