import React from 'react'
import { Button } from '../ui/button'
import { Moon, Sun } from 'lucide-react'

export const Mode = () => {
  return (
    <div className='w-[80px] h-[35px] flex items-center justify-between border border-white/20 rounded-full bg-[#f7f7f726] backdrop-blur-[20px]'>
        <button className='p-[5px]'>
            <Moon/>
        </button>
        <button className='p-[5px]'>
            <Sun/>
        </button>
    </div>
  )
}
