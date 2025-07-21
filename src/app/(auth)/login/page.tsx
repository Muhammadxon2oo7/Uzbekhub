// "use client";

// import { useState, useEffect, useRef } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Icons } from "@/components/icons";
// import { motion } from "framer-motion";
// import { EyeIcon, EyeOff } from "lucide-react";

// export default function LoginPage() {
//   const [identifier, setIdentifier] = useState("");
//   const [password, setPassword] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

//   const cardRef = useRef<HTMLDivElement | null>(null);
//   const spotRef = useRef<HTMLDivElement | null>(null);

//   useEffect(() => {
//     const card = cardRef.current;
//     const spot = spotRef.current;
//     if (!card || !spot) return;

//     const handleMouseMove = (e: MouseEvent) => {
//       const rect = card.getBoundingClientRect();
//       const x = e.clientX - rect.left;
//       const y = e.clientY - rect.top;
//       spot.style.left = `${x - 80}px`;
//       spot.style.top = `${y - 80}px`;
//       spot.style.opacity = "1";

//       const centerX = rect.width / 2;
//       const centerY = rect.height / 2;
//       const rotateX = -(y - centerY) / 40;
//       const rotateY = (x - centerX) / 40;
//       card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
//     };

//     const handleMouseLeave = () => {
//       spot.style.opacity = "0";
//       card.style.transform = `rotateX(-10deg) rotateY(-5deg)`;
//     };

//     card.addEventListener("mousemove", handleMouseMove);
//     card.addEventListener("mouseleave", handleMouseLeave);

//     return () => {
//       card.removeEventListener("mousemove", handleMouseMove);
//       card.removeEventListener("mouseleave", handleMouseLeave);
//     };
//   }, []);

//   const handleLogin = () => {
//     setIsLoading(true);
//     setTimeout(() => {
//       alert("Muvaffaqiyatli tizimga kirdingiz!");
//       setIsLoading(false);
//     }, 1500);
//   };

//   return (
//     <div className="h-screen bg-muted px-4 w-full bg-radial-[at_50%_60%] from-[var(--bggradient)] via-[var(--bggradientmid)] to-[var(--bgbradientstart)] to-90% pt-[60px] flex items-center justify-center overflow-hidden">
//       <div className="relative perspective-[1000px]">
//         <div
//           ref={spotRef}
//           className="pointer-events-none absolute w-40 h-40 rounded-full bg-white/10 blur-2xl opacity-0 transition-opacity duration-200 z-0"
//         ></div>

//         <motion.div
//           ref={cardRef}
//           initial={{ scale: 0, y: 200, rotateX: 0, rotateY: 0, opacity: 0 }}
//           animate={{ scale: 1, y: 0, rotateX: -10, rotateY: -5, opacity: 1 }}
//           transition={{ duration: 0.8, ease: "easeOut" }}
//           className="relative z-10 transition-transform duration-200 ease-out will-change-transform border border-white/20 py-[60px] px-[50px] rounded-2xl bg-[#f7f7f726] backdrop-blur-[20px] md:w-[500px] w-full shadow-2xl"
//         >
//           <CardHeader>
//             <CardTitle className="text-2xl text-primary text-center">
//               Tizimga kirish
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="grid w-full items-center gap-2">
//               <Label htmlFor="identifier" className="text-primary">
//                 Email yoki foydalanuvchi nomi
//               </Label>
//               <Input
//                 id="identifier"
//                 type="text"
//                 placeholder="example@gmail.com yoki yourname"
//                 value={identifier}
//                 onChange={(e) => setIdentifier(e.target.value)}
//                 className="focus-visible:ring-2 focus-visible:ring-primary border border-input focus:border-primary"
//               />
//             </div>

//             <div className="grid w-full items-center gap-2 relative">
//               <Label htmlFor="password" className="text-primary">
//                 Parol
//               </Label>
//               <Input
//                 id="password"
//                 type={showPassword ? "text" : "password"}
//                 placeholder="••••••••"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="focus-visible:ring-2 focus-visible:ring-primary border border-input focus:border-primary pr-10"
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute top-[50%] right-3 text-muted-foreground"
//               >
//                 {showPassword ? (
//                   <EyeOff className="h-5 w-5" />
//                 ) : (
//                   <EyeIcon className="h-5 w-5" />
//                 )}
//               </button>
//             </div>

//             <Button
//               disabled={!identifier || !password || isLoading}
//               onClick={handleLogin}
//               className="w-full"
//             >
//               {isLoading && <Icons.spinner className="animate-spin w-4 h-4 mr-2" />} Tizimga kirish
//             </Button>
//           </CardContent>
//         </motion.div>
//       </div>
//     </div>
//   );
// }


"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/icons";
import { motion } from "framer-motion";
import { EyeIcon, EyeOff, X } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const { t } = useTranslation("");

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const cardRef = useRef<HTMLDivElement | null>(null);
  const spotRef = useRef<HTMLDivElement | null>(null);

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
      const rotateX = -(y - centerY) / 40;
      const rotateY = (x - centerX) / 40;
      card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };

    const handleMouseLeave = () => {
      spot.style.opacity = "0";
      card.style.transform = `rotateX(-10deg) rotateY(-5deg)`;
    };

    card.addEventListener("mousemove", handleMouseMove);
    card.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      card.removeEventListener("mousemove", handleMouseMove);
      card.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const handleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      alert(t("login_success"));
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-muted px-2 w-full bg-radial-[at_50%_60%] from-[var(--bggradient)] via-[var(--bggradientmid)] to-[var(--bgbradientstart)] to-90% pt-[40px] flex items-center justify-center overflow-auto">
      <div className="relative perspective-[1000px] w-full flex justify-center">
        <div
          ref={spotRef}
          className="pointer-events-none absolute w-40 h-40 rounded-full bg-white/10 blur-2xl opacity-0 transition-opacity duration-200 z-0"
        ></div>

        <motion.div
          ref={cardRef}
          initial={{ scale: 0, y: 200, rotateX: 0, rotateY: 0, opacity: 0 }}
          animate={{ scale: 1, y: 0, rotateX: -10, rotateY: -5, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 transition-transform duration-200 ease-out will-change-transform border border-white/20 py-8 px-4 sm:py-12 sm:px-8 rounded-2xl bg-[#f7f7f726] backdrop-blur-[20px] w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto"
        >
          <Link href={'/'}>
            <Button className='absolute top-4 right-4 cursor-pointer' variant={'ghost'}>
                <X/>
            </Button>
          </Link>
          <CardHeader>
            <CardTitle className="text-2xl text-primary text-center">
              {t("auth.login.title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid w-full items-center gap-2">
              <Label htmlFor="identifier" className="text-primary">
                {t("auth.login.identifier_label")}
              </Label>
              <Input
                id="identifier"
                type="text"
                placeholder={t("auth.login.identifier_placeholder")}
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="focus-visible:ring-2 focus-visible:ring-primary border border-input focus:border-primary w-full sm:w-[400px] mx-auto"
              />
            </div>

            <div className="grid w-full items-center gap-2 relative">
              <Label htmlFor="password" className="text-primary">
                {t("auth.login.password_label")}
              </Label>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder={t("auth.login.password_placeholder")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="focus-visible:ring-2 focus-visible:ring-primary border border-input focus:border-primary pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-[50%] right-3 text-muted-foreground"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>

            <Button
              disabled={!identifier || !password || isLoading}
              onClick={handleLogin}
              className="w-full"
            >
              {isLoading && <Icons.spinner className="animate-spin w-4 h-4 mr-2" />}
              {t("auth.login.login_button")}
            </Button>
          </CardContent>
        </motion.div>
      </div>
    </div>
  );
}
