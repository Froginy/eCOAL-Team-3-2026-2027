import { useState } from "react";

function DiceCard({ name, images,color, collection,id }) {



  return (
    <div className="relative shrink-0" style={{ width: 300 }}>
      
      <div
        className="inverted bg-black/80 w-full h-full p-3.5"
        style={{
          filter: `drop-shadow(0 0 0.5rem ${color})`,
        }}
      >
        <div className="mb-3.5 flex items-center justify-center bg-[#f0f0f0] h-[50%] rounded-4xl">
          <img
            src={`http://127.0.0.1:8000/${images?.[0]?.image_url}`}
alt={name}
            className="w-full h-full object-cover rounded-4xl"
          />
        </div>
        <div className="mb-2.5 text-[20px] font-semibold tracking-tight text-white">
          {name}
        </div>
      </div>

      <div className="absolute bottom-8 right-8 z-10">
        <svg width="30" height="30" viewBox="0 0 23 23" fill="none">
          <path
            d="M2.69986 22.7328L-3.59763e-06 20.033L16.1992 3.83381L1.34993 3.83381L1.34993 2.24128e-06H22.7328V21.3829L18.899 21.3829L18.899 6.53367L2.69986 22.7328Z"
            fill="black"
          />
        </svg>
      </div>

      <div className="absolute -bottom-2 left-3.5 z-10 flex items-center gap-2 rounded-full bg-white shadow-md px-3.5 py-1.75">
        <div className="flex h-6.5 w-6.5 items-center justify-center rounded-full bg-white">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="8" r="4" fill="#555" />
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" fill="#555" />
          </svg>
        </div>
        <span className="text-[14px] font-medium text-[#222]">
          {id}
        </span>
      </div>

    </div>
  );
}

export default DiceCard;