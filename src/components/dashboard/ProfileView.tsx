"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  User,
  Edit3,
  Heart,
  MessageCircle,
  Users,
  Loader2,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  TooltipProvider,
} from "@/components/ui/tooltip";
import { useDropzone } from "react-dropzone";
import {
  getProfile,
  updateProfile,
  checkUsername,
  changeEmail,
  confirmEmailChange,
} from "@/lib/api";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import debounce from "lodash/debounce";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import ProfileLocation from "./profile/ProfileLocation";
import UserDetails from "./profile/UserDetails";
import ProfileInfo from "./profile/ProfileInfo";
import Security from "./profile/Security";

interface Location {
  id: number;
  lat: string;
  long: string;
  country: string | null;
  city: string | null;
  county: string | null;
  neighbourhood: string | null;
  created_at: string;
  update_at: string;
}

interface Profile {
  first_name: string;
  last_name: string;
  username: string;
  bio: string;
  profile_picture: string;
  phone: string;
  email: string;
  location: Location | null;
  created_at: string;
}

interface DynamicLocation {
  latitude: number;
  longitude: number;
  name: string;
  country: string | null;
  city: string | null;
  county: string | null;
  neighbourhood: string | null;
}

export default function ProfileView() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUsernameChangeOpen, setIsUsernameChangeOpen] = useState(false);
  const [isEmailChangeOpen, setIsEmailChangeOpen] = useState(false);
  const [isEmailVerifyOpen, setIsEmailVerifyOpen] = useState(false);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const [confirmDelete, setConfirmDelete] = useState("");
  const [deletePass, setDeletePass] = useState("");

  const [isSureDelete, setIsSureDelete] = useState<boolean>(false);

  const [usernameStatus, setUsernameStatus] = useState<
    "checking" | "available" | "taken" | null
  >(null);
  const [newUsername, setNewUsername] = useState("");
  const [emailChangeData, setEmailChangeData] = useState({
    new_email: "",
    password: "",
  });
  const [emailVerifyCode, setEmailVerifyCode] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState("😊");
  const { t } = useTranslation("DashboardProfile");

  const [profile, setProfile] = useState<Profile>({
    first_name: "",
    last_name: "",
    username: "",
    bio: "",
    profile_picture: "",
    phone: "",
    email: "",
    location: null,
    created_at: "",
  });
  const [tempProfile, setTempProfile] = useState<Profile>(profile);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [dynamicLocation, setDynamicLocation] =
    useState<DynamicLocation | null>(null);
  const [isLocationPermissionOpen, setIsLocationPermissionOpen] =
    useState(false);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [avatarKey, setAvatarKey] = useState(Date.now());
  const [emojiPickerPosition, setEmojiPickerPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  const cardRef = useRef<HTMLDivElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const emojiRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const stats = [
    {
      label: "Xabarlar",
      value: 1247,
      icon: MessageCircle,
      color: "text-blue-400",
    },
    { label: "Guruhlar", value: 12, icon: Users, color: "text-green-400" },
    { label: "Xayriyalar", value: 5, icon: Heart, color: "text-red-400" },
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Token topilmadi. Iltimos, kirish qiling.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await getProfile(token);
        const data = response.data;
        console.log(data);

        const newProfile = {
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          username: data.username || "",
          bio: data.bio || "",
          profile_picture: data.profile_picture || "",
          phone: data.phone || "",
          email: data.email || "",
          location: data.location || null,
          created_at: data.date_joined || "",
        };
        console.log(newProfile);

        setProfile(newProfile);
        setTempProfile(newProfile);

        if (data.location && data.location.lat && data.location.long) {
          try {
            const lat = parseFloat(data.location.lat);
            const long = parseFloat(data.location.long);
            if (!isNaN(lat) && !isNaN(long)) {
              const name = await fetchLocationName(lat, long);
              setDynamicLocation({
                latitude: lat,
                longitude: long,
                name,
                country: data.location.country,
                city: data.location.city,
                county: data.location.county,
                neighbourhood: data.location.neighbourhood,
              });
            } else {
              console.warn("Invalid location format:", data.location);
            }
          } catch (error) {
            console.error("Error parsing location:", error);
          }
        }
      } catch (error: any) {
        const message =
          error.response?.status === 401
            ? "Sessiya tugagan. Iltimos, qayta kiring."
            : error.response?.status === 400
            ? "Noto‘g‘ri ma'lumot kiritildi."
            : "Profilni yuklashda xato.";
        toast.error(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const checkUsernameAvailability = useCallback(
    debounce(async (username: string) => {
      if (!username || username === profile.username) {
        setUsernameStatus(null);
        return;
      }

      setUsernameStatus("checking");
      try {
        const response = await checkUsername(username);
        setUsernameStatus(response.data.available ? "available" : "taken");
      } catch (error: any) {
        setUsernameStatus("taken");
        toast.error(
          error.response?.data?.detail ||
            "Foydalanuvchi nomini tekshirishda xato."
        );
      }
    }, 300),
    [profile.username]
  );

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
      spot.style.opacity = "0.3";
    };

    const handleMouseLeave = () => {
      spot.style.opacity = "0";
    };

    card.addEventListener("mousemove", handleMouseMove);
    card.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      card.removeEventListener("mousemove", handleMouseMove);
      card.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  useEffect(() => {
    if (isEmailChangeOpen && emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, [isEmailChangeOpen]);

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Token topilmadi. Iltimos, kirish qiling.");
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("first_name", tempProfile.first_name);
      formData.append("last_name", tempProfile.last_name);
      formData.append("bio", tempProfile.bio);
      formData.append("phone", tempProfile.phone);
      if (avatarFile) {
        formData.append("profile_picture", avatarFile);
      }

      await updateProfile(token, formData);
      const updatedResponse = await getProfile(token);
      setProfile(updatedResponse.data);
      setTempProfile(updatedResponse.data);
      setAvatarFile(null);
      setAvatarKey(Date.now());
      setIsEditing(false);
      toast.success("Profil muvaffaqiyatli yangilandi.");
    } catch (error: any) {
      const message =
        error.response?.status === 401
          ? "Sessiya tugagan. Iltimos, qayta kiring."
          : error.response?.status === 400
          ? "Noto‘g‘ri ma'lumot kiritildi."
          : "Profilni yangilashda xato.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setTempProfile(profile);
    setAvatarFile(null);
    setIsEditing(false);
  };

  const handleUsernameChange = async () => {
    if (usernameStatus !== "available") {
      toast.error("Foydalanuvchi nomi mavjud emas yoki band.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Token topilmadi.");
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("username", newUsername);
      const response = await updateProfile(token, formData);
      setProfile({ ...profile, username: newUsername });
      setIsUsernameChangeOpen(false);
      setNewUsername("");
      setUsernameStatus(null);
      toast.success(
        response.data?.message ||
          "Foydalanuvchi nomi muvaffaqiyatli o‘zgartirildi."
      );
    } catch (error: any) {
      toast.error(
        error.response?.data?.detail ||
          "Foydalanuvchi nomini o‘zgartirishda xato."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChangeRequest = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Token topilmadi.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailChangeData.new_email)) {
      toast.error("Iltimos, to‘g‘ri email manzilini kiriting.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await changeEmail(token, emailChangeData);
      setIsEmailChangeOpen(false);
      setIsEmailVerifyOpen(true);
      toast.success(response.data?.message || "Tasdiqlash kodi yuborildi.");
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Email o‘zgartirishda xato.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailVerify = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Token topilmadi.");
      return;
    }

    if (!/^\d{6}$/.test(emailVerifyCode)) {
      toast.error("Tasdiqlash kodi 6 raqamdan iborat bo‘lishi kerak.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await confirmEmailChange(token, {
        code: emailVerifyCode,
      });
      const updatedResponse = await getProfile(token);
      setProfile(updatedResponse.data);
      setTempProfile(updatedResponse.data);
      setIsEmailVerifyOpen(false);
      setEmailChangeData({ new_email: "", password: "" });
      setEmailVerifyCode("");
      toast.success(
        response.data?.message || "Email muvaffaqiyatli o‘zgartirildi."
      );
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Tasdiqlash kodida xato.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    document.cookie.split(";").forEach((cookie) => {
      const name = cookie.split("=")[0].trim();
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    });
    toast.success("Tizimdan muvaffaqiyatli chiqildi.");
    router.push("/");
  };

  const handleEmojiSelect = (emojiObject: any) => {
    setSelectedEmoji(emojiObject.emoji);
    setIsEmojiPickerOpen(false);
  };

  const handleEmojiClick = (event: React.MouseEvent) => {
    if (emojiRef.current) {
      const rect = emojiRef.current.getBoundingClientRect();
      setEmojiPickerPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
      });
      setIsEmojiPickerOpen(true);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [] },
    maxSize: 5 * 1024 * 1024, // 5MB
    onDrop: (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles.length > 0) {
        toast.error("Rasm hajmi 5MB dan oshmasligi kerak!");
        return;
      }
      if (acceptedFiles[0]) {
        setAvatarFile(acceptedFiles[0]);
        const previewUrl = URL.createObjectURL(acceptedFiles[0]);
        setTempProfile({ ...tempProfile, profile_picture: previewUrl });
      }
    },
    disabled: !isEditing,
  });

  const handleEmailModalClose = (open: boolean) => {
    setIsEmailChangeOpen(open);
    if (!open) {
      setEmailChangeData({ new_email: "", password: "" });
    }
  };

  const fetchLocationName = async (
    lat: number,
    lon: number
  ): Promise<string> => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10`,
        { signal: controller.signal }
      );
      clearTimeout(timeoutId);
      const data = await response.json();
      return data.display_name || "Noma'lum joy";
    } catch (error) {
      console.error("Joy nomini olishda xato:", error);
      return "Noma'lum joy";
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="w-8 h-8 text-primary" />
        </motion.div>
      </div>
    );
  }

  const fullName = `${profile.first_name} ${profile.last_name}`.trim();

  let avatarSrc = "/placeholder.svg";
  if (tempProfile.profile_picture) {
    if (
      tempProfile.profile_picture.startsWith("blob:") ||
      tempProfile.profile_picture.startsWith("data:")
    ) {
      avatarSrc = tempProfile.profile_picture;
    } else {
      avatarSrc = `https://api.rozievich.uz/${tempProfile.profile_picture}?v=${avatarKey}`;
    }
  }

  const handleDeleteAccount = () => {
    if (confirmDelete === `delete ${profile?.email}`) {
      setIsDeleting(false);
      setIsSureDelete(true);
    } else {
      // Ошибка — что-то не совпадает
      console.log("Email или пароль неверные");
    }
    setConfirmDelete("");
    setDeletePass("");
  };

  const handleReallyDeleteAccount = () => {
    console.log("Аккаунт удалён");
  };

  return (
    <TooltipProvider>
      <div className="h-full overflow-y-auto p-4">
        <motion.div
          ref={cardRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative bg-white/5 backdrop-blur-[10px] border border-white/10 rounded-2xl p-6 overflow-hidden shadow-xl"
        >
          <motion.div
            ref={spotRef}
            className="pointer-events-none absolute w-32 h-32 rounded-full bg-white/10 blur-2xl opacity-0 transition-opacity duration-200 z-0"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />

          <div className="relative z-10 max-w-4xl mx-auto">
            <motion.div
              className="flex items-center justify-between mb-8"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-3">
                <User className="w-8 h-8 text-primary" />
                <h1 className="text-2xl font-bold text-text">{t("title")}</h1>
              </div>
              <div className="flex gap-2">
                {isEditing && (
                  <Button variant="outline" onClick={handleCancel}>
                    {t("cancel")}
                  </Button>
                )}
                <Button
                  onClick={() =>
                    isEditing ? handleSave() : setIsEditing(true)
                  }
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Edit3 className="w-4 h-4 mr-2" />
                  )}
                  <span className="relative z-10">
                    {isEditing ? t("save") : t("edit")}
                  </span>
                </Button>
                <Button onClick={handleLogout} disabled={isLoading}>
                  <LogOut className="w-4 h-4 mr-2" />
                  <span className="relative z-10">{t("leave")}</span>
                </Button>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <UserDetails
                profile={profile}
                tempProfile={tempProfile}
                setTempProfile={setTempProfile}
                isEditing={isEditing}
                isLoading={isLoading}
                setAvatarFile={setAvatarFile}
                avatarFile={avatarFile}
                avatarKey={avatarKey}
                updateUsername={(newUsername) => {
                  setProfile({ ...profile, username: newUsername });
                  setTempProfile({ ...tempProfile, username: newUsername });
                }}
              />

              <motion.div
                className="lg:col-span-2 perspective-[1000px]"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                <ProfileInfo
                  profile={profile}
                  tempProfile={tempProfile}
                  setTempProfile={setTempProfile}
                  isEditing={isEditing}
                />
                <Security
                  profile={profile}
                  isLoading={isLoading}
                  emailChangeData={emailChangeData}
                  setEmailChangeData={setEmailChangeData}
                  isEmailChangeOpen={isEmailChangeOpen}
                  setIsEmailChangeOpen={setIsEmailChangeOpen}
                  handleEmailChangeRequest={handleEmailChangeRequest}
                  setIsEmailVerifyOpen={setIsEmailVerifyOpen}
                  isDeleting={isDeleting}
                  setIsDeleting={setIsDeleting}
                  confirmDelete={confirmDelete}
                  setConfirmDelete={setConfirmDelete}
                  deletePass={deletePass}
                  setDeletePass={setDeletePass}
                  isSureDelete={isSureDelete}
                  setIsSureDelete={setIsSureDelete}
                  handleDeleteAccount={handleDeleteAccount}
                  handleReallyDeleteAccount={handleReallyDeleteAccount}
                />
                  
                <motion.div
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = (e.clientX - rect.left - rect.width / 2) / 40;
                    const y = (e.clientY - rect.top - rect.height / 2) / 40;
                    e.currentTarget.style.transform = `rotateX(${y}deg) rotateY(${-x}deg)`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform =
                      "rotateX(0deg) rotateY(0deg)";
                  }}
                >
                  <ProfileLocation
                    dynamicLocation={dynamicLocation}
                    setDynamicLocation={setDynamicLocation}
                    profile={profile}
                    setProfile={setProfile}
                    setTempProfile={setTempProfile}
                    isFetchingLocation={isFetchingLocation}
                    setIsFetchingLocation={setIsFetchingLocation}
                    isLocationPermissionOpen={isLocationPermissionOpen}
                    setIsLocationPermissionOpen={setIsLocationPermissionOpen}
                  />
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        <Dialog open={isEmailVerifyOpen} onOpenChange={setIsEmailVerifyOpen}>
          <DialogContent className="bg-white/5 backdrop-blur-[10px] border-white/10">
            <DialogHeader>
              <DialogTitle>{t("ConfirmEmail")}</DialogTitle>
            </DialogHeader>
            <div>
              <label className="block text-sm font-medium text-text mb-2">
                {t("ConfirmCode")}
              </label>
              <Input
                value={emailVerifyCode}
                onChange={(e) => setEmailVerifyCode(e.target.value)}
                className="bg-white/5 border-white/20 text-text"
                placeholder="6 raqamli kodni kiriting"
              />
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsEmailVerifyOpen(false)}
              >
                {t("cancel")}
              </Button>
              <Button
                onClick={handleEmailVerify}
                className="relative bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold rounded-lg px-6 py-3 transition-all duration-300 ease-in-out shadow-md hover:shadow-xl hover:scale-105 transform"
                disabled={isLoading || !emailVerifyCode}
              >
                {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                <span className="relative z-10">{t("send")}</span>
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}
