// "use client";

// import { useEffect, useRef, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { useTranslation } from "react-i18next";
// import i18n from "@/lib/i18n";
// import { Settings } from "lucide-react";
// import { useTheme } from "next-themes";
// import ThemeToggle from "./ThemeToggle";

// const languages = [
//   { code: "uz", label: "O‘zbek" },
//   { code: "en", label: "English" },
//   { code: "ru", label: "Русский" },
// ];

// export default function FloatingAssistant() {
//   const { t } = useTranslation();
//   const { theme } = useTheme();
//   const [isOpen, setIsOpen] = useState(false);
//   const cardRef = useRef<HTMLDivElement | null>(null);
//   const spotRef = useRef<HTMLDivElement | null>(null);

//   // Scrollni to‘xtatish
//   useEffect(() => {
//     if (isOpen) {
//       window.scrollTo({ top: 0, behavior: "smooth" });
//       document.body.style.overflow = "hidden";
//     } else {
//       document.body.style.overflow = "auto";
//     }
//     return () => {
//       document.body.style.overflow = "auto";
//     };
//   }, [isOpen]);

//   // 🔁 3D Tilt + Spotlight effekt
//   useEffect(() => {
//     const card = cardRef.current;
//     const spot = spotRef.current;
//     if (!card || !spot) return;

//     const handleMouseMove = (e: MouseEvent) => {
//       const rect = card.getBoundingClientRect();
//       const x = e.clientX - rect.left;
//       const y = e.clientY - rect.top;

//       // Spot joylashuvi
//       spot.style.left = `${x - 80}px`;
//       spot.style.top = `${y - 80}px`;
//       spot.style.opacity = "1";

//       // Tilt effekti
//       const centerX = rect.width / 2;
//       const centerY = rect.height / 2;
//       const rotateX = -(y - centerY) / 20;
//       const rotateY = (x - centerX) / 20;

//       card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
//     };

//     const handleMouseLeave = () => {
//       spot.style.opacity = "0";
//       card.style.transform = `rotateX(0deg) rotateY(0deg)`;
//     };

//     card.addEventListener("mousemove", handleMouseMove);
//     card.addEventListener("mouseleave", handleMouseLeave);

//     return () => {
//       card.removeEventListener("mousemove", handleMouseMove);
//       card.removeEventListener("mouseleave", handleMouseLeave);
//     };
//   }, []);

//   return (
//     <>
     
//       <motion.div
//         drag
//         dragConstraints={{ left: 0, right: 1000, top: 0, bottom: 1000 }}
//         className="fixed bottom-6 right-6 z-50 cursor-move"
//         whileHover={{ scale: 1.05 }}
//         animate={{ y: [0, -5, 0] }}
//         transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
//       >
//         <button
//           onClick={() => setIsOpen(true)}
//           className="w-14 h-14 rounded-full backdrop-blur-md bg-white/10 dark:bg-black/20 text-white flex items-center justify-center shadow-xl border border-white/20"
//         >
//           <Settings className="w-6 h-6" />
//         </button>
//       </motion.div>

 
//       <AnimatePresence>
//         {isOpen && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm w-full h-[100vh]"
//             onClick={() => setIsOpen(false)}
//           >
//             <div
//               className="relative perspective-[1000px]"
//               onClick={(e) => e.stopPropagation()}
//             >
        
//               <div
//                 ref={spotRef}
//                 className="pointer-events-none absolute w-40 h-40 rounded-full bg-white/10 blur-2xl opacity-0 transition-opacity duration-200 z-0"
//               />

//               <motion.div
//                 ref={cardRef}
//                 initial={{ scale: 0.9, y: 50, opacity: 0 }}
//                 animate={{ scale: 1, y: 0, opacity: 1 }}
//                 exit={{ scale: 0.95, opacity: 0 }}
//                 transition={{ duration: 0.6, ease: "easeOut" }}
//                 className="relative z-10 w-[320px] md:w-[400px] p-6 rounded-2xl border border-white/20 bg-white/10 dark:bg-black/40 text-white shadow-2xl backdrop-blur-[20px] transition-transform duration-200 ease-out"
//               >
//                 <h2 className="text-xl font-bold mb-4">{t("welcome")}</h2>

//                 <div className="space-y-4">
           
//                   <div>
//                     <p className="text-sm mb-1">🌐 Tilni tanlang:</p>
//                     <div className="flex gap-2 flex-wrap">
//                       {languages.map((lang) => (
//                         <button
//                           key={lang.code}
//                           onClick={() => i18n.changeLanguage(lang.code)}
//                           className={`px-3 py-1 rounded-full text-sm transition ${
//                             i18n.language === lang.code
//                               ? "bg-white text-black font-semibold"
//                               : "bg-white/20 hover:bg-white/30"
//                           }`}
//                         >
//                           {lang.label}
//                         </button>
//                       ))}
//                     </div>
//                   </div>

         
//                   <div>
//                     <p className="text-sm mb-1">🌓 Mavzuni tanlang:</p>
//                     <ThemeToggle />
//                   </div>
//                 </div>
//               </motion.div>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </>
//   );
// }




"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import i18n from "@/lib/i18n";
import { Settings } from "lucide-react";
import { useTheme } from "next-themes";
import ThemeToggle from "./ThemeToggle";

const languages = [
  { code: "uz", label: "O‘zbek" },
  { code: "en", label: "English" },
  { code: "ru", label: "Русский" },
];

export default function FloatingAssistant() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const spotRef = useRef<HTMLDivElement | null>(null);
  const [currentLang, setCurrentLang] = useState<string | null>(null); 

  useEffect(() => {
    setCurrentLang(i18n.language);
  }, []);


  useEffect(() => {
    if (isOpen) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);


  useEffect(() => {
    const card = cardRef.current;
    const spot = spotRef.current;
    if (!card || !spot) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      spot.style.left = `${x - 80}px`;
      spot.style.top = `${y - 80}px`;
      spot.style.opacity = "1";

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = -(y - centerY) / 20;
      const rotateY = (x - centerX) / 20;

      card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };

    const handleMouseLeave = () => {
      spot.style.opacity = "0";
      card.style.transform = `rotateX(0deg) rotateY(0deg)`;
    };

    card.addEventListener("mousemove", handleMouseMove);
    card.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      card.removeEventListener("mousemove", handleMouseMove);
      card.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <>
      <motion.div
        drag
        dragConstraints={{ left: 0, right: 1000, top: 0, bottom: 1000 }}
        className="fixed bottom-6 right-6 z-50 cursor-move"
        whileHover={{ scale: 1.05 }}
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full backdrop-blur-md bg-white/10 dark:bg-black/20 text-white flex items-center justify-center shadow-xl border border-white/20"
        >
          <Settings className="w-6 h-6" />
        </button>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm w-full h-[100vh]"
            onClick={() => setIsOpen(false)}
          >
            <div
              className="relative perspective-[1000px]"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                ref={spotRef}
                className="pointer-events-none absolute w-40 h-40 rounded-full bg-white/10 blur-2xl opacity-0 transition-opacity duration-200 z-0"
              />

              <motion.div
                ref={cardRef}
                initial={{ scale: 0.9, y: 50, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative z-10 w-[320px] md:w-[400px] p-6 rounded-2xl border border-white/20 bg-white/10 dark:bg-black/40 text-white shadow-2xl backdrop-blur-[20px] transition-transform duration-200 ease-out"
              >
                <h2 className="text-xl font-bold mb-4">{t("welcome")}</h2>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm mb-1">🌐 Tilni tanlang:</p>
                    <div className="flex gap-2 flex-wrap">
                      {currentLang &&
                        languages.map((lang) => (
                          <button
                            key={lang.code}
                            onClick={() => {
                              i18n.changeLanguage(lang.code)
                              setCurrentLang(lang.code)
                            }}
                            className={`px-3 py-1 rounded-full text-sm transition ${
                              currentLang === lang.code
                                ? "bg-white text-black font-semibold"
                                : "bg-white/20 hover:bg-white/30"
                            }`}
                          >
                            {lang.label}
                          </button>
                        ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm mb-1">🌓 Mavzuni tanlang:</p>
                    <ThemeToggle />
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
