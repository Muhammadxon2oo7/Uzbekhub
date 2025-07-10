"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { MessageCircle, Mail, Lock, Eye, EyeOff, ArrowLeft, CheckCircle, AlertCircle, AtSign } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function KirishSahifasi() {
  const [parolKorish, setParolKorish] = useState(false)
  const [yuklash, setYuklash] = useState(false)
  const [xato, setXato] = useState("")
  const [muvaffaqiyat, setMuvaffaqiyat] = useState(false)
  const [kirishMalumotlari, setKirishMalumotlari] = useState({
    emailYokiUsername: "",
    parol: "",
    eslabQolish: false,
  })
  const router = useRouter()

  const inputOzgartirish = (maydon: string, qiymat: string | boolean) => {
    setKirishMalumotlari((prev) => ({ ...prev, [maydon]: qiymat }))
    setXato("")
  }

  const kirishJarayoni = async (e: React.FormEvent) => {
    e.preventDefault()
    setYuklash(true)
    setXato("")

    // Validatsiya
    if (!kirishMalumotlari.emailYokiUsername.trim()) {
      setXato("Email yoki foydalanuvchi nomini kiriting")
      setYuklash(false)
      return
    }

    if (!kirishMalumotlari.parol.trim()) {
      setXato("Parolni kiriting")
      setYuklash(false)
      return
    }

    // Simulatsiya - real API chaqiruvi
    setTimeout(() => {
      // Demo uchun har qanday ma'lumot bilan kirish mumkin
      if (kirishMalumotlari.parol.length >= 6) {
        setYuklash(false)
        setMuvaffaqiyat(true)
        setTimeout(() => {
          router.push("/dashboard")
        }, 1500)
      } else {
        setYuklash(false)
        setXato("Email/foydalanuvchi nomi yoki parol noto'g'ri")
      }
    }, 2000)
  }

  const googleIlanKirish = () => {
    // Google OAuth jarayoni
    console.log("Google bilan kirish")
  }

  if (muvaffaqiyat) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center border-0 shadow-2xl">
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Muvaffaqiyatli!</h2>
            <p className="text-gray-600 mb-4">Tizimga muvaffaqiyatli kirdingiz</p>
            <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
    

        <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm w-[400px]">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-bold">Tizimga Kirish</CardTitle>
            <CardDescription>Hisobingizga kirish uchun ma'lumotlaringizni kiriting</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Google bilan kirish */}
            <Button
              onClick={googleIlanKirish}
              variant="outline"
              className="w-full h-12 font-medium bg-white hover:bg-gray-50"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google bilan kirish
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">yoki</span>
              </div>
            </div>

            <form onSubmit={kirishJarayoni} className="space-y-6">
              {/* Email yoki Username */}
              <div className="space-y-2">
                <Label htmlFor="login">Email yoki foydalanuvchi nomi</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    {kirishMalumotlari.emailYokiUsername.includes("@") ? (
                      <Mail className="h-5 w-5 text-gray-400" />
                    ) : (
                      <AtSign className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                  <Input
                    id="login"
                    type="text"
                    placeholder="email@example.com yoki foydalanuvchi_nomi"
                    className="pl-10 h-12"
                    value={kirishMalumotlari.emailYokiUsername}
                    onChange={(e) => inputOzgartirish("emailYokiUsername", e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Parol */}
              <div className="space-y-2">
                <Label htmlFor="parol">Parol</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="parol"
                    type={parolKorish ? "text" : "password"}
                    placeholder="Parolingizni kiriting"
                    className="pl-10 pr-10 h-12"
                    value={kirishMalumotlari.parol}
                    onChange={(e) => inputOzgartirish("parol", e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setParolKorish(!parolKorish)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {parolKorish ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* Xato xabari */}
              {xato && (
                <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">{xato}</span>
                </div>
              )}

              {/* Eslab qolish va parolni unutish */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="eslab-qolish"
                    checked={kirishMalumotlari.eslabQolish}
                    onCheckedChange={(checked) => inputOzgartirish("eslabQolish", checked as boolean)}
                  />
                  <Label htmlFor="eslab-qolish" className="text-sm text-gray-600">
                    Meni eslab qol
                  </Label>
                </div>
                <Link href="/parol-tiklash" className="text-sm text-blue-600 hover:text-blue-800">
                  Parolni unutdingizmi?
                </Link>
              </div>

              {/* Kirish tugmasi */}
              <Button
                type="submit"
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium text-lg"
                disabled={yuklash}
              >
                {yuklash ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                    <span>Kirish...</span>
                  </div>
                ) : (
                  "Tizimga Kirish"
                )}
              </Button>
            </form>

            {/* Ro'yxatdan o'tish havolasi */}
            <div className="text-center">
              <p className="text-gray-600">
                Hisobingiz yo'qmi?{" "}
                <Link href="/royxatdan-otish" className="text-blue-600 hover:text-blue-800 font-medium">
                  Ro'yxatdan o'ting
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Orqaga qaytish */}
        <div className="text-center mt-6">
          <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Bosh sahifaga qaytish
          </Link>
        </div>
      </div>
    </div>
  )
}
