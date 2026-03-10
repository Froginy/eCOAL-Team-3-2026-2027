import Header from '../component/header.jsx'
import ProfileSection from '../component/profileSection.jsx'
import DiceGrid from '../component/dicegrid.jsx'
import '../css/profile.css'

export default function ProfilePage() {
  return (
    <div className="page-container">
      <Header />
      <ProfileSection />
      <button className="dice-button" type="button">New dice</button>
      <DiceGrid />
    </div>
  )
}
