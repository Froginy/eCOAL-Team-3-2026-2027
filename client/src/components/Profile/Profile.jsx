import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../DiceHeader/DiceHeader';
import ProfileSection from '../ProfileSection/ProfileSection';
import DiceGrid from '../DiceGrid/DiceGrid';
import NewDiceDrawer from '../Drawer/Drawer';
import Navbar from '../Navbar/Navbar';
import './Profile.css';

export default function Profile() {
  const { id } = useParams();
  const [drawerOpen, setDrawerOpen] = useState(false);





  return (
    <div className="page-container">
      <Header userId={id} />
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

      <Navbar />
    </div>
  );
}