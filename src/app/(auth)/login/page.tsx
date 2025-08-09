"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/icons";
import { motion } from "framer-motion";
import { EyeIcon, EyeOff, KeyIcon, X } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { signInSchema } from "@/lib/validation";
import { signIn } from "@/lib/api";
import type { LoginResponse } from "../../types/auth";
import FormInput from "@/components/FormInput";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import z from "zod";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import Cookies from "js-cookie";

type FormData = z.infer<typeof signInSchema>;

export default function LoginPage() {
  const { t } = useTranslation();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement | null>(null);
  const spotRef = useRef<HTMLDivElement | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(signInSchema),
  });

  // Универсальная функция получения текста ошибки
  const getErrorMessage = (err: any) => {
    if (typeof err?.response?.data?.error === "string") {
      return err.response.data.error;
    }
    if (typeof err?.response?.data?.detail === "string") {
      return err.response.data.detail;
    }
    if (typeof err?.response?.data === "object") {
      const firstKey = Object.keys(err.response.data)[0];
      const firstError = err.response.data[firstKey];
      if (Array.isArray(firstError) && firstError.length > 0) {
        return firstError[0];
      }
    }
    return t("auth.login.error_generic");
  };

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

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await signIn(data);
      const result: LoginResponse = response.data;
      if (result.error) {
        setError(result.error);
        toast.error(result.error, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
          className: "bg-red-500 text-white rounded-lg shadow-lg",
        });
      } else {
        // localStorage.setItem("token", result.token.access);
        Cookies.set("token", result.token.access, {
          expires: 7, // хранить 7 дней
          secure: true, // только HTTPS
          sameSite: "strict", // безопаснее
        });
        toast.success(t("auth.login.success"), {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
          className: "bg-green-500 text-white rounded-lg shadow-lg",
        });
        setTimeout(() => router.push("/profile"), 1500);
      }
    } catch (err: any) {
      const errorMessage = getErrorMessage(err);
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const idToken = credentialResponse.credential;
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/oauth2/google/`,
        { token: idToken }
      );
      const { access, refresh } = res.data;
      // localStorage.setItem("token", access);
        Cookies.set("token", access, {
          expires: 7, // хранить 7 дней
          secure: true, // только HTTPS
          sameSite: "strict", // безопаснее
        });
      localStorage.setItem("refresh", refresh);
      toast.success(t("auth.login.google_success"), {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
        className: "bg-green-500 text-white rounded-lg shadow-lg",
      });
      setTimeout(() => router.push("/profile"), 1500);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    const errorMessage = t("auth.login.google_cancel");
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
              {t("auth.login.title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid w-full items-center gap-2">
                <Label htmlFor="email" className="text-primary">
                  {t("auth.login.identifier_label")}
                </Label>
                <FormInput
                  label={t("auth.login.identifier_label")}
                  id="email"
                  type="email"
                  placeholder={t("auth.login.identifier_placeholder")}
                  register={register("email")}
                  error={errors.email}
                  className="focus-visible:ring-2 focus-visible:ring-primary border border-input focus:border-primary w-full sm:w-[400px] mx-auto"
                />
              </div>
              <div className="grid w-full items-center gap-2 relative">
                <Label htmlFor="password" className="text-primary">
                  {t("auth.login.password_label")}
                </Label>
                <FormInput
                  label={t("auth.login.password_label")}
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={t("auth.login.password_placeholder")}
                  register={register("password")}
                  error={errors.password}
                  className="focus-visible:ring-2 focus-visible:ring-primary border border-input focus:border-primary pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-[50%] right-3 text-muted-foreground translate-y-[10%]"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
              {/* {error && <p className="text-red-500 text-sm">{error}</p>} */}
              <Button
                type="submit"
                disabled={isLoading || isSubmitting}
                className="w-full"
              >
                {isLoading || isSubmitting ? (
                  <>
                    <Icons.spinner className="animate-spin w-4 h-4 mr-2" />
                    {t("auth.login.sending")}
                  </>
                ) : (
                  t("auth.login.login_button")
                )}
              </Button>
            </form>
            <Link
              href="/forgot-password"
              className="text-text"
            >
              <div className="flex items-center gap-2 justify-center pb-[16px] border-b-1 hover:shadow-[0_5px_5px_-5px_#24d97e] rounded-full transition-all duration-200 ease-in-out">
                <span>
                  <KeyIcon />
                </span>
                <span>
                  {t("auth.login.forgot_password")}
                </span>
              </div>
            </Link>
            <div className="mt-6 flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
              />
            </div>
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
