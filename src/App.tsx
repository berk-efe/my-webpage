import "./index.css";
import ppImage from "./assets/imgs/pp.jpg";

import { useState, useEffect } from "react";

import fightSprite from "./assets/sprites/fight.png";
import fightSelectedSprite from "./assets/sprites/fight_selected.png";

import actSprite from "./assets/sprites/act.png";
import actSelectedSprite from "./assets/sprites/act_selected.png";

import itemSprite from "./assets/sprites/item.png";
import itemSelectedSprite from "./assets/sprites/item_selected.png";

import mercySprite from "./assets/sprites/mercy.png";
import mercySelectedSprite from "./assets/sprites/mercy_selected.png";

type Mode = "NONE" | "ACT" | "ITEM";

type Action = {
  id: number;
  name: string;
  src: string;
  selectedSrc: string;
};

type Item = {
  id: number;
  title: string;
  output: string;
};

const ACT_ITEMS: Item[] = [
  {
    id: 0,
    title: "Check",
    output: "Just a nerd.",
  },
  {
    id: 1,
    title: "Call",
    output: "ring... ring... \n no one picked up.",
  },
];

const ITEMS_ITEMS: Item[] = [
  {
    id: 0,
    title: "Hobbies",
    output: "I like...",
  },
  {
    id: 1,
    title: "Resources",
    output: "Here are some cool stuff",
  },
  {
    id: 2,
    title: "Projects",
    output: "It's bold of you to assume i finished any projects.",
  },
];

const ACTIONS: Action[] = [
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

function App() {
  const [isLoading, setIsLoading] = useState(true);

  const [mode, setMode] = useState<Mode>("NONE");
  const [text, setText] = useState<string>("* A weird creature appears...");
  const [focusedAction, setFocusedAction] = useState<number>(0); // 0..ACTIONS.length-1
  const [submenuIndex, setSubmenuIndex] = useState<number>(0); // index inside ACT/ITEM

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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (mode === "NONE") {
        if (e.key === "ArrowRight")
          setFocusedAction((p) => (p + 1) % ACTIONS.length);
        else if (e.key === "ArrowLeft")
          setFocusedAction((p) => (p - 1 + ACTIONS.length) % ACTIONS.length);
        else if (e.key.toLowerCase() === "z" || e.key === "Enter") {
          if (focusedAction === 1) {
            // ACT
            setMode("ACT");
            setSubmenuIndex(0);
            setText("* What will you do?");
          } else if (focusedAction === 2) {
            // ITEM
            setMode("ITEM");
            setSubmenuIndex(0);
            setText("* Choose an item.");
          } else if (focusedAction === 0) {
            window.close();
          } else {
            // MERCY isnt implemented
            setText("* You hesitate.");
          }
        }
      } else {
        // In submenu
        const items = mode === "ACT" ? ACT_ITEMS : ITEMS_ITEMS;
        if (e.key === "ArrowUp")
          setSubmenuIndex((p) => (p - 1 + items.length) % items.length);
        else if (e.key === "ArrowDown")
          setSubmenuIndex((p) => (p + 1) % items.length);
        else if (e.key.toLowerCase() === "z" || e.key === "Enter") {
          const chosen = items[submenuIndex];
          setText(`* ${chosen.output}`);
          setMode("NONE");
        } else if (e.key.toLowerCase() === "x" || e.key === "Escape") {
          setMode("NONE");
          setText("* A weird creature appears...");
        } else if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
          // Ignore left/right in submenu
          // FOR NOW HEH
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mode, focusedAction, submenuIndex]);

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
                  {mode === "NONE" ? <MainBlock text={text} /> : null}
                  {mode !== "NONE" && (
                    <Submenu
                      mode={mode}
                      index={submenuIndex}
                      onSelect={(i) => setSubmenuIndex(i)}
                    />
                  )}
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
                  <ActionButtons
                    focusedAction={focusedAction}
                    setFocusedAction={setFocusedAction}
                    onConfirm={() => {
                      if (focusedAction === 1) {
                        setMode("ACT");
                        setSubmenuIndex(0);
                        setText("* What will you do?");
                      } else if (focusedAction === 2) {
                        setMode("ITEM");
                        setSubmenuIndex(0);
                        setText("* Choose an item.");
                      } else {
                        setText("* You hesitate.");
                      }
                    }}
                    disabled={mode !== "NONE"}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

function MainBlock({ text }: { text: string }) {
  return (
    <p
      style={{ wordSpacing: "10px" }}
      className="text-[14px] md:text-[28px] whitespace-pre-wrap"
    >
      {text}
    </p>
  );
}

function Submenu({
  mode,
  index,
  onSelect,
}: {
  mode: Mode;
  index: number;
  onSelect: (i: number) => void;
}) {
  const items = mode === "ACT" ? ACT_ITEMS : ITEMS_ITEMS;
  return (
    <div className="mt-4 grid grid-cols-1 gap-1">
      {items.map((it, i) => {
        const selected = i === index;
        return (
          <button
            key={`${mode}-${it.id}`}
            className={`text-left mars text-[14px] md:text-[24px] px-2 py-1 ${
              selected ? "text-myellow" : "text-white"
            }`}
            onClick={() => onSelect(i)}
          >
            * {it.title}
          </button>
        );
      })}
    </div>
  );
}

function ActionButtons({
  focusedAction,
  setFocusedAction,
  onConfirm,
  disabled,
}: {
  focusedAction: number;
  setFocusedAction: (id: number) => void;
  onConfirm: () => void;
  disabled?: boolean;
}) {
  return (
    <>
      {ACTIONS.map((action) => {
        const isSelected = focusedAction === action.id;
        return (
          <button
            key={action.name}
            className="w-full"
            onClick={() => setFocusedAction(action.id)}
            disabled={disabled}
          >
            <img
              src={isSelected ? action.selectedSrc : action.src}
              alt={action.name}
              className={`w-full h-auto ${disabled ? "opacity-60" : ""}`}
              style={{ imageRendering: "pixelated" }}
              onDoubleClick={onConfirm}
            />
          </button>
        );
      })}
    </>
  );
}

export default App;
