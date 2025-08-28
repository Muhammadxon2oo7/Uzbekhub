import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Filter, Palette, PictureInPicture, Scissors, Smile, Text, Type } from "lucide-react"
import { useState, useRef } from "react"

export const Stories = ({ isPosting, setIsPosting }: { isPosting: boolean, setIsPosting: (isPosting: boolean) => void }) => {
  const [storyImage, setStoryImage] = useState<File | null>(null)
  const [storyText, setStoryText] = useState("")
  const [isCutting, setIsCutting] = useState(false)
  const [isPrivate, setIsPrivate] = useState(false)
  const [isTextMode, setIsTextMode] = useState(false)
  const [overlayText, setOverlayText] = useState("")
  const [textPosition, setTextPosition] = useState({ x: 165, y: 220 })
  const [isDragging, setIsDragging] = useState(false)
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState<string>("none")
  const textRef = useRef<HTMLInputElement>(null)

  const filterOptions = [
    { name: "none", style: "none" },
    { name: "grayscale", style: "grayscale(100%)" },
    { name: "sepia", style: "sepia(100%)" },
    { name: "blur", style: "blur(2px)" },
    { name: "brightness", style: "brightness(150%)" },
    { name: "contrast", style: "contrast(150%)" },
    { name: "invert", style: "invert(100%)" },
    { name: "saturate", style: "saturate(200%)" },
  ]

  const publishStories = () => {
    if (storyText.trim() || overlayText.trim()) {
      console.log("Hikoya joylandi:", { storyText, overlayText, storyImage, textPosition, selectedFilter }, "Do'stlarimga:", isPrivate)
    }
  }

  const togglePrivacy = (btnValue: boolean) => {
    setIsPrivate(btnValue)
  }

  const handleTextSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setIsTextMode(false)
      setIsDragging(true)
    }
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) {
      const rect = e.currentTarget.getBoundingClientRect()
      setTextPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) {
      const rect = e.currentTarget.getBoundingClientRect()
      setTextPosition({
        x: Math.max(0, Math.min(330, e.clientX - rect.left)),
        y: Math.max(0, Math.min(440, e.clientY - rect.top)),
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const applyFilter = (filter: string) => {
    setSelectedFilter(filter)
    setIsFilterModalOpen(false)
  }

  return (
    <>
      <Dialog open={isPosting} onOpenChange={setIsPosting}>
        <DialogContent>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Yangi hikoya</h2>
              <p className="text-sm text-gray-400">Hikoyangizni qo'shing</p>
            </div>
            <div className="flex items-center gap-[8px]">
              <Button variant={isPrivate ? "ghost" : "default"} onClick={() => togglePrivacy(false)} className="rounded-full cursor-pointer">Barchaga</Button>
              <Button variant={isPrivate ? "default" : "ghost"} onClick={() => togglePrivacy(true)} className="rounded-full cursor-pointer">Do'stlarimga</Button>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex flex-col items-center">
              {!storyImage ? (
                <Input
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null
                    setStoryImage(file)
                  }}
                  type="file"
                  accept="image/*,video/*"
                  className="w-[330px] h-[440px] mb-[16px]"
                />
              ) : (
                <div className="relative flex items-center justify-center mb-[16px] overflow-hidden">
                  <div 
                    className="relative min-w-[330px] min-h-[440px] overflow-hidden"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                  >
                    {storyImage.type.startsWith("image/") ? (
                      <img
                        src={URL.createObjectURL(storyImage)}
                        alt="preview"
                        className="w-[330px] rounded h-[440px] object-cover"
                        style={{ filter: selectedFilter }}
                      />
                    ) : (
                      <video
                        src={URL.createObjectURL(storyImage)}
                        controls
                        className="w-[330px] rounded h-[440px] object-cover"
                        style={{ filter: selectedFilter }}
                      />
                    )}
                    <button
                      onClick={() => setStoryImage(null)}
                      className="absolute top-4 right-2 bg-black/50 text-white rounded-full p-1"
                    >
                      ✕
                    </button>
                    {isTextMode && (
                      <Input
                        ref={textRef}
                        value={overlayText}
                        onChange={(e) => setOverlayText(e.target.value)}
                        onKeyDown={handleTextSubmit}
                        placeholder="Matn kiriting..."
                        className="absolute bg-black/30 text-white placeholder:text-white/50 border-none w-[200px] text-center"
                        style={{
                          left: "50%",
                          top: "50%",
                          transform: "translate(-50%, -50%)",
                        }}
                      />
                    )}
                    {overlayText && !isTextMode && (
                      <div
                        className="absolute text-white whitespace-nowrap text-lg font-bold cursor-move select-none"
                        style={{
                          left: textPosition.x,
                          top: textPosition.y,
                          transform: "translate(-50%, -50%)",
                        }}
                      >
                        {overlayText}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 mt-2">
                    <Button
                      variant="ghost"
                      className="rounded-full cursor-pointer bg-black/50 text-white p-2"
                      onClick={() => setIsCutting(!isCutting)}
                    >
                      <Scissors />
                    </Button>
                    <Button
                      variant="ghost"
                      className="rounded-full cursor-pointer bg-black/50 text-white p-2"
                      onClick={() => {
                        setIsTextMode(true)
                        setTextPosition({ x: 165, y: 220 })
                        setTimeout(() => textRef.current?.focus(), 0)
                      }}
                    >
                      <Type />
                    </Button>
                    <Button
                      variant="ghost"
                      className="rounded-full cursor-pointer bg-black/50 text-white p-2"
                    >
                      <Smile />
                    </Button>
                    <Button
                      variant="ghost"
                      className="rounded-full cursor-pointer bg-black/50 text-white p-2"
                      onClick={() => setIsFilterModalOpen(true)}
                    >
                      <Palette />
                    </Button>
                  </div>
                </div>
              )}
            </div>
            <Input
              placeholder="Hikoya matni..."
              value={storyText}
              onChange={(e) => setStoryText(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
            <div>
              <Button onClick={publishStories} className="mt-4">
                Yuborish
              </Button>
              <Button variant="outline" className="mt-4 ml-2" onClick={() => setIsPosting(false)}>
                Bekor qilish
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={isFilterModalOpen} onOpenChange={setIsFilterModalOpen}>
        <DialogContent className="max-w-[425px]">
          <DialogTitle>Filterlarni tanlang</DialogTitle>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {filterOptions.map((filter) => (
              <Button
                key={filter.name}
                variant={selectedFilter === filter.style ? "default" : "outline"}
                onClick={() => applyFilter(filter.style)}
                className="capitalize"
              >
                {filter.name}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}