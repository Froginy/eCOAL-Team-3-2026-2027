import { useState, useEffect } from "react";
import axios from "axios";
import { Link, Navigate } from "react-router-dom";
import UserAvatar from "../UserAvatar/UserAvatar";

function StackedNumber({ value }) {
  const digits = String(value).split("");
  const rotations = [-6, 3, -2, 5, -4, 2, -3, 6];
  return (
    <div className="flex justify-center items-end gap-0">
      {digits.map((digit, i) => (
        <div
          key={i}
          className="relative w-8 h-8 bg-white border border-black rounded-md flex items-center justify-center text-base font-bold text-black shadow-sm"
          style={{
            rotate: `${rotations[i % rotations.length]}deg`,
            marginLeft: i === 0 ? 0 : "-6px",
            zIndex: i,
          }}
        >
          {digit}
        </div>
      ))}
    </div>
  );
}

export default function ProfileSection({ userId }) {
  const api_url = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}`, Accept: "application/json" };

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  const isOwnProfile = !userId || (currentUserId && String(currentUserId) === String(userId));

  if (!userId && !token) {
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    if (!token) return;
    axios.get(`${api_url}/user`, { headers })
      .then(res => {
        const me = res.data?.data ?? res.data;
        setCurrentUserId(me.id);
      })
      .catch(() => {});
  }, [token]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const endpoint = !userId
          ? `${api_url}/user`
          : `${api_url}/users/${userId}`;
        const res = await axios.get(endpoint, { headers });
        const data = res.data?.data ?? res.data;
        setProfile(data);
      } catch {
        setProfile(null);
      }
    };

    const fetchSubscription = async () => {
      if (!userId || !token) return;
      try {
        const [followersRes, meRes] = await Promise.all([
          axios.get(`${api_url}/users/${userId}/followers`, { headers }),
          axios.get(`${api_url}/user`, { headers }),
        ]);
        const me = meRes.data?.data ?? meRes.data;
        const followers = followersRes.data?.data ?? followersRes.data ?? [];
        setIsSubscribed(followers.some((f) => f.id === me.id));
      } catch {
        setIsSubscribed(false);
      }
    };

    fetchProfile();
    fetchSubscription();
  }, [userId]);

  const handleFollow = async () => {
    setLoading(true);
    try {
      await axios.post(`${api_url}/users/${userId}/subscribe`, {}, { headers });
      setIsSubscribed(true);
      setProfile((prev) => ({ ...prev, followers_count: (prev?.followers_count ?? 0) + 1 }));
    } catch {}
    setLoading(false);
  };

  const handleUnfollow = async () => {
    setLoading(true);
    try {
      await axios.delete(`${api_url}/users/${userId}/subscribe`, { headers });
      setIsSubscribed(false);
      setProfile((prev) => ({ ...prev, followers_count: Math.max(0, (prev?.followers_count ?? 0) - 1) }));
    } catch {}
    setLoading(false);
  };

  return (
    <div className="profile">
      <div className="profile-left">
        <div className="relative profile-image" role="img" aria-label="Profile">
          <UserAvatar
            name={profile?.name ?? ""}
            size={120}
            className="p-2 rotate-10 object-cover aspect-square"
            hover={false}
            to={false}
          />
        </div>
      </div>

      <div className="profile-right flex justify-center items-center">
        <div className="profile-stats flex gap-6">
          <div className="stat flex justify-center flex-col gap-2">
            <StackedNumber value={profile?.followers_count ?? 0} />
            <div className="stat-label text-[11px] font-semibold tracking-widest uppercase text-black/40">
              Followers
            </div>
          </div>
          <div className="stat flex flex-col justify-center gap-2">
            <StackedNumber value={profile?.following_count ?? 0} />
            <div className="stat-label text-[11px] font-semibold tracking-widest uppercase text-black/40">
              Following
            </div>
          </div>
        </div>

        <div className="mt-3 mx-auto">
          {isOwnProfile ? (
            <Link to="/settings" className="follow-button">Settings</Link>
          ) : isSubscribed ? (
            <button className="follow-button" type="button" disabled={loading} onClick={handleUnfollow}>
              Unfollow
            </button>
          ) : (
            <button className="follow-button" type="button" disabled={loading} onClick={handleFollow}>
              + Follow
            </button>
          )}
        </div>
      </div>

      <div className="profile-bio">{profile?.bio ?? ""}</div>
    </div>
  );
}