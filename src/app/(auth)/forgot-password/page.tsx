"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema } from "@/lib/validation";
import { forgotPassword } from "@/lib/api";
import FormInput from "@/components/FormInput";
import { Icons, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import z from "zod";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import Link from "next/link";
import { Label } from "@radix-ui/react-label";

type FormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const { t } = useTranslation();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const spotRef = useRef<HTMLDivElement | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

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
    setSuccess(null);
    try {
      const response = await forgotPassword(data);
      const result = response.data;
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
        setSuccess(t("auth.forgot_password.success"));
        toast.success(t("auth.forgot_password.success"), {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
          className: "bg-green-500 text-white rounded-lg shadow-lg",
        });
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error || t("auth.forgot_password.error_generic");
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

          <Link href="/login">
            <Button className="absolute top-4 right-4 cursor-pointer" variant="ghost">
              <X />
            </Button>
          </Link>

          <CardHeader>
            <CardTitle className="text-2xl text-primary text-center">
              {t("auth.forgot_password.title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {success ? (
              <p className="text-green-500 text-sm text-center">{success}</p>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid w-full items-center gap-2">
                  <Label htmlFor="email" className="text-primary">
                    {t("auth.forgot_password.email_label")}
                  </Label>
                  <FormInput
                    label={t("auth.forgot_password.email_label")}
                    id="email"
                    type="email"
                    placeholder={t("auth.forgot_password.email_placeholder")}
                    register={register("email")}
                    error={errors.email}
                    className="focus-visible:ring-2 focus-visible:ring-primary border border-input focus:border-primary w-full sm:w-[400px] mx-auto"
                  />
                </div>
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                <Button
                  type="submit"
                  disabled={isLoading || isSubmitting}
                  className="w-full"
                >
                  {isLoading || isSubmitting ? (
                    <>
                      <Icons.spinner  />
                      {t("auth.forgot_password.sending")}
                    </>
                  ) : (
                    t("auth.forgot_password.submit_button")
                  )}
                </Button>
              </form>
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