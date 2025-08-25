"use client";

import { useRef, useEffect } from "react";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import { motion } from "framer-motion";
import { MapPin, Loader2, RefreshCcw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { updateLocation, deleteLocation, getProfile } from "@/lib/api";
import { useTranslation } from "react-i18next";

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

const ProfileLocation: React.FC<{
  dynamicLocation: DynamicLocation | null;
  setDynamicLocation: (location: DynamicLocation | null) => void;
  profile: Profile;
  setProfile: (profile: Profile) => void;
  setTempProfile: (profile: Profile) => void;
  isFetchingLocation: boolean;
  setIsFetchingLocation: (isFetching: boolean) => void;
  isLocationPermissionOpen: boolean;
  setIsLocationPermissionOpen: (open: boolean) => void;
}> = ({
  dynamicLocation,
  setDynamicLocation,
  profile,
  setProfile,
  setTempProfile,
  isFetchingLocation,
  setIsFetchingLocation,
  isLocationPermissionOpen,
  setIsLocationPermissionOpen,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);

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

  const initializeMap = (
    lat: number,
    lon: number,
    containerId: string = "map"
  ) => {
    if (typeof window === "undefined") {
      console.warn("Xarita ishga tushmadi: window obyekti mavjud emas");
      return;
    }

    const container = document.getElementById(containerId);
    if (!container) {
      console.warn(`Xarita konteyneri "${containerId}" topilmadi`);
      return;
    }

    if (leafletMapRef.current) {
      leafletMapRef.current.setView([lat, lon], 13);
      leafletMapRef.current.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          leafletMapRef.current?.removeLayer(layer);
        }
      });
      L.marker([lat, lon]).addTo(leafletMapRef.current);
    } else {
      leafletMapRef.current = L.map(containerId, {
        center: [lat, lon],
        zoom: 13,
        zoomControl: true,
        attributionControl: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
        errorTileUrl: "", // Xato bo'lganda bo'sh tile
      }).addTo(leafletMapRef.current).on("tileerror", (error) => {
        console.error("Tile yuklashda xato:", error);
      });

      L.marker([lat, lon]).addTo(leafletMapRef.current);
    }
  };

  const handleGetLocation = () => {
    setIsLocationPermissionOpen(true);
  };

  const handleLocationPermission = async () => {
    setIsFetchingLocation(true);
    if (typeof window === "undefined" || !navigator.geolocation) {
      setIsFetchingLocation(false);
      setIsLocationPermissionOpen(false);
      toast.error("Joylashuvni aniqlash brauzerda qo‘llab-quvvatlanmaydi.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const locationName = await fetchLocationName(latitude, longitude);
        const token = localStorage.getItem("token");
        if (!token) {
          setIsFetchingLocation(false);
          setIsLocationPermissionOpen(false);
          toast.error("Token topilmadi. Iltimos, kirish qiling.");
          return;
        }

        try {
          await updateLocation(token, {
            lat: latitude.toString(),
            long: longitude.toString(),
          }, { method: "PATCH" });
          const updatedResponse = await getProfile(token);
          const newProfile = updatedResponse.data;
          setProfile(newProfile);
          setTempProfile(newProfile);
          setDynamicLocation({
            latitude,
            longitude,
            name: locationName,
            country: newProfile.location?.country || null,
            city: newProfile.location?.city || null,
            county: newProfile.location?.county || null,
            neighbourhood: newProfile.location?.neighbourhood || null,
          });
          toast.success("Joylashuv muvaffaqiyatli yangilandi.");
          if (typeof window !== "undefined" && mapRef.current) {
            initializeMap(latitude, longitude);
          }
        } catch (error: any) {
          const message =
            error.response?.status === 401
              ? "Sessiya tugagan. Iltimos, qayta kiring."
              : error.response?.status === 400
              ? "Noto‘g‘ri ma'lumot kiritildi."
              : "Joylashuvni saqlashda xato.";
          toast.error(message);
        } finally {
          setIsFetchingLocation(false);
          setIsLocationPermissionOpen(false);
        }
      },
      (error) => {
        let message = "Joylashuvni aniqlashda xato.";
        if (error.code === error.PERMISSION_DENIED) {
          message =
            "Joylashuvga ruxsat berilmadi. Iltimos, brauzer sozlamalarini tekshiring.";
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          message = "Joylashuv ma'lumotlari mavjud emas.";
        } else if (error.code === error.TIMEOUT) {
          message = "Joylashuvni aniqlash vaqti tugadi.";
        }
        toast.error(message);
        setIsFetchingLocation(false);
        setIsLocationPermissionOpen(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleDeleteLocation = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Token topilmadi. Iltimos, kirish qiling.");
      return;
    }

    setIsFetchingLocation(true);
    try {
      await deleteLocation(token);
      const updatedResponse = await getProfile(token);
      const newProfile = updatedResponse.data;
      setProfile(newProfile);
      setTempProfile(newProfile);
      setDynamicLocation(null);
      toast.success("Joylashuv muvaffaqiyatli o‘chirildi.");
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    } catch (error: any) {
      const message =
        error.response?.status === 401
          ? "Sessiya tugagan. Iltimos, qayta kiring."
          : error.response?.status === 400
          ? "Noto‘g‘ri so‘rov."
          : "Joylashuvni o‘chirishda xato.";
      toast.error(message);
    } finally {
      setIsFetchingLocation(false);
    }
  };

  const { t } = useTranslation("DashboardProfile");

  useEffect(() => {
    console.log("Dynamic Location:", dynamicLocation); // Debugging
    if (typeof window !== "undefined" && mapRef.current && dynamicLocation) {
      initializeMap(dynamicLocation.latitude, dynamicLocation.longitude);
    }
  }, [dynamicLocation]);

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
      <Card className="bg-white/5 border-white/10 backdrop-blur-[10px] mt-6 overflow-hidden shadow-lg rounded-xl z-10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-text flex items-center gap-2 text-lg font-semibold">
              <MapPin className="w-5 h-5 text-primary" />
              {t("location")}
            </CardTitle>
            {dynamicLocation && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                    //   className="bg-yellow-400 hover:bg-yellow-400 transition-all duration-300 ease-in-out shadow-md hover:shadow-xl hover:scale-105 transform cursor-pointer"
                      disabled={isFetchingLocation}
                      onClick={handleGetLocation}
                    >
                      {isFetchingLocation ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <RefreshCcw className="w-5 h-5" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-black/90 text-white p-2 rounded-md">
                    {t("refreshLocation")}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {dynamicLocation ? (
              <>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <a
                        href={`https://www.google.com/maps?q=${dynamicLocation.latitude},${dynamicLocation.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative h-48 w-full rounded-lg overflow-hidden mb-4 block cursor-pointer transition-transform duration-300 hover:scale-105 hover:shadow-2xl group"
                      >
                        <div
                          ref={mapRef}
                          id="map"
                          className="h-full w-full bg-gray-200/50"
                          style={{ minHeight: "192px", zIndex: 1 }}
                        ></div>
                        <motion.div
                          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 flex items-center gap-2"
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3, duration: 0.4 }}
                        >
                          <MapPin className="w-4 h-4 text-white flex-shrink-0" />
                          <span className="text-white text-sm font-semibold truncate tracking-wide">
                            {dynamicLocation.name}
                          </span>
                        </motion.div>
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {t("openInGoogleMaps")}
                          </span>
                        </div>
                      </a>
                    </TooltipTrigger>
                    <TooltipContent className="bg-black/90 text-white p-2 rounded-md">
                      {t("openInGoogleMaps")}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <div className="space-y-2 text-gray-300">
                  {dynamicLocation.country && (
                    <p className="text-sm">
                      <span className="font-medium">{t("State")}:</span>{" "}
                      {dynamicLocation.country}
                    </p>
                  )}
                  {dynamicLocation.county && (
                    <p className="text-sm">
                      <span className="font-medium">{t("region")}:</span>{" "}
                      {dynamicLocation.county}
                    </p>
                  )}
                  {dynamicLocation.city && (
                    <p className="text-sm">
                      <span className="font-medium">{t("city")}:</span>{" "}
                      {dynamicLocation.city}
                    </p>
                  )}
                  {dynamicLocation.neighbourhood && (
                    <p className="text-sm">
                      <span className="font-medium">{t("neighbourhood")}:</span>{" "}
                      {dynamicLocation.neighbourhood}
                    </p>
                  )}
                </div>
                <div className="mt-4">
                  <Button
                    onClick={handleDeleteLocation}
                    className="bg-red-500 hover:bg-red-500 transition-all duration-300 ease-in-out shadow-md hover:shadow-xl hover:scale-105 transform cursor-pointer w-full"
                    disabled={isFetchingLocation}
                  >
                    {/* <X className="w-5 h-5 mr-2" /> */}
                    <span className="relative z-10">{t("deleteLocation")}</span>
                  </Button>
                </div>
              </>
            ) : (
              <motion.div
                className="text-center mb-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Button
                  onClick={handleGetLocation}
                  disabled={isFetchingLocation}
                >
                  {isFetchingLocation ? (
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  ) : (
                    <MapPin className="w-5 h-5 mr-2" />
                  )}
                  <span className="relative z-10">{t("getLocation")}</span>
                </Button>
              </motion.div>
            )}
          </motion.div>
          <Dialog
            open={isLocationPermissionOpen}
            onOpenChange={setIsLocationPermissionOpen}
          >
            <DialogContent className="bg-white/5 backdrop-blur-[10px] border-white/10">
              <DialogHeader>
                <DialogTitle>Joylashuv ruxsati</DialogTitle>
              </DialogHeader>
              <div className="text-gray-300">
                Joriy manzilingizni xaritada ko‘rsatish uchun joylashuvga ruxsat
                bering.
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsLocationPermissionOpen(false)}
                >
                  Bekor qilish
                </Button>
                <Button
                  onClick={handleLocationPermission}
                  className="relative bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold rounded-lg px-6 py-3 transition-all duration-300 ease-in-out shadow-md hover:shadow-xl hover:scale-105 transform"
                  disabled={isFetchingLocation}
                >
                  {isFetchingLocation && (
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  )}
                  <span className="relative z-10">Ruxsat berish</span>
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProfileLocation;