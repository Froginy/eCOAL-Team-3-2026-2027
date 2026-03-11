export default function ProfileSection() {
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

        <button className="follow-button" type="button">+ Follow</button>
      </div>

      <div className="profile-bio">
        Cupidatat aute laborum aliqua consectetur voluptate laborum ipsum pariatur est deserunt enim eiusmod adipisicing duis.
      </div>
    </div>
  )
}
