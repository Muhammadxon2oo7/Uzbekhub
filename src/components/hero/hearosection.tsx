// components/guest/hero-section.tsx

'use client'

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Instagram, Linkedin, MessageCircle, Search, Send } from "lucide-react"
import Image from "next/image"
import Autoplay from "embla-carousel-autoplay"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import Link from "next/link"

export default function HeroSection() {
  const [query, setQuery] = useState("")

  const handleSearch = () => {
    console.log("Qidirilyapti:", query)
  }

  const images = [
 
    "/images/Questions-rafiki.png",
    "/images/Team spirit-rafiki.png",
    "/images/Team goals-rafiki.png",
    '/images/Connected world-rafiki.png',
    '/images/Discussion-rafiki.png',
  ]

  return (
    <section className=" container flex  md:flex-row flex-col-reverse items-center md:items-center    justify-between gap-10 m-auto pr-[5px] pl-[5px]">
    
      <div className="flex flex-wrap space-y-6  items-center md:h-full justify-between md:w-[50%] w-full ">
        <Link href="/" className="flex items-center gap-2">
          <MessageCircle className="w-10 h-10 text-blue-600" />
          <span className="text-[40px] font-semibold text-gray-800">UzbekHub</span>
        </Link>
        <div className="flex flex-wrap gap-[20px]">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 text-left cursor-zoom-in">
            O'zinga mos <span className="text-blue-600">jamiyatni</span> top!
          </h1>
          <p className="mt-3 text-gray-600 text-base md:text-lg">
            Qiziqarli mavzular atrofida jamiyatga qo‘shil, o‘rgan, fikr almash.
          </p>
        </div>

        <div className="w-full flex items-center gap-2">
          <Input
            placeholder="Masalan: Dasturchilar, Kitobxonlar..."
            className="h-[55px]  w-[60%] text-[20px]"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button onClick={handleSearch} size={"lg"} className="h-[50px] bg-blue-600 hover:bg-blue-700 cursor-pointer">
            <Search className="w-4 h-4 mr-2" />
            Qidirish
          </Button>
        </div>
        
        </div>
        
      </div>

      <div className="flex-1  md:w-[50%] h-[500px] justify-center content-center w-full  ">
        <Carousel
          plugins={[Autoplay({ delay: 3000 })]}
          className="w-full h-full" 
        >
          <CarouselContent>
            {images.map((src, index) => (
              <CarouselItem key={index} className=" flex items-center justify-center">
                <div className="w-full h-[500px] relative ">
                  <Image
                    src={src}
                    alt={`Ilustratsiya ${index + 1}`}
                    fill
                    className=" w-[500px] h-[500px] "
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  )
}
