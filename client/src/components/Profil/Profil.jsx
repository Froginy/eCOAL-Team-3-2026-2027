import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../DiceHeader/DiceHeader';
import ProfileSection from '../ProfilSection/ProfilSection';
import DiceGrid from '../DiceGrid/DiceGrid';
import NewDiceDrawer from '../Drawer/Drawer';
import './Profil.css';
import '../../css/profile.css'

export default function Profil() {
  const { id } = useParams();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="page-container">
      <Header />
      <ProfileSection userId={id} />
      <button
        className="dice-button"
        type="button"
        onClick={() => setDrawerOpen(true)}
      >
        New dice
      </button>
      <DiceGrid />

      <NewDiceDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  );
}