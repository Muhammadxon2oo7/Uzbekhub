"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { getProfile } from "@/lib/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSession } from "next-auth/react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import Link from "next/link";

type UserProfile = {
  email: string;
  first_name?: string;
  last_name?: string;
  username?: string;
};

export default function ProfilePage() {
  const { t } = useTranslation();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { data: session } = useSession();
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

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token || token === "[object Object]") {
          const errorMessage = t("auth.profile.error_no_token");
          setError(errorMessage);
          toast.error(errorMessage, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "colored",
            className: "bg-red-500 text-white rounded-lg shadow-lg",
          });
          router.push("/login");
          return;
        }
        const response = await getProfile(token);
        setProfile(response.data);
        toast.success(t("auth.profile.success"), {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
          className: "bg-green-500 text-white rounded-lg shadow-lg",
        });
      } catch (err: any) {
        const errorMessage = err.response?.data?.detail || t("auth.profile.error_generic");
        setError(errorMessage);
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
          className: "bg-red-500 text-white rounded-lg shadow-lg",
        });
      }
    };
    fetchProfile();
  }, [router, session]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.info(t("auth.profile.logout_success"), {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
      className: "bg-blue-500 text-white rounded-lg shadow-lg",
    });
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-muted px-2 w-full bg-radial-[at_50%_60%] from-[var(--bggradient)] via-[var(--bggradientmid)] to-[var(--bgbradientstart)] to-90% pt-[40px] flex items-center justify-center overflow-auto">
      <div className="relative perspective-[1000px] w-full flex justify-center">
        <motion.div
          ref={cardRef}
          initial={{ scale: 0, y: 200, rotateX: 0, rotateY: 0, opacity: 0 }}
          animate={{ scale: 1, y: 0, rotateX: -10, rotateY: -5, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="overflow-hidden relative z-10 transition-transform duration-200 ease-out will-change-transform border border-white/20 py-8 px-4 sm:py-12 sm:px-8 rounded-2xl bg-[#f7f7f726] backdrop-blur-[20px] w-full max-w-lg shadow-2xl max-h-[90vh]"
        >
          <div
            ref={spotRef}
            className="pointer-events-none absolute w-40 h-40 rounded-full bg-white/10 blur-2xl opacity-0 transition-opacity duration-200 z-0"
          ></div>

          <Link href="/">
            <Button className="absolute top-4 right-4 cursor-pointer" variant="ghost">
              <X />
            </Button>
          </Link>

          <CardHeader>
            <CardTitle className="text-2xl text-primary text-center">
              {t("auth.profile.title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {error ? (
              <p className="text-red-500 text-sm text-center">{error}</p>
            ) : !profile ? (
              <p className="text-center text-muted-foreground">{t("auth.profile.loading")}</p>
            ) : (
              <div className="space-y-2">
                <p className="text-primary">
                  <strong>{t("auth.profile.email_label")}:</strong> {profile.email}
                </p>
                {profile.first_name && (
                  <p className="text-primary">
                    <strong>{t("auth.profile.first_name_label")}:</strong> {profile.first_name}
                  </p>
                )}
                {profile.last_name && (
                  <p className="text-primary">
                    <strong>{t("auth.profile.last_name_label")}:</strong> {profile.last_name}
                  </p>
                )}
                {profile.username && (
                  <p className="text-primary">
                    <strong>{t("auth.profile.username_label")}:</strong> {profile.username}
                  </p>
                )}
                <Button
                  onClick={handleLogout}
                  className="w-full bg-red-500 hover:bg-red-600 text-white"
                >
                  {t("auth.profile.logout_button")}
                </Button>
              </div>
            )}
          </CardContent>
        </motion.div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
}