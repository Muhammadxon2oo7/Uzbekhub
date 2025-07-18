'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Icons } from '@/components/icons';
import { motion } from 'framer-motion';

export default function RegisterPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const cardRef = useRef<HTMLDivElement | null>(null);
  const spotRef = useRef<HTMLDivElement | null>(null);

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
      spot.style.opacity = '1';

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = -(y - centerY) / 40;
      const rotateY = (x - centerX) / 40;
      card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };

    const handleMouseLeave = () => {
      spot.style.opacity = '0';
      card.style.transform = `rotateX(-10deg) rotateY(-5deg)`;
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const handleSendCode = async () => {
    setIsLoading(true);
    try {
      setTimeout(() => {
        setIsLoading(false);
        setStep(2);
      }, 1500);
    } catch (error) {
      console.error('Error sending code', error);
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    setIsLoading(true);
    try {
      setTimeout(() => {
        setIsLoading(false);
        setStep(3);
      }, 1500);
    } catch (error) {
      console.error('Error verifying code', error);
      setIsLoading(false);
    }
  };

  const handleRegister = () => {
    setIsLoading(true);
    setTimeout(() => {
      alert('Ro‘yxatdan o‘tish muvaffaqiyatli yakunlandi!');
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="h-screen bg-muted px-4 w-full bg-radial-[at_50%_60%] from-[var(--bggradient)] via-[var(--bggradientmid)] to-[var(--bgbradientstart)] to-90% pt-[60px] flex items-center justify-center overflow-hidden">
      <div className="relative perspective-[1000px]">
        <div ref={spotRef} className="pointer-events-none absolute w-40 h-40 rounded-full bg-white/10 blur-2xl opacity-0 transition-opacity duration-200 z-0"></div>

        <motion.div
          ref={cardRef}
          initial={{ scale: 0, y: 200, rotateX: 0, rotateY: 0, opacity: 0 }}
          animate={{ scale: 1, y: 0, rotateX: -10, rotateY: -5, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative z-10 transition-transform duration-200 ease-out will-change-transform border border-white/20 py-[60px] px-[50px] rounded-2xl bg-[#f7f7f726] backdrop-blur-[20px] md:w-[500px] w-full  shadow-2xl"
        >
          <CardHeader>
            <CardTitle className="text-2xl text-primary">
              {step === 1
                ? 'Ro‘yxatdan o‘tish'
                : step === 2
                ? 'Emailni tasdiqlash'
                : 'Maʼlumotlarni toʻldiring'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {step === 1 && (
              <>
                <div className="grid w-full items-center gap-2">
                  <Label htmlFor="email" className="text-primary">Email manzil</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={cn('focus-visible:ring-2 focus-visible:ring-primary', 'border border-input focus:border-primary')}
                  />
                </div>
                <Button disabled={!email || isLoading} onClick={handleSendCode} className="w-full">
                  {isLoading && <Icons.spinner className="animate-spin w-4 h-4 mr-2" />} Kod yuborish
                </Button>
              </>
            )}

            {step === 2 && (
              <>
                <div className="grid w-full items-center gap-2">
                  <Label htmlFor="code" className="text-primary">Emailga yuborilgan kod</Label>
                  <Input
                    id="code"
                    type="text"
                    placeholder="123456"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className={cn('focus-visible:ring-2 focus-visible:ring-primary', 'border border-input focus:border-primary')}
                  />
                </div>
                <Button disabled={!code || isLoading} onClick={handleVerifyCode} className="w-full">
                  {isLoading && <Icons.spinner className="animate-spin w-4 h-4 mr-2" />} Tasdiqlash
                </Button>
              </>
            )}

            {step === 3 && (
              <>
                <div className="grid w-full items-center gap-2">
                  <Label htmlFor="name" className="text-primary">Ism</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ismingiz" />
                </div>
                <div className="grid w-full items-center gap-2">
                  <Label htmlFor="username" className="text-primary">Foydalanuvchi nomi</Label>
                  <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="yourname" />
                </div>
                <div className="grid w-full items-center gap-2">
                  <Label htmlFor="password" className="text-primary">Parol</Label>
                  <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
                </div>
                <Button disabled={!username || !password || isLoading} onClick={handleRegister} className="w-full">
                  {isLoading && <Icons.spinner className="animate-spin w-4 h-4 mr-2" />} Yakunlash
                </Button>
              </>
            )}
          </CardContent>
        </motion.div>
      </div>
    </div>
  );
}
