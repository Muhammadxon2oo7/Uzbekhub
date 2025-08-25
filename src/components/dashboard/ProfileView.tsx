// "use client";

// import { useState, useRef, useEffect, useCallback } from "react";
// import * as L from "leaflet";
// import "leaflet/dist/leaflet.css";
// import { motion } from "framer-motion";
// import {
//   User,
//   MapPin,
//   Phone,
//   Mail,
//   Calendar,
//   Edit3,
//   Camera,
//   Heart,
//   MessageCircle,
//   Users,
//   Loader2,
//   Check,
//   X,
//   Shield,
//   LogOut,
//   RefreshCcw,
//   Smile,
//   Paperclip,
//   PaperclipIcon,
//   FileText,
//   BookOpen,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
// import { Badge } from "@/components/ui/badge";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";
// import { useDropzone } from "react-dropzone";
// import {
//   getProfile,
//   updateProfile,
//   checkUsername,
//   changeEmail,
//   confirmEmailChange,
//   updateLocation,
//   deleteLocation,
// } from "@/lib/api";
// import { toast } from "sonner";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import debounce from "lodash/debounce";
// import { useRouter } from "next/navigation";
// import { stat } from "fs";
// import { useTranslation } from "react-i18next";

// interface Location {
//   id: number;
//   lat: string;
//   long: string;
//   country: string | null;
//   city: string | null;
//   county: string | null;
//   neighbourhood: string | null;
//   created_at: string;
//   update_at: string;
// }

// interface Profile {
//   first_name: string;
//   last_name: string;
//   username: string;
//   bio: string;
//   profile_picture: string;
//   phone: string;
//   status: string;
//   email: string;
//   location: Location | null;
//   created_at: string;
// }

// interface DynamicLocation {
//   latitude: number;
//   longitude: number;
//   name: string;
//   country: string | null;
//   city: string | null;
//   county: string | null;
//   neighbourhood: string | null;
// }

// const ProfileLocation: React.FC<{
//   dynamicLocation: DynamicLocation | null;
//   setDynamicLocation: (location: DynamicLocation | null) => void;
//   profile: Profile;
//   setProfile: (profile: Profile) => void;
//   setTempProfile: (profile: Profile) => void;
//   isFetchingLocation: boolean;
//   setIsFetchingLocation: (isFetching: boolean) => void;
//   isLocationPermissionOpen: boolean;
//   setIsLocationPermissionOpen: (open: boolean) => void;
// }> = ({
//   dynamicLocation,
//   setDynamicLocation,
//   profile,
//   setProfile,
//   setTempProfile,
//   isFetchingLocation,
//   setIsFetchingLocation,
//   isLocationPermissionOpen,
//   setIsLocationPermissionOpen,
// }) => {
//   const mapRef = useRef<HTMLDivElement>(null);
//   const leafletMapRef = useRef<L.Map | null>(null);

//   const fetchLocationName = async (
//     lat: number,
//     lon: number
//   ): Promise<string> => {
//     try {
//       const controller = new AbortController();
//       const timeoutId = setTimeout(() => controller.abort(), 5000);
//       const response = await fetch(
//         `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10`,
//         { signal: controller.signal }
//       );
//       clearTimeout(timeoutId);
//       const data = await response.json();
//       return data.display_name || "Noma'lum joy";
//     } catch (error) {
//       console.error("Joy nomini olishda xato:", error);
//       return "Noma'lum joy";
//     }
//   };

//   const initializeMap = (
//     lat: number,
//     lon: number,
//     containerId: string = "map"
//   ) => {
//     if (typeof window === "undefined") {
//       console.warn("Xarita ishga tushmadi: window obyekti mavjud emas");
//       return;
//     }

//     const container = document.getElementById(containerId);
//     if (!container) {
//       console.warn(`Xarita konteyneri "${containerId}" topilmadi`);
//       return;
//     }

//     if (leafletMapRef.current) {
//       leafletMapRef.current.setView([lat, lon], 13);
//       L.marker([lat, lon]).addTo(leafletMapRef.current);
//     } else {
//       leafletMapRef.current = L.map(containerId, {
//         center: [lat, lon],
//         zoom: 13,
//         zoomControl: true,
//         attributionControl: true,
//       });

//       L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//         attribution: "© OpenStreetMap contributors",
//       }).addTo(leafletMapRef.current);

//       L.marker([lat, lon]).addTo(leafletMapRef.current);
//     }
//   };

//   const handleGetLocation = () => {
//     setIsLocationPermissionOpen(true);
//   };

//   const handleLocationPermission = async () => {
//     setIsFetchingLocation(true);
//     if (typeof window === "undefined" || !navigator.geolocation) {
//       setIsFetchingLocation(false);
//       setIsLocationPermissionOpen(false);
//       toast.error("Joylashuvni aniqlash brauzerda qo‘llab-quvvatlanmaydi.");
//       return;
//     }

//     navigator.geolocation.getCurrentPosition(
//       async (position) => {
//         const { latitude, longitude } = position.coords;
//         const locationName = await fetchLocationName(latitude, longitude);
//         const token = localStorage.getItem("token");
//         if (!token) {
//           setIsFetchingLocation(false);
//           setIsLocationPermissionOpen(false);
//           toast.error("Token topilmadi. Iltimos, kirish qiling.");
//           return;
//         }

//         try {
//           await updateLocation(token, {
//             lat: latitude.toString(),
//             long: longitude.toString(),
//           });
//           const updatedResponse = await getProfile(token);
//           const newProfile = updatedResponse.data;
//           setProfile(newProfile);
//           setTempProfile(newProfile);
//           setDynamicLocation({
//             latitude,
//             longitude,
//             name: locationName,
//             country: newProfile.location?.country || null,
//             city: newProfile.location?.city || null,
//             county: newProfile.location?.county || null,
//             neighbourhood: newProfile.location?.neighbourhood || null,
//           });
//           toast.success("Joylashuv muvaffaqiyatli yangilandi.");
//           if (typeof window !== "undefined" && mapRef.current) {
//             initializeMap(latitude, longitude);
//           }
//         } catch (error: any) {
//           const message =
//             error.response?.status === 401
//               ? "Sessiya tugagan. Iltimos, qayta kiring."
//               : error.response?.status === 400
//               ? "Noto‘g‘ri ma'lumot kiritildi."
//               : "Joylashuvni saqlashda xato.";
//           toast.error(message);
//         } finally {
//           setIsFetchingLocation(false);
//           setIsLocationPermissionOpen(false);
//         }
//       },
//       (error) => {
//         let message = "Joylashuvni aniqlashda xato.";
//         if (error.code === error.PERMISSION_DENIED) {
//           message =
//             "Joylashuvga ruxsat berilmadi. Iltimos, brauzer sozlamalarini tekshiring.";
//         } else if (error.code === error.POSITION_UNAVAILABLE) {
//           message = "Joylashuv ma'lumotlari mavjud emas.";
//         } else if (error.code === error.TIMEOUT) {
//           message = "Joylashuvni aniqlash vaqti tugadi.";
//         }
//         toast.error(message);
//         setIsFetchingLocation(false);
//         setIsLocationPermissionOpen(false);
//       },
//       { enableHighAccuracy: true, timeout: 10000 }
//     );
//   };

//   const handleDeleteLocation = async () => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       toast.error("Token topilmadi. Iltimos, kirish qiling.");
//       return;
//     }

//     setIsFetchingLocation(true);
//     try {
//       await deleteLocation(token);
//       const updatedResponse = await getProfile(token);
//       const newProfile = updatedResponse.data;
//       setProfile(newProfile);
//       setTempProfile(newProfile);
//       setDynamicLocation(null);
//       toast.success("Joylashuv muvaffaqiyatli o‘chirildi.");
//     } catch (error: any) {
//       const message =
//         error.response?.status === 401
//           ? "Sessiya tugagan. Iltimos, qayta kiring."
//           : error.response?.status === 400
//           ? "Noto‘g‘ri so‘rov."
//           : "Joylashuvni o‘chirishda xato.";
//       toast.error(message);
//     } finally {
//       setIsFetchingLocation(false);
//     }
//   };
//   const { t } = useTranslation("DashboardProfile");

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ delay: 0.4 }}
//       onMouseMove={(e) => {
//         const rect = e.currentTarget.getBoundingClientRect();
//         const x = (e.clientX - rect.left - rect.width / 2) / 40;
//         const y = (e.clientY - rect.top - rect.height / 2) / 40;
//         e.currentTarget.style.transform = `rotateX(${y}deg) rotateY(${-x}deg)`;
//       }}
//       onMouseLeave={(e) => {
//         e.currentTarget.style.transform = "rotateX(0deg) rotateY(0deg)";
//       }}
//     >
//       <Card className="bg-white/5 border-white/10 backdrop-blur-[10px] mt-6 overflow-hidden shadow-lg rounded-xl">
//         <CardHeader>
//           <CardTitle className="text-text flex items-center gap-2 text-lg font-semibold">
//             <MapPin className="w-5 h-5 text-primary" />
//             {t("location")}
//           </CardTitle>
//         </CardHeader>
//         <CardContent className="p-4">
//           <motion.div
//             initial={{ opacity: 0, scale: 0.9 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ duration: 0.5, ease: "easeOut" }}
//           >
//             {!dynamicLocation ? (
//               <motion.div
//                 className="text-center"
//                 initial={{ y: 20, opacity: 0 }}
//                 animate={{ y: 0, opacity: 1 }}
//                 transition={{ duration: 0.5 }}
//               >
//                 <Button
//                   onClick={handleGetLocation}
//                   disabled={isFetchingLocation}
//                 >
//                   {isFetchingLocation ? (
//                     <Loader2 className="w-5 h-5 mr-2 animate-spin" />
//                   ) : (
//                     <MapPin className="w-5 h-5 mr-2" />
//                   )}
//                   <span className="relative z-10">{t("getLocation")}</span>
//                 </Button>
//               </motion.div>
//             ) : (
//               <motion.div
//                 initial={{ opacity: 0, scale: 0.95 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 transition={{ duration: 0.5, ease: "easeOut" }}
//               >
//                 <TooltipProvider>
//                   <Tooltip>
//                     <TooltipTrigger asChild>
//                       <a
//                         href={`https://www.google.com/maps?q=${dynamicLocation.latitude},${dynamicLocation.longitude}`}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="relative h-48 w-full rounded-lg overflow-hidden mb-4 block cursor-pointer transition-transform duration-300 hover:scale-105 hover:shadow-2xl group"
//                       >
//                         <div
//                           ref={mapRef}
//                           id="map"
//                           className="h-full w-full bg-gray-200/50"
//                           style={{ minHeight: "192px", zIndex: 1 }}
//                         ></div>
//                         <motion.div
//                           className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 flex items-center gap-2"
//                           initial={{ opacity: 0, y: 15 }}
//                           animate={{ opacity: 1, y: 0 }}
//                           transition={{ delay: 0.3, duration: 0.4 }}
//                         >
//                           <MapPin className="w-4 h-4 text-white flex-shrink-0" />
//                           <span className="text-white text-sm font-semibold truncate tracking-wide">
//                             {dynamicLocation.name}
//                           </span>
//                         </motion.div>

//                         <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
//                           <span className="text-white text-sm font-medium">
//                             {t("openInGoogleMaps")}
//                           </span>
//                         </div>
//                       </a>
//                     </TooltipTrigger>
//                     <TooltipContent className="bg-black/90 text-white p-2 rounded-md">
//                       {t("openInGoogleMaps")}
//                     </TooltipContent>
//                   </Tooltip>
//                 </TooltipProvider>
//                 <div className="space-y-2 text-gray-300">
//                   {dynamicLocation.country && (
//                     <p className="text-sm">
//                       <span className="font-medium">{t("State")}:</span>{" "}
//                       {dynamicLocation.country}
//                     </p>
//                   )}
//                   {dynamicLocation.county && (
//                     <p className="text-sm">
//                       <span className="font-medium">{t("region")}:</span>{" "}
//                       {dynamicLocation.county}
//                     </p>
//                   )}
//                   {dynamicLocation.city && (
//                     <p className="text-sm">
//                       <span className="font-medium">{t("city")}:</span>{" "}
//                       {dynamicLocation.city}
//                     </p>
//                   )}
//                   {dynamicLocation.neighbourhood && (
//                     <p className="text-sm">
//                       <span className="font-medium">{t("neighbourhood")}:</span>{" "}
//                       {dynamicLocation.neighbourhood}
//                     </p>
//                   )}
//                 </div>
//                 <div className=" mt-4">
//                   <Button
//                     className="mb-[10px] bg-yellow-400 hover:bg-yellow-400 transition-all duration-300 ease-in-out shadow-md hover:shadow-xl hover:scale-105 transform cursor-pointer"
//                     disabled={isFetchingLocation}
//                   >
//                     {isFetchingLocation ? (
//                       <Loader2 className="w-5 h-5 mr-2 animate-spin" />
//                     ) : (
//                       <RefreshCcw className="w-5 h-5 mr-2" />
//                     )}
//                     <span className="relative z-10">
//                       {t("refreshLocation")}
//                     </span>
//                   </Button>
//                   <Button
//                     onClick={handleDeleteLocation}
//                     className="bg-red-500 hover:bg-red-500 transition-all duration-300 ease-in-out shadow-md hover:shadow-xl hover:scale-105 transform cursor-pointer"
//                     disabled={isFetchingLocation}
//                   >
//                     <X className="w-5 h-5 mr-2" />
//                     <span className="relative z-10">{t("deleteLocation")}</span>
//                   </Button>
//                 </div>
//               </motion.div>
//             )}
//           </motion.div>
//           <Dialog
//             open={isLocationPermissionOpen}
//             onOpenChange={setIsLocationPermissionOpen}
//           >
//             <DialogContent className="bg-white/5 backdrop-blur-[10px] border-white/10">
//               <DialogHeader>
//                 <DialogTitle>Joylashuv ruxsati</DialogTitle>
//               </DialogHeader>
//               <div className="text-gray-300">
//                 Joriy manzilingizni xaritada ko‘rsatish uchun joylashuvga ruxsat
//                 bering.
//               </div>
//               <DialogFooter>
//                 <Button
//                   variant="outline"
//                   onClick={() => setIsLocationPermissionOpen(false)}
//                 >
//                   Bekor qilish
//                 </Button>
//                 <Button
//                   onClick={handleLocationPermission}
//                   className="relative bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold rounded-lg px-6 py-3 transition-all duration-300 ease-in-out shadow-md hover:shadow-xl hover:scale-105 transform"
//                   disabled={isFetchingLocation}
//                 >
//                   {isFetchingLocation && (
//                     <Loader2 className="w-5 h-5 mr-2 animate-spin" />
//                   )}
//                   <span className="relative z-10">Ruxsat berish</span>
//                 </Button>
//               </DialogFooter>
//             </DialogContent>
//           </Dialog>
//         </CardContent>
//       </Card>
//     </motion.div>
//   );
// };

// export default function ProfileView() {
//   const [isEditing, setIsEditing] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isUsernameChangeOpen, setIsUsernameChangeOpen] = useState(false);
//   const [isEmailChangeOpen, setIsEmailChangeOpen] = useState(false);
//   const [isEmailVerifyOpen, setIsEmailVerifyOpen] = useState(false);
//   const [usernameStatus, setUsernameStatus] = useState<
//     "checking" | "available" | "taken" | null
//   >(null);
//   const [newUsername, setNewUsername] = useState("");
//   const [emailChangeData, setEmailChangeData] = useState({
//     new_email: "",
//     password: "",
//   });
//   const [emailVerifyCode, setEmailVerifyCode] = useState("");

//   const { t } = useTranslation("DashboardProfile");

//   const [profile, setProfile] = useState<Profile>({
//     first_name: "",
//     last_name: "",
//     username: "",
//     bio: "",
//     profile_picture: "",
//     phone: "",
//     status: "",
//     email: "",
//     location: null,
//     created_at: "",
//   });
//   const [tempProfile, setTempProfile] = useState<Profile>(profile);
//   const [avatarFile, setAvatarFile] = useState<File | null>(null);
//   const [dynamicLocation, setDynamicLocation] =
//     useState<DynamicLocation | null>(null);
//   const [isLocationPermissionOpen, setIsLocationPermissionOpen] =
//     useState(false);
//   const [isFetchingLocation, setIsFetchingLocation] = useState(false);
//   const [avatarKey, setAvatarKey] = useState(Date.now());

//   const cardRef = useRef<HTMLDivElement>(null);
//   const spotRef = useRef<HTMLDivElement>(null);
//   const emailInputRef = useRef<HTMLInputElement>(null);
//   const router = useRouter();

//   const stats = [
//     {
//       label: "Xabarlar",
//       value: 1247,
//       icon: MessageCircle,
//       color: "text-blue-400",
//     },
//     { label: "Guruhlar", value: 12, icon: Users, color: "text-green-400" },
//     { label: "Xayriyalar", value: 5, icon: Heart, color: "text-red-400" },
//   ];

//   useEffect(() => {
//     const fetchProfile = async () => {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         toast.error("Token topilmadi. Iltimos, kirish qiling.");
//         setIsLoading(false);
//         return;
//       }

//       try {
//         const response = await getProfile(token);
//         const data = response.data;
//         console.log(data);

//         const newProfile = {
//           first_name: data.first_name || "",
//           last_name: data.last_name || "",
//           username: data.username || "",
//           bio: data.bio || "",
//           profile_picture: data.profile_picture || "",
//           phone: data.phone || "",
//           status: data.status || "",
//           email: data.email || "",
//           location: data.location || null,
//           created_at: data.date_joined || "",
//         };
//         console.log(newProfile);

//         setProfile(newProfile);
//         setTempProfile(newProfile);

//         if (data.location && data.location.lat && data.location.long) {
//           try {
//             const lat = parseFloat(data.location.lat);
//             const long = parseFloat(data.location.long);
//             if (!isNaN(lat) && !isNaN(long)) {
//               const name = await fetchLocationName(lat, long);
//               setDynamicLocation({
//                 latitude: lat,
//                 longitude: long,
//                 name,
//                 country: data.location.country,
//                 city: data.location.city,
//                 county: data.location.county,
//                 neighbourhood: data.location.neighbourhood,
//               });
//             } else {
//               console.warn("Invalid location format:", data.location);
//             }
//           } catch (error) {
//             console.error("Error parsing location:", error);
//           }
//         }
//       } catch (error: any) {
//         const message =
//           error.response?.status === 401
//             ? "Sessiya tugagan. Iltimos, qayta kiring."
//             : error.response?.status === 400
//             ? "Noto‘g‘ri ma'lumot kiritildi."
//             : "Profilni yuklashda xato.";
//         toast.error(message);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchProfile();
//   }, []);

//   const checkUsernameAvailability = useCallback(
//     debounce(async (username: string) => {
//       if (!username || username === profile.username) {
//         setUsernameStatus(null);
//         return;
//       }

//       setUsernameStatus("checking");
//       try {
//         const response = await checkUsername(username);
//         setUsernameStatus(response.data.available ? "available" : "taken");
//       } catch (error: any) {
//         setUsernameStatus("taken");
//         toast.error(
//           error.response?.data?.detail ||
//             "Foydalanuvchi nomini tekshirishda xato."
//         );
//       }
//     }, 300),
//     [profile.username]
//   );

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
//       spot.style.opacity = "0.3";
//     };

//     const handleMouseLeave = () => {
//       spot.style.opacity = "0";
//     };

//     card.addEventListener("mousemove", handleMouseMove);
//     card.addEventListener("mouseleave", handleMouseLeave);

//     return () => {
//       card.removeEventListener("mousemove", handleMouseMove);
//       card.removeEventListener("mouseleave", handleMouseLeave);
//     };
//   }, []);

//   useEffect(() => {
//     if (isEmailChangeOpen && emailInputRef.current) {
//       emailInputRef.current.focus();
//     }
//   }, [isEmailChangeOpen]);

//   const handleSave = async () => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       toast.error("Token topilmadi. Iltimos, kirish qiling.");
//       return;
//     }

//     setIsLoading(true);
//     try {
//       const formData = new FormData();
//       formData.append("first_name", tempProfile.first_name);
//       formData.append("last_name", tempProfile.last_name);
//       formData.append("bio", tempProfile.bio);
//       formData.append("phone", tempProfile.phone);
//       if (avatarFile) {
//         formData.append("profile_picture", avatarFile);
//       }

//       await updateProfile(token, formData);
//       const updatedResponse = await getProfile(token);
//       setProfile(updatedResponse.data);
//       setTempProfile(updatedResponse.data);
//       setAvatarFile(null);
//       setAvatarKey(Date.now());
//       setIsEditing(false);
//       toast.success("Profil muvaffaqiyatli yangilandi.");
//     } catch (error: any) {
//       const message =
//         error.response?.status === 401
//           ? "Sessiya tugagan. Iltimos, qayta kiring."
//           : error.response?.status === 400
//           ? "Noto‘g‘ri ma'lumot kiritildi."
//           : "Profilni yangilashda xato.";
//       toast.error(message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleCancel = () => {
//     setTempProfile(profile);
//     setAvatarFile(null);
//     setIsEditing(false);
//   };

//   const handleUsernameChange = async () => {
//     if (usernameStatus !== "available") {
//       toast.error("Foydalanuvchi nomi mavjud emas yoki band.");
//       return;
//     }

//     const token = localStorage.getItem("token");
//     if (!token) {
//       toast.error("Token topilmadi.");
//       return;
//     }

//     setIsLoading(true);
//     try {
//       const formData = new FormData();
//       formData.append("username", newUsername);
//       const response = await updateProfile(token, formData);
//       setProfile({ ...profile, username: newUsername });
//       setIsUsernameChangeOpen(false);
//       setNewUsername("");
//       setUsernameStatus(null);
//       toast.success(
//         response.data?.message ||
//           "Foydalanuvchi nomi muvaffaqiyatli o‘zgartirildi."
//       );
//     } catch (error: any) {
//       toast.error(
//         error.response?.data?.detail ||
//           "Foydalanuvchi nomini o‘zgartirishda xato."
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleEmailChangeRequest = async () => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       toast.error("Token topilmadi.");
//       return;
//     }

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(emailChangeData.new_email)) {
//       toast.error("Iltimos, to‘g‘ri email manzilini kiriting.");
//       return;
//     }

//     setIsLoading(true);
//     try {
//       const response = await changeEmail(token, emailChangeData);
//       setIsEmailChangeOpen(false);
//       setIsEmailVerifyOpen(true);
//       toast.success(response.data?.message || "Tasdiqlash kodi yuborildi.");
//     } catch (error: any) {
//       toast.error(error.response?.data?.detail || "Email o‘zgartirishda xato.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleEmailVerify = async () => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       toast.error("Token topilmadi.");
//       return;
//     }

//     if (!/^\d{6}$/.test(emailVerifyCode)) {
//       toast.error("Tasdiqlash kodi 6 raqamdan iborat bo‘lishi kerak.");
//       return;
//     }

//     setIsLoading(true);
//     try {
//       const response = await confirmEmailChange(token, {
//         code: emailVerifyCode,
//       });
//       const updatedResponse = await getProfile(token);
//       setProfile(updatedResponse.data);
//       setTempProfile(updatedResponse.data);
//       setIsEmailVerifyOpen(false);
//       setEmailChangeData({ new_email: "", password: "" });
//       setEmailVerifyCode("");
//       toast.success(
//         response.data?.message || "Email muvaffaqiyatli o‘zgartirildi."
//       );
//     } catch (error: any) {
//       toast.error(error.response?.data?.detail || "Tasdiqlash kodida xato.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     document.cookie.split(";").forEach((cookie) => {
//       const name = cookie.split("=")[0].trim();
//       document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
//     });
//     toast.success("Tizimdan muvaffaqiyatli chiqildi.");
//     router.push("/");
//   };

//   const { getRootProps, getInputProps, isDragActive } = useDropzone({
//     accept: { "image/*": [] },
//     maxSize: 5 * 1024 * 1024, // 5MB
//     onDrop: (acceptedFiles, rejectedFiles) => {
//       if (rejectedFiles.length > 0) {
//         toast.error("Rasm hajmi 5MB dan oshmasligi kerak!");
//         return;
//       }
//       if (acceptedFiles[0]) {
//         setAvatarFile(acceptedFiles[0]);
//         const previewUrl = URL.createObjectURL(acceptedFiles[0]);
//         setTempProfile({ ...tempProfile, profile_picture: previewUrl });
//       }
//     },
//     disabled: !isEditing,
//   });

//   const handleEmailModalClose = (open: boolean) => {
//     setIsEmailChangeOpen(open);
//     if (!open) {
//       setEmailChangeData({ new_email: "", password: "" });
//     }
//   };

//   const fetchLocationName = async (
//     lat: number,
//     lon: number
//   ): Promise<string> => {
//     try {
//       const controller = new AbortController();
//       const timeoutId = setTimeout(() => controller.abort(), 5000);
//       const response = await fetch(
//         `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10`,
//         { signal: controller.signal }
//       );
//       clearTimeout(timeoutId);
//       const data = await response.json();
//       return data.display_name || "Noma'lum joy";
//     } catch (error) {
//       console.error("Joy nomini olishda xato:", error);
//       return "Noma'lum joy";
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="h-full flex items-center justify-center">
//         <motion.div
//           animate={{ rotate: 360 }}
//           transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//         >
//           <Loader2 className="w-8 h-8 text-primary" />
//         </motion.div>
//       </div>
//     );
//   }

//   const fullName = `${profile.first_name} ${profile.last_name}`.trim();

//   let avatarSrc = "/placeholder.svg";
//   if (tempProfile.profile_picture) {
//     if (
//       tempProfile.profile_picture.startsWith("blob:") ||
//       tempProfile.profile_picture.startsWith("data:")
//     ) {
//       avatarSrc = tempProfile.profile_picture;
//     } else {
//       avatarSrc = `https://api.rozievich.uz/${tempProfile.profile_picture}?v=${avatarKey}`;
//     }
//   }

//   return (
//     <TooltipProvider>
//       <div className="h-full overflow-y-auto p-4">
//         <motion.div
//           ref={cardRef}
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5, ease: "easeOut" }}
//           className="relative bg-white/5 backdrop-blur-[10px] border border-white/10 rounded-2xl p-6 overflow-hidden shadow-xl"
//         >
//           <motion.div
//             ref={spotRef}
//             className="pointer-events-none absolute w-32 h-32 rounded-full bg-white/10 blur-2xl opacity-0 transition-opacity duration-200 z-0"
//             animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
//             transition={{ duration: 2, repeat: Infinity }}
//           />

//           <div className="relative z-10 max-w-4xl mx-auto">
//             <motion.div
//               className="flex items-center justify-between mb-8"
//               initial={{ opacity: 0, x: -50 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ delay: 0.2 }}
//             >
//               <div className="flex items-center gap-3">
//                 <User className="w-8 h-8 text-primary" />
//                 <h1 className="text-2xl font-bold text-text">{t("title")}</h1>
//               </div>
//               <div className="flex gap-2">
//                 {isEditing && (
//                   <Button variant="outline" onClick={handleCancel}>
//                     {t("cancel")}
//                   </Button>
//                 )}
//                 <Button
//                   onClick={() =>
//                     isEditing ? handleSave() : setIsEditing(true)
//                   }
//                   disabled={isLoading}
//                 >
//                   {isLoading ? (
//                     <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//                   ) : (
//                     <Edit3 className="w-4 h-4 mr-2" />
//                   )}
//                   <span className="relative z-10">
//                     {isEditing ? t("save") : t("edit")}
//                   </span>
//                 </Button>
//                 <Button onClick={handleLogout} disabled={isLoading}>
//                   <LogOut className="w-4 h-4 mr-2" />
//                   <span className="relative z-10">{t("leave")}</span>
//                 </Button>
//               </div>
//             </motion.div>

//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//               <motion.div
//                 className="lg:col-span-1 perspective-[1000px]"
//                 initial={{ opacity: 0, scale: 0.9 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 transition={{ delay: 0.3 }}
//               >
//                 <motion.div
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0.4 }}
//                   onMouseMove={(e) => {
//                     const rect = e.currentTarget.getBoundingClientRect();
//                     const x = (e.clientX - rect.left - rect.width / 2) / 40;
//                     const y = (e.clientY - rect.top - rect.height / 2) / 40;
//                     e.currentTarget.style.transform = `rotateX(${y}deg) rotateY(${-x}deg)`;
//                   }}
//                   onMouseLeave={(e) => {
//                     e.currentTarget.style.transform =
//                       "rotateX(0deg) rotateY(0deg)";
//                   }}
//                 >
//                   <Card className="bg-white/5 border-white/10 backdrop-blur-[10px]">
//                     <CardContent className="p-6 text-center">
//                       <div
//                         {...getRootProps()}
//                         className={`relative inline-block mb-4 cursor-pointer group ${
//                           isDragActive
//                             ? "ring-2 ring-primary animate-pulse"
//                             : ""
//                         } ${
//                           isEditing
//                             ? "border-2 border-dashed border-gray-400 rounded-full"
//                             : ""
//                         }`}
//                       >
//                         <input {...getInputProps()} />
//                         <Avatar className="w-32 h-32 mx-auto">
//                           <AvatarImage
//                             src={avatarSrc}
//                             className="object-cover"
//                           />
//                           <AvatarFallback className="text-2xl">
//                             {profile.first_name?.slice(0, 1) ||
//                               profile.username?.slice(0, 1) ||
//                               ":)"}
//                           </AvatarFallback>
//                         </Avatar>
//                         {isEditing && (
//                           <motion.div
//                             className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
//                             whileHover={{ scale: 1.1 }}
//                           >
//                             <Camera className="w-8 h-8 text-white" />
//                           </motion.div>
//                         )}
//                       </div>

//                       {isEditing ? (
//                         <div className="space-y-3">
//                           <Input
//                             value={tempProfile.first_name}
//                             onChange={(e) =>
//                               setTempProfile({
//                                 ...tempProfile,
//                                 first_name: e.target.value,
//                               })
//                             }
//                             className="bg-white/5 border-white/20 text-text text-center"
//                             placeholder="Ism"
//                           />
//                           <Input
//                             value={tempProfile.last_name}
//                             onChange={(e) =>
//                               setTempProfile({
//                                 ...tempProfile,
//                                 last_name: e.target.value,
//                               })
//                             }
//                             className="bg-white/5 border-white/20 text-text text-center"
//                             placeholder="Familiya"
//                           />
//                         </div>
//                       ) : (
//                         <>
//                           <h2 className="text-xl font-bold text-text mb-1">
//                             {fullName}
//                           </h2>
//                           <div className="flex items-center justify-center gap-2 text-gray-400 mb-4">
//                             <span>@{profile.username}</span>
//                             <Tooltip>
//                               <TooltipTrigger asChild>
//                                 <Dialog
//                                   open={isUsernameChangeOpen}
//                                   onOpenChange={setIsUsernameChangeOpen}
//                                 >
//                                   <DialogTrigger asChild>
//                                     <Button
//                                       variant="ghost"
//                                       size="sm"
//                                       className="p-1"
//                                     >
//                                       <Edit3 className="w-4 h-4 text-primary" />
//                                     </Button>
//                                   </DialogTrigger>
//                                   <DialogContent className="bg-white/5 backdrop-blur-[10px] border-white/10">
//                                     <DialogHeader>
//                                       <DialogTitle>
//                                         {t("changeUsername")}
//                                       </DialogTitle>
//                                     </DialogHeader>
//                                     <div className="relative">
//                                       <Input
//                                         value={newUsername}
//                                         onChange={(e) => {
//                                           const value =
//                                             e.target.value.toLowerCase();
//                                           setNewUsername(value);
//                                           checkUsernameAvailability(value);
//                                         }}
//                                         className={`bg-white/5 border-white/20 text-text ${
//                                           usernameStatus === "taken"
//                                             ? "border-red-500"
//                                             : usernameStatus === "available"
//                                             ? "border-green-500"
//                                             : ""
//                                         }`}
//                                         placeholder={t("newUsername")}
//                                       />
//                                       {usernameStatus === "checking" && (
//                                         <Loader2 className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-gray-400" />
//                                       )}
//                                       {usernameStatus === "available" && (
//                                         <Check className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
//                                       )}
//                                       {usernameStatus === "taken" && (
//                                         <X className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500" />
//                                       )}
//                                     </div>
//                                     <DialogFooter>
//                                       <Button
//                                         variant="outline"
//                                         onClick={() =>
//                                           setIsUsernameChangeOpen(false)
//                                         }
//                                       >
//                                         {t("cancel")}
//                                       </Button>
//                                       <Button
//                                         onClick={handleUsernameChange}
//                                         disabled={
//                                           isLoading ||
//                                           usernameStatus !== "available"
//                                         }
//                                       >
//                                         {isLoading && (
//                                           <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//                                         )}
//                                         <span className="relative z-10">
//                                           {t("save")}
//                                         </span>
//                                       </Button>
//                                     </DialogFooter>
//                                   </DialogContent>
//                                 </Dialog>
//                               </TooltipTrigger>
//                               <TooltipContent>
//                                 Foydalanuvchi nomini o‘zgartirish
//                               </TooltipContent>
//                             </Tooltip>
//                           </div>
//                         </>
//                       )}

//                       <div className="flex items-center justify-center gap-1 text-gray-400 mb-4">
//                         <Calendar className="w-4 h-4" />
//                         <span className="text-sm">
//                           {t("addedDate")}:{" "}
//                           {new Date(profile.created_at).toLocaleDateString() ||
//                             "Mavjud emas"}
//                         </span>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 </motion.div>

//                 <ProfileLocation
//                   dynamicLocation={dynamicLocation}
//                   setDynamicLocation={setDynamicLocation}
//                   profile={profile}
//                   setProfile={setProfile}
//                   setTempProfile={setTempProfile}
//                   isFetchingLocation={isFetchingLocation}
//                   setIsFetchingLocation={setIsFetchingLocation}
//                   isLocationPermissionOpen={isLocationPermissionOpen}
//                   setIsLocationPermissionOpen={setIsLocationPermissionOpen}
//                 />
//               </motion.div>

//               <motion.div
//                 className="lg:col-span-2 perspective-[1000px]"
//                 initial={{ opacity: 0, scale: 0.9 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 transition={{ delay: 0.5 }}
//               >
//                 <motion.div
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0.4 }}
//                   onMouseMove={(e) => {
//                     const rect = e.currentTarget.getBoundingClientRect();
//                     const x = (e.clientX - rect.left - rect.width / 2) / 40;
//                     const y = (e.clientY - rect.top - rect.height / 2) / 40;
//                     e.currentTarget.style.transform = `rotateX(${y}deg) rotateY(${-x}deg)`;
//                   }}
//                   onMouseLeave={(e) => {
//                     e.currentTarget.style.transform =
//                       "rotateX(0deg) rotateY(0deg)";
//                   }}
//                 >
//                   <Card className="bg-white/5 border-white/10 backdrop-blur-[10px] mb-6">
//                     <CardHeader>
//                       <CardTitle className="text-text">
//                         {t("profileInformation")}
//                       </CardTitle>
//                     </CardHeader>
//                     <CardContent className="space-y-6">
//                       <div>
//                         <label className="block text-sm font-medium text-text mb-2">
//                           <BookOpen className="w-4 h-4 inline mr-2" />
//                           {t("bio")}
//                         </label>
//                         {isEditing ? (
//                           <Textarea
//                             value={tempProfile.bio}
//                             onChange={(e) =>
//                               setTempProfile({
//                                 ...tempProfile,
//                                 bio: e.target.value,
//                               })
//                             }
//                             className="bg-white/5 border-white/20 text-text"
//                             rows={3}
//                           />
//                         ) : (
//                           <p className="text-gray-300 bg-white/5 rounded-lg p-3 border border-white/10">
//                             {profile.bio || t("notHaveBio")}
//                           </p>
//                         )}
//                       </div>

//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div>
//                           <label className="block text-sm font-medium text-text mb-2">
//                             <Phone className="w-4 h-4 inline mr-2" />
//                             {t("phone")}
//                           </label>
//                           {isEditing ? (
//                             <Input
//                               type="tel"
//                               value={tempProfile.phone}
//                               onChange={(e) =>
//                                 setTempProfile({
//                                   ...tempProfile,
//                                   phone: e.target.value,
//                                 })
//                               }
//                               className="bg-white/5 border-white/20 text-text"
//                             />
//                           ) : (
//                             <p className="text-gray-300 bg-white/5 rounded-lg p-3 border border-white/10">
//                               {profile.phone || t("notHavePhone")}
//                             </p>
//                           )}
//                         </div>
//                         <div>
//                           <label className="block text-sm font-medium text-text mb-2">
//                             <Smile className="w-4 h-4 inline mr-2" />
//                             {t("status")}
//                           </label>
//                           {isEditing ? (
//                             <Input
//                               type="text"
//                               value={tempProfile.status}
//                               onChange={(e) =>
//                                 setTempProfile({
//                                   ...tempProfile,
//                                   status: e.target.value,
//                                 })
//                               }
//                               className="bg-white/5 border-white/20 text-text"
//                             />
//                           ) : (
//                             <p className="text-gray-300 bg-white/5 rounded-lg p-3 border border-white/10">
//                               {profile.status || t("notHaveStatus")}
//                             </p>
//                           )}
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 </motion.div>
//                 <motion.div
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0.4 }}
//                   onMouseMove={(e) => {
//                     const rect = e.currentTarget.getBoundingClientRect();
//                     const x = (e.clientX - rect.left - rect.width / 2) / 40;
//                     const y = (e.clientY - rect.top - rect.height / 2) / 40;
//                     e.currentTarget.style.transform = `rotateX(${y}deg) rotateY(${-x}deg)`;
//                   }}
//                   onMouseLeave={(e) => {
//                     e.currentTarget.style.transform =
//                       "rotateX(0deg) rotateY(0deg)";
//                   }}
//                 >
//                   <Card className="bg-white/5 border-white/10 backdrop-blur-[10px]">
//                     <CardHeader>
//                       <CardTitle className="text-text flex items-center gap-2">
//                         <Shield className="w-5 h-5 text-primary" />
//                         {t("security")}
//                       </CardTitle>
//                     </CardHeader>
//                     <CardContent className="space-y-4">
//                       <div className="flex items-center justify-between">
//                         <div className="flex items-center gap-2">
//                           <Mail className="w-4 h-4 text-text" />
//                           <span className="text-gray-300">
//                             {profile.email || t("notHaveEmail")}
//                           </span>
//                         </div>
//                         <Tooltip>
//                           <TooltipTrigger asChild>
//                             <Dialog
//                               open={isEmailChangeOpen}
//                               onOpenChange={handleEmailModalClose}
//                             >
//                               <DialogTrigger asChild>
//                                 <Button
//                                   variant="ghost"
//                                   size="sm"
//                                   className="p-1"
//                                 >
//                                   <Edit3 className="w-4 h-4 text-primary" />
//                                 </Button>
//                               </DialogTrigger>

//                               <DialogContent className="bg-white/5 backdrop-blur-[10px] border-white/10">
//                                 <DialogHeader>
//                                   <DialogTitle>{t("changeEmail")}</DialogTitle>
//                                 </DialogHeader>
//                                 <div className="space-y-4">
//                                   <div>
//                                     <label className="block text-sm font-medium text-text mb-2">
//                                       {t("newEmail")}
//                                     </label>
//                                     <Input
//                                       type="email"
//                                       value={emailChangeData.new_email}
//                                       onChange={(e) =>
//                                         setEmailChangeData({
//                                           ...emailChangeData,
//                                           new_email: e.target.value,
//                                         })
//                                       }
//                                       className="bg-white/5 border-white/20 text-text"
//                                       ref={emailInputRef}
//                                     />
//                                   </div>
//                                   <div>
//                                     <label className="block text-sm font-medium text-text mb-2">
//                                       {t("password")}
//                                     </label>
//                                     <Input
//                                       type="password"
//                                       value={emailChangeData.password}
//                                       onChange={(e) =>
//                                         setEmailChangeData({
//                                           ...emailChangeData,
//                                           password: e.target.value,
//                                         })
//                                       }
//                                       className="bg-white/5 border-white/20 text-text"
//                                     />
//                                   </div>
//                                 </div>
//                                 <DialogFooter>
//                                   <Button
//                                     variant="outline"
//                                     onClick={() => handleEmailModalClose(false)}
//                                   >
//                                     {t("cancel")}
//                                   </Button>
//                                   <Button
//                                     onClick={handleEmailChangeRequest}
//                                     disabled={
//                                       isLoading ||
//                                       !emailChangeData.new_email ||
//                                       !emailChangeData.password
//                                     }
//                                   >
//                                     {isLoading && (
//                                       <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//                                     )}
//                                     <span className="relative z-10">
//                                       {t("send")}
//                                     </span>
//                                   </Button>
//                                 </DialogFooter>
//                               </DialogContent>
//                             </Dialog>
//                           </TooltipTrigger>
//                           <TooltipContent>Email o‘zgartirish</TooltipContent>
//                         </Tooltip>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 </motion.div>
//               </motion.div>
//             </div>
//           </div>
//         </motion.div>

//         <Dialog open={isEmailVerifyOpen} onOpenChange={setIsEmailVerifyOpen}>
//           <DialogContent className="bg-white/5 backdrop-blur-[10px] border-white/10">
//             <DialogHeader>
//               <DialogTitle>{t("ConfirmEmail")}</DialogTitle>
//             </DialogHeader>
//             <div>
//               <label className="block text-sm font-medium text-text mb-2">
//                 {t("ConfirmCode")}
//               </label>
//               <Input
//                 value={emailVerifyCode}
//                 onChange={(e) => setEmailVerifyCode(e.target.value)}
//                 className="bg-white/5 border-white/20 text-text"
//                 placeholder="6 raqamli kodni kiriting"
//               />
//             </div>
//             <DialogFooter>
//               <Button
//                 variant="outline"
//                 onClick={() => setIsEmailVerifyOpen(false)}
//               >
//                 {t("cancel")}
//               </Button>
//               <Button
//                 onClick={handleEmailVerify}
//                 className="relative bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold rounded-lg px-6 py-3 transition-all duration-300 ease-in-out shadow-md hover:shadow-xl hover:scale-105 transform"
//                 disabled={isLoading || !emailVerifyCode}
//               >
//                 {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
//                 <span className="relative z-10">{t("send")}</span>
//               </Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>
//       </div>
//     </TooltipProvider>
//   );
// }

"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  User,
  Phone,
  Mail,
  Calendar,
  Edit3,
  Camera,
  Heart,
  MessageCircle,
  Users,
  Loader2,
  Check,
  X,
  Shield,
  LogOut,
  Smile,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
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
  DialogTrigger,
} from "@/components/ui/dialog";
import debounce from "lodash/debounce";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import ProfileLocation from "./ProfileLocation";
import Picker from "emoji-picker-react"; // emoji-picker-react dan foydalanamiz

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
              <motion.div
                className="lg:col-span-1 perspective-[1000px]"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
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
                    e.currentTarget.style.transform =
                      "rotateX(0deg) rotateY(0deg)";
                  }}
                >
                   <Card className="bg-white/5 border-white/10 backdrop-blur-[10px]">
                     <CardContent className="p-6 text-center">
                      {/* Emoji tugmasi */}
                      <div className="absolute top-2 right-2">
                        <div
                          ref={emojiRef}
                          className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-2xl cursor-pointer hover:scale-110 transition-transform shadow-md"
                          onClick={() =>
                            setIsEmojiPickerOpen(!isEmojiPickerOpen)
                          }
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
                              className="absolute right-0 mt-2  bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl shadow-xl p-2 z-1000000"
                            >
                              <Picker onEmojiClick={handleEmojiSelect} />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                       <div
                        {...getRootProps()}
                        className={`relative inline-block mb-4 cursor-pointer group ${
                          isDragActive
                            ? "ring-2 ring-primary animate-pulse"
                            : ""
                        } ${
                          isEditing
                            ? "border-2 border-dashed border-gray-400 rounded-full"
                            : ""
                        }`}
                      >
                        <input {...getInputProps()} />
                        <Avatar className="w-32 h-32 mx-auto">
                          <AvatarImage
                            src={avatarSrc}
                            className="object-cover"
                          />
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
                          <h2 className="text-xl font-bold text-text mb-1">
                            {fullName}
                          </h2>
                          <div className="flex items-center justify-center gap-2 text-gray-400 mb-4">
                            <span>@{profile.username}</span>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Dialog
                                  open={isUsernameChangeOpen}
                                  onOpenChange={setIsUsernameChangeOpen}
                                >
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="p-1"
                                    >
                                      <Edit3 className="w-4 h-4 text-primary" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="bg-white/5 backdrop-blur-[10px] border-white/10">
                                    <DialogHeader>
                                      <DialogTitle>
                                        {t("changeUsername")}
                                      </DialogTitle>
                                    </DialogHeader>
                                    <div className="relative">
                                      <Input
                                        value={newUsername}
                                        onChange={(e) => {
                                          const value =
                                            e.target.value.toLowerCase();
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
                                        onClick={() =>
                                          setIsUsernameChangeOpen(false)
                                        }
                                      >
                                        {t("cancel")}
                                      </Button>
                                      <Button
                                        onClick={handleUsernameChange}
                                        disabled={
                                          isLoading ||
                                          usernameStatus !== "available"
                                        }
                                      >
                                        {isLoading && (
                                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        )}
                                        <span className="relative z-10">
                                          {t("save")}
                                        </span>
                                      </Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              </TooltipTrigger>
                              <TooltipContent>
                                Foydalanuvchi nomini o‘zgartirish
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        </>
                      )}

                      <div className="flex items-center justify-center gap-1 text-gray-400 mb-4">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">
                          {t("addedDate")}:{" "}
                          {new Date(profile.created_at).toLocaleDateString() ||
                            "Mavjud emas"}
                        </span>
                      </div>
                    </CardContent>
                  </Card>                  
                </motion.div>

               
              </motion.div>

              <motion.div
                className="lg:col-span-2 perspective-[1000px]"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
              >
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
                    e.currentTarget.style.transform =
                      "rotateX(0deg) rotateY(0deg)";
                  }}
                >
                  <Card className="bg-white/5 border-white/10 backdrop-blur-[10px] mb-6">
                    <CardHeader>
                      <CardTitle className="text-text">
                        {t("profileInformation")}
                      </CardTitle>
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
                              setTempProfile({
                                ...tempProfile,
                                bio: e.target.value,
                              })
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
                                setTempProfile({
                                  ...tempProfile,
                                  phone: e.target.value,
                                })
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
                    e.currentTarget.style.transform =
                      "rotateX(0deg) rotateY(0deg)";
                  }}
                >
                  <Card className="bg-white/5 border-white/10 backdrop-blur-[10px]">
                    <CardHeader>
                      <CardTitle className="text-text flex items-center gap-2">
                        <Shield className="w-5 h-5 text-primary" />
                        {t("security")}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-text" />
                          <span className="text-gray-300">
                            {profile.email || t("notHaveEmail")}
                          </span>
                        </div>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Dialog
                              open={isEmailChangeOpen}
                              onOpenChange={handleEmailModalClose}
                            >
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="p-1"
                                >
                                  <Edit3 className="w-4 h-4 text-primary" />
                                </Button>
                              </DialogTrigger>

                              <DialogContent className="bg-white/5 backdrop-blur-[10px] border-white/10">
                                <DialogHeader>
                                  <DialogTitle>{t("changeEmail")}</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <label className="block text-sm font-medium text-text mb-2">
                                      {t("newEmail")}
                                    </label>
                                    <Input
                                      type="email"
                                      value={emailChangeData.new_email}
                                      onChange={(e) =>
                                        setEmailChangeData({
                                          ...emailChangeData,
                                          new_email: e.target.value,
                                        })
                                      }
                                      className="bg-white/5 border-white/20 text-text"
                                      ref={emailInputRef}
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-text mb-2">
                                      {t("password")}
                                    </label>
                                    <Input
                                      type="password"
                                      value={emailChangeData.password}
                                      onChange={(e) =>
                                        setEmailChangeData({
                                          ...emailChangeData,
                                          password: e.target.value,
                                        })
                                      }
                                      className="bg-white/5 border-white/20 text-text"
                                    />
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button
                                    variant="outline"
                                    onClick={() => handleEmailModalClose(false)}
                                  >
                                    {t("cancel")}
                                  </Button>
                                  <Button
                                    onClick={handleEmailChangeRequest}
                                    disabled={
                                      isLoading ||
                                      !emailChangeData.new_email ||
                                      !emailChangeData.password
                                    }
                                  >
                                    {isLoading && (
                                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    )}
                                    <span className="relative z-10">
                                      {t("send")}
                                    </span>
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </TooltipTrigger>
                          <TooltipContent>Email o‘zgartirish</TooltipContent>
                        </Tooltip>
                      </div>
                    </CardContent>
                  </Card>
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
