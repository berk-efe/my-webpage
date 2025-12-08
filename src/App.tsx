import "./index.css";
import ppImage from "./assets/imgs/pp.jpg";

import { useState, useEffect, useRef } from "react";

import fightSprite from "./assets/sprites/fight.png";
import fightSelectedSprite from "./assets/sprites/fight_selected.png";

import actSprite from "./assets/sprites/act.png";
import actSelectedSprite from "./assets/sprites/act_selected.png";

import itemSprite from "./assets/sprites/item.png";
import itemSelectedSprite from "./assets/sprites/item_selected.png";

import mercySprite from "./assets/sprites/mercy.png";
import mercySelectedSprite from "./assets/sprites/mercy_selected.png";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const imagesToLoad = [
      ppImage,
      fightSprite,
      fightSelectedSprite,
      actSprite,
      actSelectedSprite,
      itemSprite,
      itemSelectedSprite,
      mercySprite,
      mercySelectedSprite,
    ];

    const preloadImage = (src: any) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = src;
        img.onload = resolve;
        img.onerror = resolve; // Resolve even on error so the app doesn't get stuck
      });
    };

    // Wait for all images to finish loading
    Promise.all(imagesToLoad.map(preloadImage)).then(() => {
      setTimeout(() => setIsLoading(false), 500);
    });
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-black">
        <h1 className="text-white text-xl md:text-4xl animate-pulse">
          Loading...
        </h1>
      </div>
    );
  } else {
    return (
      <>
        <div className="flex flex-col h-screen bg-black text-white">
          <div
            className="
          mx-auto h-full w-full
          md:max-w-[calc(110vh)] md:aspect-[16/9] md:p-4 md:my-auto
          "
          >
            <div className="flex flex-col h-full space-y-2">
              <div className="border-mgray border-1 h-1/2 flex flex-col items-center justify-end text-xl font-bold">
                <img
                  style={{ filter: "brightness(50%)" }}
                  src={ppImage}
                  alt="me"
                  className="h-[80%]"
                />
              </div>

              <div className="h-1/2 flex flex-col">
                <div className="h-[70%] md:h-[60%] p-4 border-white border-5 md:border-10 overflow-y-auto">
                  <MainBlock />
                </div>

                <div className="h-[15%] md:h-[15%] flex items-center space-x-2 md:space-x-6">
                  <span className="mars text-[16px] md:text-[45px] pr-2 md:pr-12 ">
                    FRISK
                  </span>
                  <div className="mars text-[16px] md:text-[45px] pr-4 md:pr-24">
                    LV 1
                  </div>
                  <div className="mars text-[16px] md:text-[45px]">HP</div>
                  <div className="bg-myellow w-[80px] h-[60%] text-[16px] md:text-[45px]"></div>
                  <div className="mars text-[16px] md:text-[45px]">20 / 20</div>
                </div>

                <div className="h-[10%] md:h-[25%] flex space-x-2">
                  <ActionButtons />
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

function MainBlock() {
  return <p className="text-[14px] md:text-[28px]">* Hello World!</p>;
}

function ActionButtons() {
  const [action_id, setActionId] = useState(0);
  /* 
    useRef is a React hook that gives you a mutable container,
    whose ".current" value persists across renders. 
  */
  const currentIdRef = useRef(action_id);
  currentIdRef.current = action_id;

  const actions = [
    {
      id: 0,
      name: "FIGHT",
      src: fightSprite,
      selectedSrc: fightSelectedSprite,
    },
    {
      id: 1,
      name: "ACT",
      src: actSprite,
      selectedSrc: actSelectedSprite,
    },
    {
      id: 2,
      name: "ITEM",
      src: itemSprite,
      selectedSrc: itemSelectedSprite,
    },
    {
      id: 3,
      name: "MERCY",
      src: mercySprite,
      selectedSrc: mercySelectedSprite,
    },
  ];

  // This effect listens for keyboard presses
  useEffect(() => {
    const handleKeyDown = (e: any) => {
      if (e.key === "ArrowRight") {
        // getting the mod of actions.len gives us our range
        setActionId((prev) => (prev + 1) % actions.length);
      } else if (e.key === "ArrowLeft") {
        // Adding actions.length ensures we don't get a negative number
        setActionId((prev) => (prev - 1 + actions.length) % actions.length);
      } else if (e.key === "z") {
        console.log(currentIdRef.current);
      }
    };

    // Attach the event listener
    window.addEventListener("keydown", handleKeyDown);
    // CLEANUP: Remove the listener when component unmounts
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []); // [] means run once

  return (
    <>
      {actions.map((action) => {
        const isSelected = action_id === action.id;

        return (
          <button
            key={action.name}
            className="w-full"
            onClick={() => setActionId(action.id)}
          >
            <img
              // Ternary operator: if selected, show selectedSrc, else normal src
              src={isSelected ? action.selectedSrc : action.src}
              alt={action.name}
              className="w-full h-auto"
              style={{ imageRendering: "pixelated" }}
            />
          </button>
        );
      })}
    </>
  );
}

export default App;
