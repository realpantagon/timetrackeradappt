import React, { useEffect, useState } from 'react';
import { getUserProfile } from '../api/getuserprofile';

const Profile = ({ username, big = false, showThemeSwitch = false, darkMode, setDarkMode }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!username) return;
    setLoading(true);
    getUserProfile(username)
      .then((data) => {
        setProfile(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [username]);

  if (loading) return <div>Loading profile...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!profile) return <div>No profile found.</div>;

  const fields = profile.fields;
  const profilePic = fields['Profile Picture'] && (big
    ? fields['Profile Picture'][0]?.thumbnails?.large?.url || fields['Profile Picture'][0]?.url
    : fields['Profile Picture'][0]?.thumbnails?.small?.url);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: big ? '1.5rem' : '0.5rem' }}>
      {profilePic && (
        <img
          src={profilePic}
          alt="Profile"
          style={{ width: big ? 64 : 36, height: big ? 64 : 36, borderRadius: '50%', objectFit: 'cover', boxShadow: big ? '0 2px 8px #0002' : undefined }}
        />
      )}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <div style={{ 
          fontWeight: 'bold', 
          fontSize: big ? '1.3em' : undefined,
          color: darkMode ? '#f3f4f6' : '#1f2937'
        }}>
          {fields['Full Name']}
        </div>
        <div style={{ 
          fontSize: big ? '1em' : '0.8em', 
          color: darkMode ? '#9ca3af' : '#6b7280', 
          marginTop: 2 
        }}>
          {fields['Roles']}
        </div>
      </div>
    </div>
  );
};

export default Profile;
