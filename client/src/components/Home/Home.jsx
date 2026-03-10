import { useState } from "react";
import Navbar from "../Navbar/Navbar";
import hero from "../../assets/hero.svg";
import ThreeModel from "../ThreeModel/ThreeModel";

import "./Home.css";

function Home() {
  return (
    <>
      <Navbar />
      <section className="flex flex-col gap-2 justify-center items-center h-screen w-full">
        <img src={hero} alt="Hero" className="mb-5" />
        <p className="text-2xl">We made this platform for you. 😊</p>
        <article className="flex justify-center items-center gap-2 w-full mt-7">
          <a
            className="text-center py-2 px-15 rounded-full border border-black bg-white text-black transition-transform duration-200 hover:scale-105 hover:-rotate-2"
            href="/feed"
          >
            Discover
          </a>
          <a
            className="text-center py-2 px-6 rounded-full border bg-black text-white transition-transform duration-200 hover:scale-105 hover:rotate-2"
            href="/feed"
          >
            Login
          </a>
        </article>
        <article className="relative mt-20 mx-auto">
            <div className="absolute left-1/2 -translate-x-1/2">
                <ThreeModel />
            </div>
        </article>
      </section>
    </>
  );
}

export default Home;
