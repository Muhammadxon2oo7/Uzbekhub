// 'use client';

// import Link from 'next/link';
// import { useState, useEffect } from 'react';
// import { Menu, MessageCircle } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
// import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
// import { cn } from '@/lib/utils';

// const Header = () => {
//   const [user, setUser] = useState<null | { name: string; avatar?: string }>(null);
//   const [scrolled, setScrolled] = useState(false);

//   useEffect(() => {
//     const handleScroll = () => {
//       setScrolled(window.scrollY > 10);
//     };
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   return (
//     <header
//       className={cn(
//         'sticky top-0 z-50 transition-all duration-300 border-b',
//         scrolled
//           ? 'bg-background/50 backdrop-blur-md shadow-md'
//           : 'bg-navbar shadow-sm'
//       )}
//     >
//       <div className="container mx-auto px-4 py-4 flex items-center justify-between">
//         {/* Chap — Logo */}
//         <Link href="/" className="flex items-center gap-2">
//           <MessageCircle className="w-6 h-6 text-primary" />
//           <span className="text-lg font-semibold text-text">UzbekHub</span>
//         </Link>

//         {/* Desktop nav */}
//         <nav className="hidden md:flex items-center gap-6 text-sm">
//           <Link
//             href="/hubs"
//             className="hover:text-primary text-[18px] relative font-medium text-text after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
//           >
//             Xonalar
//           </Link>
//           <Link
//             href="/about"
//             className="hover:text-primary text-[18px] relative font-medium text-text after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
//           >
//             Haqida
//           </Link>
//           <Link
//             href="/help"
//             className="hover:text-primary text-[18px] relative font-medium text-text after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
//           >
//             Yordam
//           </Link>
//         </nav>

//         {/* Auth */}
//         <div className="hidden md:flex items-center gap-3">
//           {!user ? (
//             <>
//               <Link href="/login">
//                 <Button variant="link" className="cursor-pointer" size="sm">
//                   Kirish
//                 </Button>
//               </Link>
//               <Link href="/register">
//                 <Button size="lg" className="cursor-pointer">
//                   Ro‘yxatdan o‘tish
//                 </Button>
//               </Link>
//             </>
//           ) : (
//             <div className="flex items-center gap-2">
//               <Avatar className="w-8 h-8">
//                 <AvatarImage src={user.avatar || ''} />
//                 <AvatarFallback>{user.name[0]}</AvatarFallback>
//               </Avatar>
//               <span className="text-sm text-gray-800">{user.name}</span>
//             </div>
//           )}
//         </div>

//         {/* Mobile menu */}
//         <div className="md:hidden">
//           <Sheet>
//             <SheetTrigger asChild>
//               <Button variant="ghost" size="icon">
//                 <Menu className="w-5 h-5" />
//               </Button>
//             </SheetTrigger>
//             <SheetContent side="right">
//               <div className="mt-6 space-y-4 text-sm text-gray-700 w-full p-[5px]">
//                 <div className="flex gap-[5px] items-center justify-center flex-wrap">
//                   <Link href="/xonalar" className="w-full text-[18px] text-center block">
//                     Xonalar
//                   </Link>
//                   <Link href="/haqida" className="w-full text-[18px] text-center block">
//                     Haqida
//                   </Link>
//                   <Link href="/yordam" className="w-full text-[18px] text-center block">
//                     Yordam
//                   </Link>
//                 </div>
//                 <div className="pt-4 border-t">
//                   {!user ? (
//                     <>
//                       <Link href="/login">
//                         <Button variant="ghost" size="sm" className="w-full">
//                           Kirish
//                         </Button>
//                       </Link>
//                       <Link href="/register">
//                         <Button size="sm" className="w-full">
//                           Ro‘yxatdan o‘tish
//                         </Button>
//                       </Link>
//                     </>
//                   ) : (
//                     <div className="flex items-center gap-2 pt-2">
//                       <Avatar className="w-8 h-8">
//                         <AvatarImage src={user.avatar || ''} />
//                         <AvatarFallback>{user.name[0]}</AvatarFallback>
//                       </Avatar>
//                       <span>{user.name}</span>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </SheetContent>
//           </Sheet>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;


'use client';

import { useState, useEffect } from 'react';
import { Menu, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';

const Header = () => {
  const { t } = useTranslation();
  const [user, setUser] = useState<null | { name: string; avatar?: string }>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 transition-all duration-300 border-b',
        scrolled
          ? 'bg-background/50 backdrop-blur-md shadow-md'
          : 'bg-navbar shadow-sm'
      )}
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <MessageCircle className="w-6 h-6 text-primary" />
          <span className="text-lg font-semibold text-text">UzbekHub</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/hubs" className="nav-link">
            {t('header.rooms')}
          </Link>
          <Link href="/about" className="nav-link">
            {t('header.about')}
          </Link>
          <Link href="/help" className="nav-link">
            {t('header.help')}
          </Link>
        </nav>

        {/* Auth */}
        <div className="hidden md:flex items-center gap-3">
          {!user ? (
            <>
              <Link href="/login">
                <Button variant="link" size="sm">
                  {t('header.login')}
                </Button>
              </Link>
              <Link href="/register">
                <Button size="lg">
                  {t('header.register')}
                </Button>
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src={user.avatar || ''} />
                <AvatarFallback>{user.name[0]}</AvatarFallback>
              </Avatar>
              <span className="text-sm text-gray-800">{user.name}</span>
            </div>
          )}
        </div>

        {/* Mobile */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="mt-6 space-y-4 text-sm text-gray-700 w-full p-[5px]">
                <div className="flex gap-[5px] items-center justify-center flex-wrap">
                  <Link href="/hubs" className="w-full text-[18px] text-center block" >
                    {t('header.rooms')}
                  </Link>
                  <Link href="/about" className="w-full text-[18px] text-center block">
                    {t('header.about')}
                  </Link>
                  <Link href="/help" className="w-full text-[18px] text-center block"> 
                    {t('header.help')}
                  </Link>
                </div>
                <div className="pt-4 border-t">
                  {!user ? (
                    <>
                      <Link href="/login">
                        <Button variant="ghost" size="sm" className="w-full">
                          {t('header.login')}
                        </Button>
                      </Link>
                      <Link href="/register">
                        <Button size="sm" className="w-full">
                          {t('header.register')}
                        </Button>
                      </Link>
                    </>
                  ) : (
                    <div className="flex items-center gap-2 pt-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={user.avatar || ''} />
                        <AvatarFallback>{user.name[0]}</AvatarFallback>
                      </Avatar>
                      <span>{user.name}</span>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
