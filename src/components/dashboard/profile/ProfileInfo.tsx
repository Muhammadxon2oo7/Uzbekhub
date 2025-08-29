"use client";

import { motion } from "framer-motion";
import { BookOpen, Phone } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";

interface Profile {
  first_name: string;
  last_name: string;
  username: string;
  bio: string;
  profile_picture: string;
  phone: string;
  email: string;
  location: null | {
    id: number;
    lat: string;
    long: string;
    country: string | null;
    city: string | null;
    county: string | null;
    neighbourhood: string | null;
    created_at: string;
    update_at: string;
  };
  created_at: string;
}

interface ProfileInfoProps {
  profile: Profile;
  tempProfile: Profile;
  setTempProfile: (profile: Profile) => void;
  isEditing: boolean;
}

export default function ProfileInfo({
  profile,
  tempProfile,
  setTempProfile,
  isEditing,
}: ProfileInfoProps) {
  const { t } = useTranslation("DashboardProfile");

  return (
    <motion.div
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
      <Card className="bg-white/5 border-white/10 backdrop-blur-[10px] mb-6">
        <CardHeader>
          <CardTitle className="text-text">{t("profileInformation")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-text mb-2">
              <BookOpen className="w-4 h-4 inline mr-2" />
              {t("bio")}
            </label>
            {isEditing ? (
              <Textarea
                value={tempProfile.bio}
                onChange={(e) =>
                  setTempProfile({ ...tempProfile, bio: e.target.value })
                }
                className="bg-white/5 border-white/20 text-text"
                rows={3}
              />
            ) : (
              <p className="text-gray-300 bg-white/5 rounded-lg p-3 border border-white/10">
                {profile.bio || t("notHaveBio")}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-2">
              <Phone className="w-4 h-4 inline mr-2" />
              {t("phone")}
            </label>
            {isEditing ? (
              <Input
                type="tel"
                value={tempProfile.phone}
                onChange={(e) =>
                  setTempProfile({ ...tempProfile, phone: e.target.value })
                }
                className="bg-white/5 border-white/20 text-text"
              />
            ) : (
              <p className="text-gray-300 bg-white/5 rounded-lg p-3 border border-white/10">
                {profile.phone || t("notHavePhone")}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}