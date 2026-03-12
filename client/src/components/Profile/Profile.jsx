import { useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../DiceHeader/DiceHeader";
import ProfileSection from "../ProfileSection/ProfileSection";
import DiceGrid from "../DiceGrid/DiceGrid";
import NewDiceDrawer from "../Drawer/Drawer";
import Navbar from "../Navbar/Navbar";
import "./Profile.css";

export default function Profile() {
  const { id } = useParams();
  const [drawerOpen, setDrawerOpen] = useState(false);

<<<<<<< HEAD
=======
  const api_url = import.meta.env.VITE_API_URL;

>>>>>>> 27e719a (modif)
  return (
    <div className="page-container">
      <Header userId={id} />
      <ProfileSection userId={id} />
      {!id && (
        <button
          className="dice-button flex justify-center items-center gap-2"
          type="button"
          onClick={() => setDrawerOpen(true)}
        >
          <svg
            width="15"
            height="14"
            viewBox="0 0 15 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.7653 0.00988828C12.0805 -0.102959 13.24 0.76417 13.4161 1.96609L13.4299 2.08743L14.1342 9.9946C14.2431 11.218 13.3003 12.3054 12.0075 12.4805L11.8774 12.4946L3.3774 13.2244C2.74756 13.2784 2.12156 13.1061 1.62853 12.7423C1.13543 12.3783 0.812247 11.8505 0.726611 11.2682L0.712861 11.1468L0.00855445 3.23966C-0.10024 2.01627 0.84251 0.928864 2.13524 0.753728L2.26536 0.739616L10.7653 0.00988828ZM6.31371 3.53736L6.55197 6.21232L3.67583 6.45924L3.75528 7.35122L6.63142 7.1043L6.86968 9.77925L7.82904 9.69689L7.59078 7.02194L10.4659 6.7751L10.3865 5.88313L7.51133 6.12996L7.27307 3.455L6.31371 3.53736Z"
              fill="white"
            />
          </svg>
          New dice
        </button>
      )}
      <DiceGrid userId={id} isOwnProfile={!id} />

      <NewDiceDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      <Navbar />
    </div>
  );
}
