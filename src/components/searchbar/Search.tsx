// components/guest/search-bar.tsx

'use client'
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

export default function SearchBar() {
  const [query, setQuery] = useState("")

  const handleSearch = () => {
    // Keyinchalik query'ni URLga qo‘shamiz yoki filterga uzatamiz
    console.log("Searching for:", query)
  }

  return (
    <div className="max-w-xl mx-auto flex items-center gap-2 pt-[80px]">
      <Input
        type="text"
        className="h-[55px] "
        placeholder="Jamiyat yoki mavzuni qidiring..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <Button size={"lg"} onClick={handleSearch} className="h-[50px]">
        <Search className="w-4 h-4 mr-2" />
        Qidirish
      </Button>
    </div>
  )
}
