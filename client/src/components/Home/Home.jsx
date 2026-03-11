import { useRef, useEffect, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "../Navbar/Navbar";
import hero from "../../assets/hero.svg";
import ThreeModel from "../ThreeModel/ThreeModel";
import DiceCard from "../DiceCard/DiceCard";
import heroVideo from "../../assets/hero_video.mp4";

import "./Home.css";

gsap.registerPlugin(ScrollTrigger);

const CARDS = [
  {
    id: 1,
    title: "Dice 20",
    user: "John Doe",
    glow: "#00e5ff",
    image: new URL("../../assets/dice20.png", import.meta.url).href,
  },
  {
    id: 2,
    title: "Dice 12",
    user: "Jane Smith",
    glow: "#a78bfa",
    image: new URL("../../assets/dice12.png", import.meta.url).href,
  },
  {
    id: 3,
    title: "Dice 8",
    user: "Alice Johnson",
    glow: "#f9a825",
    image: new URL("../../assets/dice8.png", import.meta.url).href,
  },
  {
    id: 4,
    title: "Dice 4",
    user: "Bob Brown",
    glow: "#ff5722",
    image: new URL("../../assets/dice4.png", import.meta.url).href,
  },
  {
    id: 5,
    title: "Dice 41",
    user: "dfnqslk",
    glow: "#ff2013",
    image: new URL("../../assets/dice4.png", import.meta.url).href,
  },
  {
    id: 6,
    title: "Dice 41",
    user: "dfnqslk",
    glow: "#ff2013",
    image: new URL("../../assets/dice4.png", import.meta.url).href,
  },
  {
    id: 7,
    title: "Dice 41",
    user: "dfnqslk",
    glow: "#ff2013",
    image: new URL("../../assets/dice4.png", import.meta.url).href,
  },
  {
    id: 8,
    title: "Dice 41",
    user: "dfnqslk",
    glow: "#ff2013",
    image: new URL("../../assets/dice4.png", import.meta.url).href,
  },
  {
    id: 9,
    title: "Dice 41",
    user: "dfnqslk",
    glow: "#ff2013",
    image: new URL("../../assets/dice4.png", import.meta.url).href,
  },
];

function Home() {
  const heroRef = useRef(null);
  const textRef = useRef(null);
  const buttonsRef = useRef(null);
  const modelRef = useRef(null);
  const ctaGRef = useRef(null);
  const cardsRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.fromTo(
      heroRef.current,
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.8, ease: "elastic.out(1, 0.6)", delay: 0.1 }
    )
      .fromTo(
        textRef.current,
        { opacity: 0, y: 20, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6 },
        "-=0.4"
      )
      .fromTo(
        buttonsRef.current,
        { opacity: 0, y: 20, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6 },
        "-=0.3"
      )
      .fromTo(
        modelRef.current,
        { opacity: 0, y: 30, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.7 },
        "-=0.3"
      );

    return () => tl.kill();
  }, []);

  useEffect(() => {
    if (!ctaGRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ctaGRef.current,
        { opacity: 0, y: 30, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ctaGRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  const handleWheel = useCallback((e) => {
    const cards = cardsRef.current;
    if (!cards) return;

    const cardsRect = cards.getBoundingClientRect();
    const inZone = cardsRect.top < window.innerHeight && cardsRect.bottom > 0;
    if (!inZone) return;

    const maxScrollLeft = cards.scrollWidth - cards.clientWidth;
    const atStart = cards.scrollLeft <= 0;
    const atEnd = cards.scrollLeft >= maxScrollLeft - 1;
    const scrollingDown = e.deltaY > 0;
    const scrollingUp = e.deltaY < 0;

    if ((scrollingDown && !atEnd) || (scrollingUp && !atStart)) {
      e.preventDefault();
      cards.scrollLeft += e.deltaY * 1.5;
    }
  }, []);

  useEffect(() => {
    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  return (
    <div className="relative">
      <div className="relative h-screen w-screen z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-h-[90vh] max-w-[90vw] grid-dots-black rounded-4xl overflow-hidden">
          <video
            className="min-w-[100vw] min-h-[100vh] object-cover"
            id="video-field"
            src={heroVideo}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
          ></video>
        </div>
        <div className="flex justify-center items-center mb-10 h-[10vh]">
          <svg
            className="mix-blend-difference mt-25"
            width="66"
            height="28"
            viewBox="0 0 66 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M9.52637 0.123004C12.1558 0.123004 14.3984 1.07037 16.2529 2.96578C17.9989 4.72603 18.9276 6.83034 19.041 9.27828L14.8467 10.9482L14.7041 11.0097C13.2981 11.6568 12.6293 13.2982 13.208 14.7529L14.5186 18.0478C14.8789 18.9541 15.1368 19.602 14.8789 18.9541L16.9482 24.1533L17.0098 24.2968C17.3236 24.9778 17.8867 25.5127 18.583 25.791C19.2793 26.0691 20.0562 26.0692 20.7529 25.792L30.1533 22.0527L30.2959 21.9912C31.7019 21.3441 32.3707 19.7027 31.792 18.248L29.2549 11.8711V0.670856H34.9707V23.0771C34.9707 25.2862 33.1798 27.0771 30.9707 27.0771H29.2549L14.7852 27.2002L7.93652 20.248C7.11711 19.4162 5.71582 20.0053 5.71582 21.1816V27.2002H0V9.79293C7.25328e-05 7.12402 0.927749 4.84822 2.78223 2.96578C4.64933 1.07065 6.89728 0.123108 9.52637 0.123004ZM9.52637 5.92476C8.47225 5.92487 7.57063 6.30573 6.82129 7.06636C6.08465 7.81413 5.71589 8.72289 5.71582 9.79293C5.71582 11.9291 7.42196 13.6609 9.52637 13.6611C10.5805 13.6611 11.4762 13.2876 12.2129 12.54C12.9623 11.7793 13.3379 10.8631 13.3379 9.79293C13.3378 8.72287 12.9623 7.81414 12.2129 7.06636C11.4762 6.30571 10.5806 5.92476 9.52637 5.92476Z"
              fill="white"
            />
            <path d="M35.7559 0.670856C38.9125 0.67112 41.4717 3.22994 41.4717 6.38668V27.0771H35.7559V0.670856Z" fill="white" />
            <path d="M53.7701 7.94218C53.8381 8.02755 53.8804 8.13423 53.8804 8.25175V27.0926H48.1637V8.25175C48.1637 8.15731 48.1904 8.06929 48.2359 7.99394L51.7486 9.50273L51.8092 9.52714C52.1077 9.63695 52.4379 9.62749 52.7301 9.50175C53.022 9.37598 53.255 9.14343 53.3804 8.85136L53.7701 7.94218Z" fill="white" />
            <path d="M61.6895 7.73633H65.5V13.5391H61.6895V17.4072C61.6896 18.4772 62.0574 19.3927 62.7939 20.1533C63.5434 20.9012 64.4457 21.2754 65.5 21.2754V27.0771C62.8707 27.0771 60.6221 26.1363 58.7549 24.2539C56.9004 22.3586 55.9737 20.0761 55.9736 17.4072V0H61.6895V7.73633Z" fill="white" />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M24.0635 8.18648C25.365 7.66866 26.8342 8.26632 27.4131 9.52437L27.4678 9.6523L30.8135 18.0644C31.3311 19.3659 30.7334 20.8341 29.4756 21.413L29.3477 21.4677L20.9365 24.8144C20.3131 25.0625 19.6182 25.0614 18.9951 24.8125C18.3723 24.5636 17.8687 24.0856 17.5879 23.4765L17.5322 23.3476L14.1865 14.9365C13.6688 13.635 14.2666 12.1669 15.5244 11.5878L15.6523 11.5322L24.0635 8.18648Z"
              fill="white"
            />
            <path d="M49.4569 3.04515C49.6683 2.55288 50.2269 2.31681 50.7239 2.49991L50.7735 2.51969L53.9547 3.8859C54.447 4.09731 54.6831 4.65593 54.5 5.15292L54.4803 5.20244L53.1142 8.38364C53.0129 8.61944 52.8251 8.80742 52.5894 8.90886C52.3537 9.0103 52.088 9.01746 51.8472 8.92888L51.7977 8.9091L48.6164 7.54289C48.1241 7.33147 47.888 6.77286 48.0711 6.27586L48.0908 6.22634L49.4569 3.04515Z" fill="white" />
            <path d="M51.617 4.88206C51.6431 4.35124 52.0945 3.94205 52.6254 3.96812C53.1562 3.99419 53.5654 4.44564 53.5393 4.97646L53.5321 5.12346C53.506 5.65428 53.0546 6.06346 52.5237 6.03739C51.9929 6.01133 51.5837 5.55988 51.6098 5.02905L51.617 4.88206Z" fill="white" />
            <path d="M48.6409 5.97646C48.667 5.44564 49.1184 5.03646 49.6493 5.06252C50.1801 5.08859 50.5893 5.54004 50.5632 6.07087L50.556 6.21786C50.5299 6.74868 50.0785 7.15787 49.5476 7.1318C49.0168 7.10573 48.6076 6.65428 48.6337 6.12346L48.6409 5.97646Z" fill="white" />
          </svg>
        </div>

        <section className="flex flex-col gap-2 justify-center items-center h-auto w-full">
          <article className="h-[50vh] flex flex-col justify-center items-center pointer-events-none overflow-none mt-10">
            <img
              ref={heroRef}
              src={hero}
              alt="Hero"
              className="mb-5 invert-100 mix-blend-difference"
              style={{ opacity: 0 }}
            />
            <p
              ref={textRef}
              className="text-2xl text-white mix-blend-difference"
              style={{ opacity: 0 }}
            >
              We made this platform for you. 😊
            </p>
            <article
              ref={buttonsRef}
              className="flex justify-center items-center gap-2 w-full mt-7"
              style={{ opacity: 0 }}
            >
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
          </article>

          <article ref={modelRef} className="h-[80vh] relative mx-auto mt-20" style={{ opacity: 0 }}>
            <div className="absolute left-1/2 -translate-x-1/2 z-1">
              <ThreeModel />
            </div>
            <section
              ref={cardsRef}
              className="absolute mt-60 z-10 flex flex-row gap-10 overflow-x-scroll py-5"
              style={{
                left: "50%",
                transform: "translateX(-50vw)",
                width: "100vw",
                paddingLeft: "2rem",
                paddingRight: "2rem",
                boxSizing: "border-box",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                mixBlendMode: "difference",
              }}
            >
              {CARDS.map((card) => (
                <DiceCard key={card.id} card={card} />
              ))}
            </section>
          </article>

          <article
            ref={ctaGRef}
            className="mx-auto flex flex-col gap-12 justify-center items-center h-[50vh]"
            style={{ opacity: 0 }}
          >
            <svg width="321" height="54" viewBox="0 0 321 54" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M38.4015 28.15C37.8015 26.77 36.8815 25.69 35.6415 24.91C34.4215 24.11 32.9815 23.71 31.3215 23.71C29.7615 23.71 28.3615 24.07 27.1215 24.79C25.8815 25.51 24.9015 26.54 24.1815 27.88C23.4615 29.2 23.1015 30.74 23.1015 32.5C23.1015 34.26 23.4615 35.81 24.1815 37.15C24.9015 38.49 25.8815 39.52 27.1215 40.24C28.3615 40.96 29.7615 41.32 31.3215 41.32C32.7815 41.32 34.0915 41.01 35.2515 40.39C36.4315 39.75 37.3715 38.85 38.0715 37.69C38.7915 36.51 39.2015 35.14 39.3015 33.58H30.4815V31.87H41.5215V33.4C41.4215 35.24 40.9215 36.91 40.0215 38.41C39.1215 39.89 37.9115 41.06 36.3915 41.92C34.8915 42.78 33.2015 43.21 31.3215 43.21C29.3815 43.21 27.6215 42.76 26.0415 41.86C24.4615 40.94 23.2115 39.67 22.2915 38.05C21.3915 36.41 20.9415 34.56 20.9415 32.5C20.9415 30.44 21.3915 28.6 22.2915 26.98C23.2115 25.34 24.4615 24.07 26.0415 23.17C27.6215 22.25 29.3815 21.79 31.3215 21.79C33.5615 21.79 35.5215 22.35 37.2015 23.47C38.8815 24.59 40.1015 26.15 40.8615 28.15H38.4015Z"
                fill="black"
              />
              <path
                d="M162.694 49.5102C162.729 49.5102 163.219 49.465 165.942 48.9007C168.204 48.4319 172.209 47.3901 174.837 46.8235C177.466 46.2569 178.585 46.1453 178.083 47.1015C176.225 50.6402 173.087 52.3134 173.113 52.4648C173.137 52.6025 173.647 52.3571 177.323 50.9856C180.999 49.6142 187.943 46.9946 191.718 45.6118C195.493 44.2289 195.889 44.1621 194.877 45.0832C193.866 46.0043 191.435 47.9152 190.097 48.9872C188.57 50.2108 188.327 50.5748 188.321 50.785C188.319 50.88 188.654 50.7698 191.214 50.0875C193.775 49.4053 198.637 48.1079 201.696 47.3754C204.755 46.6428 205.863 46.5143 207.185 46.382"
                stroke="#060606"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <a className="px-12 py-2 bg-black text-white rounded-full text-lg" href="">
              Gotcha !
            </a>
          </article>
        </section>
      </div>
      <Navbar />
    </div>
  );
}

export default Home;