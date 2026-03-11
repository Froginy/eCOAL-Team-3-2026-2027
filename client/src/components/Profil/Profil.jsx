import Header from '../../component/header.jsx'
import ProfileSection from '../../component/profileSection.jsx'
import DiceGrid from '../../component/dicegrid.jsx'
import './Profil.css'

export default function Profil() {
  return (
    <div className="page-container">
      <Header />
      <ProfileSection />
      <button className="dice-button" type="button">New dice</button>
      <DiceGrid />
    </div>
  )
}
