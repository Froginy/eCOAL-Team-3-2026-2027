
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function ProfileSection({ userId }) {

  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;
    const fetchSubscription = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`/api/users/${userId}/subscribe`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        });
        setIsSubscribed(res.data.subscribed);
      } catch (e) {
        setIsSubscribed(false);
      }
    };
    fetchSubscription();
  }, [userId]);

  const handleFollow = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`/api/users/${userId}/subscribe`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });
      setIsSubscribed(true);
    } catch (e) {}
    setLoading(false);
  };

  const handleUnfollow = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/users/${userId}/subscribe`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });
      setIsSubscribed(false);
    } catch (e) {}
    setLoading(false);
  };

  return (
    <div className="profile">
      <div className="profile-left">
        <div className="profile-image" role="img" aria-label="Profile" />
      </div>

      <div className="profile-right">
        <div className="profile-stats">
          <div className="stat">
            <div className="stat-number">123</div>
            <div className="stat-label">Followers</div>
          </div>
          <div className="stat">
            <div className="stat-number">23</div>
            <div className="stat-label">Following</div>
          </div>
        </div>

        {isSubscribed ? (
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
        {userId ? `Profil de l'utilisateur #${userId}` : 'Cupidatat aute laborum aliqua consectetur voluptate laborum ipsum pariatur est deserunt enim eiusmod adipisicing duis.'}
      </div>
    </div>

  );
}