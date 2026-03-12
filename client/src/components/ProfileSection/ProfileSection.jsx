import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, Navigate } from 'react-router-dom';

function StackedNumber({ value }) {
  const digits = String(value).split('');
  const rotations = [-6, 3, -2, 5, -4, 2, -3, 6];
  return (
    <div className="flex justify-center items-end gap-0">
      {digits.map((digit, i) => (
        <div
          key={i}
          className="relative w-8 h-8 bg-white border border-black rounded-md flex items-center justify-center text-base font-bold text-black shadow-sm"
          style={{
            rotate: `${rotations[i % rotations.length]}deg`,
            marginLeft: i === 0 ? 0 : '-6px',
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
  const token = localStorage.getItem('token');
  const isOwnProfile = !userId;

  if (isOwnProfile && !token) {
    return <Navigate to="/login" replace />;
  }

  const [profile, setProfile]           = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading]           = useState(false);

  useEffect(() => {
    const headers = { Authorization: `Bearer ${token}`, Accept: 'application/json' };

    const fetchProfile = async () => {
      try {
        const endpoint = isOwnProfile ? api_url + '/user' : api_url + `/users/${userId}`;
        const res = await axios.get(endpoint, { headers });
        setProfile(res.data);
      } catch {
        setProfile(null);
      }
    };

    const fetchSubscription = async () => {
      if (isOwnProfile) return;
      try {
        const res = await axios.get(api_url + `/users/${userId}/subscribe`, { headers });
        setIsSubscribed(res.data.subscribed);
      } catch {
        setIsSubscribed(false);
      }
    };

    fetchProfile();
    fetchSubscription();
  }, [userId, isOwnProfile]);

  const handleFollow = async () => {
    setLoading(true);
    try {
      await axios.post(`${api_url}/users/${userId}/subscribe`, {}, {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      });
      setIsSubscribed(true);
    } catch {}
    setLoading(false);
  };

  const handleUnfollow = async () => {
    setLoading(true);
    try {
      await axios.delete(`${api_url}/users/${userId}/subscribe`, {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      });
      setIsSubscribed(false);
    } catch {}
    setLoading(false);
  };

  return (
    <div className="profile">
      <div className="profile-left">
        <div className="profile-image" role="img" aria-label="Profile" />
      </div>

      <div className="profile-right">
        <div className="profile-stats flex items-end gap-6">
          <div className="stat flex flex-col gap-2">
            <StackedNumber value={profile?.followers_count ?? 0} />
            <div className="stat-label text-[11px] font-semibold tracking-widest uppercase text-black/40">
              Followers
            </div>
          </div>
          <div className="stat flex flex-col gap-2">
            <StackedNumber value={profile?.following_count ?? 0} />
            <div className="stat-label text-[11px] font-semibold tracking-widest uppercase text-black/40">
              Following
            </div>
          </div>
        </div>

        {isOwnProfile ? (
          <Link to="/settings" className="follow-button">
            Settings
          </Link>
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

      <div className="profile-bio">
        {profile?.bio ?? ''}
      </div>
    </div>
  );
}