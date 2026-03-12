import Header from '../../component/header.jsx'
import ProfileSection from '../../component/profileSection.jsx'
import DiceGrid from '../../component/dicegrid.jsx'
import './Profil.css'

import { useParams } from 'react-router-dom';

export default function Profil() {
  const { id } = useParams();
  return (
    <div className="page-container">
      <Header />
      <ProfileSection userId={id} />
      <button className="dice-button" type="button">New dice</button>
      <DiceGrid />
    </div>
  );
}