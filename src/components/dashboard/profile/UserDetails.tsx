"use client";

import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, Edit3, Camera, Check, X, Loader2, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useDropzone } from "react-dropzone";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useTranslation } from "react-i18next";
import Picker from "emoji-picker-react";
import { checkUsername } from "@/lib/api";
import { toast } from "sonner";
import debounce from "lodash/debounce";

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

interface UserDetailsProps {
  profile: Profile;
  tempProfile: Profile;
  setTempProfile: (profile: Profile) => void;
  isEditing: boolean;
  isLoading: boolean;
  setAvatarFile: (file: File | null) => void;
  avatarFile: File | null;
  avatarKey: number;
  updateUsername: (newUsername: string) => void;
}

export default function UserDetails({
  profile,
  tempProfile,
  setTempProfile,
  isEditing,
  isLoading,
  setAvatarFile,
  avatarFile,
  avatarKey,
  updateUsername,
}: UserDetailsProps) {
  const [isUsernameChangeOpen, setIsUsernameChangeOpen] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState<
    "checking" | "available" | "taken" | null
  >(null);
  const [newUsername, setNewUsername] = useState("");
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState("😊");
  const { t } = useTranslation("DashboardProfile");
  const emojiRef = useRef<HTMLDivElement>(null);

  const checkUsernameAvailability = debounce(async (username: string) => {
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
        error.response?.data?.detail || "Foydalanuvchi nomini tekshirishda xato."
      );
    }
  }, 300);

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

    try {
      updateUsername(newUsername);
      setIsUsernameChangeOpen(false);
      setNewUsername("");
      setUsernameStatus(null);
      toast.success("Foydalanuvchi nomi muvaffaqiyatli o‘zgartirildi.");
    } catch (error: any) {
      toast.error(
        error.response?.data?.detail || "Foydalanuvchi nomini o‘zgartirishda xato."
      );
    }
  };

  const handleEmojiSelect = (emojiObject: any) => {
    setSelectedEmoji(emojiObject.emoji);
    setIsEmojiPickerOpen(false);
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

  return (
    <TooltipProvider>
        <div className="perspective-[1000px]">
            <motion.div
                className="mb-[24px]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = (e.clientX - rect.left - rect.width / 2) / 40;
                const y = (e.clientY - rect.top - rect.height / 2) / 40;
                e.currentTarget.style.transform = `rotateX(${y}deg) rotateY(${-x}deg)`;
                }}
                onMouseLeave={(e) => {
                e.currentTarget.style.transform = "rotateX(0deg) rotateY(0deg)";
                }}
            >
                <Card className="bg-white/5 border-white/10 backdrop-blur-[10px]">
                <CardContent className="p-6 text-center">
                    {/* Emoji tugmasi */}
                    <div className="absolute top-2 right-2">
                    <div
                        ref={emojiRef}
                        className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-2xl cursor-pointer hover:scale-110 transition-transform shadow-md"
                        onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
                    >
                        {selectedEmoji}
                    </div>

                    {/* Emoji picker pastida chiqadi */}
                    <AnimatePresence>
                        {isEmojiPickerOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 5 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute right-0 mt-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl shadow-xl p-2 z-10"
                        >
                            <Picker onEmojiClick={handleEmojiSelect} />
                        </motion.div>
                        )}
                    </AnimatePresence>
                    </div>

                    <div
                    {...getRootProps()}
                    className={`relative inline-block mb-4 cursor-pointer group ${
                        isDragActive ? "ring-2 ring-primary animate-pulse" : ""
                    } ${
                        isEditing ? "border-2 border-dashed border-gray-400 rounded-full" : ""
                    }`}
                    >
                    <input {...getInputProps()} />
                    <Avatar className="w-32 h-32 mx-auto">
                        <AvatarImage src={avatarSrc} className="object-cover" />
                        <AvatarFallback className="text-2xl">
                        {profile.first_name?.slice(0, 1) ||
                            profile.username?.slice(0, 1) ||
                            ":)"}
                        </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                        <motion.div
                        className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        whileHover={{ scale: 1.1 }}
                        >
                        <Camera className="w-8 h-8 text-white" />
                        </motion.div>
                    )}
                    </div>

                    {isEditing ? (
                    <div className="space-y-3">
                        <Input
                        value={tempProfile.first_name}
                        onChange={(e) =>
                            setTempProfile({
                            ...tempProfile,
                            first_name: e.target.value,
                            })
                        }
                        className="bg-white/5 border-white/20 text-text text-center"
                        placeholder="Ism"
                        />
                        <Input
                        value={tempProfile.last_name}
                        onChange={(e) =>
                            setTempProfile({
                            ...tempProfile,
                            last_name: e.target.value,
                            })
                        }
                        className="bg-white/5 border-white/20 text-text text-center"
                        placeholder="Familiya"
                        />
                    </div>
                    ) : (
                    <>
                        <h2 className="text-xl font-bold text-text mb-1">{fullName}</h2>
                        <div className="flex items-center justify-center gap-2 text-gray-400 mb-4">
                        <span>@{profile.username}</span>
                        <Tooltip>
                            <TooltipTrigger asChild>
                            <Dialog
                                open={isUsernameChangeOpen}
                                onOpenChange={setIsUsernameChangeOpen}
                            >
                                <DialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="p-1">
                                    <Edit3 className="w-4 h-4 text-primary" />
                                </Button>
                                </DialogTrigger>
                                <DialogContent className="bg-white/5 backdrop-blur-[10px] border-white/10">
                                <DialogHeader>
                                    <DialogTitle>{t("changeUsername")}</DialogTitle>
                                </DialogHeader>
                                <div className="relative">
                                    <Input
                                    value={newUsername}
                                    onChange={(e) => {
                                        const value = e.target.value.toLowerCase();
                                        setNewUsername(value);
                                        checkUsernameAvailability(value);
                                    }}
                                    className={`bg-white/5 border-white/20 text-text ${
                                        usernameStatus === "taken"
                                        ? "border-red-500"
                                        : usernameStatus === "available"
                                        ? "border-green-500"
                                        : ""
                                    }`}
                                    placeholder={t("newUsername")}
                                    />
                                    {usernameStatus === "checking" && (
                                    <Loader2 className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-gray-400" />
                                    )}
                                    {usernameStatus === "available" && (
                                    <Check className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                                    )}
                                    {usernameStatus === "taken" && (
                                    <X className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500" />
                                    )}
                                </div>
                                <DialogFooter>
                                    <Button
                                    variant="outline"
                                    onClick={() => setIsUsernameChangeOpen(false)}
                                    >
                                    {t("cancel")}
                                    </Button>
                                    <Button
                                    onClick={handleUsernameChange}
                                    disabled={isLoading || usernameStatus !== "available"}
                                    >
                                    {isLoading && (
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    )}
                                    <span className="relative z-10">{t("save")}</span>
                                    </Button>
                                </DialogFooter>
                                </DialogContent>
                            </Dialog>
                            </TooltipTrigger>
                            <TooltipContent>Foydalanuvchi nomini o‘zgartirish</TooltipContent>
                        </Tooltip>
                        </div>
                    </>
                    )}

                    <div className="flex items-center justify-center gap-1 text-gray-400 mb-4">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">
                        {t("addedDate")}:{" "}
                        {new Date(profile.created_at).toLocaleDateString() || "Mavjud emas"}
                    </span>
                    </div>
                </CardContent>
                </Card>
            </motion.div>
        </div>
    </TooltipProvider>
  );
}