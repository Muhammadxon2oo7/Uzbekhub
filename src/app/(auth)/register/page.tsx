// 'use client'
// import { useState, useEffect, useRef } from 'react';
// import { Button } from '@/components/ui/button';
// import { Label } from '@/components/ui/label';
// import { cn } from '@/lib/utils';
// import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Icons } from '@/components/icons';
// import { motion } from 'framer-motion';
// import { useTranslation } from 'react-i18next';
// import { X } from 'lucide-react';
// import Link from 'next/link';
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useRouter } from "next/navigation";
// import { registerStep1Schema, verifyEmailSchema } from "@/lib/validation";
// import { registerStep1, verifyEmail } from "@/lib/api";
// import type { RegisterStep1Response, VerifyEmailResponse } from "../../types/auth";
// import FormInput from "@/components/FormInput";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import z from "zod";

// type Step1FormData = z.infer<typeof registerStep1Schema>;
// type Step2FormData = z.infer<typeof verifyEmailSchema>;

// export default function RegisterPage() {
//   const { t } = useTranslation();
//   const [step, setStep] = useState<1 | 2>(1);
//   const [error, setError] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [resendTimer, setResendTimer] = useState(300); // 5 минут
//   const router = useRouter();
//   const cardRef = useRef<HTMLDivElement | null>(null);
//   const spotRef = useRef<HTMLDivElement | null>(null);

//   const step1Form = useForm<Step1FormData>({
//     resolver: zodResolver(registerStep1Schema),
//   });

//   const step2Form = useForm<Step2FormData>({
//     resolver: zodResolver(verifyEmailSchema),
//   });

//   useEffect(() => {
//     if (step === 2) {
//       setResendTimer(300); // 5 минут
//     }
//   }, [step]);

//   useEffect(() => {
//     if (resendTimer > 0 && step === 2) {
//       const interval = setInterval(() => {
//         setResendTimer(prev => prev - 1);
//       }, 1000);
//       return () => clearInterval(interval);
//     }
//   }, [resendTimer, step]);

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
//       spot.style.opacity = '1';

//       const centerX = rect.width / 2;
//       const centerY = rect.height / 2;
//       const rotateX = -(y - centerY) / 40;
//       const rotateY = (x - centerX) / 40;
//       card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
//     };

//     const handleMouseLeave = () => {
//       spot.style.opacity = '0';
//       card.style.transform = `rotateX(-10deg) rotateY(-5deg)`;
//     };

//     card.addEventListener('mousemove', handleMouseMove);
//     card.addEventListener('mouseleave', handleMouseLeave);

//     return () => {
//       card.removeEventListener('mousemove', handleMouseMove);
//       card.removeEventListener('mouseleave', handleMouseLeave);
//     };
//   }, []);

//   // функция для извлечения текста ошибок с бэкенда
//   const extractBackendError = (data: any, fallback: string) => {
//     if (!data) return fallback;
//     if (typeof data === "string") return data;
//     if (data.error) return data.error;
//     if (data.message) return data.message;
//     if (typeof data === "object") {
//       // например {"email": ["Email already exists"], "password": ["Too short"]}
//       const messages: string[] = [];
//       for (const key in data) {
//         if (Array.isArray(data[key])) {
//           messages.push(...data[key]);
//         } else if (typeof data[key] === "string") {
//           messages.push(data[key]);
//         }
//       }
//       if (messages.length) return messages.join("\n");
//     }
//     return fallback;
//   };

//   const onStep1Submit = async (data: Step1FormData) => {
//     setIsLoading(true);
//     setError(null);
//     try {
//       const response = await registerStep1(data);
//       const result: RegisterStep1Response = response.data;
//       if (result.error) {
//         setError(result.error);
//         toast.error(result.error, { theme: "colored", className: "bg-red-500 text-white rounded-lg shadow-lg" });
//       } else {
//         toast.success(result.message || t('register.code_sent'), { theme: "colored", className: "bg-green-500 text-white rounded-lg shadow-lg" });
//         setStep(2);
//       }
//     } catch (err: any) {
//       const errorMessage = extractBackendError(err.response?.data, t('register.error_generic'));
//       setError(errorMessage);
//       toast.error(errorMessage, { theme: "colored", className: "bg-red-500 text-white rounded-lg shadow-lg" });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const onStep2Submit = async (data: Step2FormData) => {
//     setIsLoading(true);
//     setError(null);
//     try {
//       const response = await verifyEmail(data);
//       const result: VerifyEmailResponse = response.data;
//       if (result.error) {
//         setError(result.error);
//         toast.error(result.error, { theme: "colored", className: "bg-red-500 text-white rounded-lg shadow-lg" });
//       } else {
//         toast.success(result.message || t('register.success'), { theme: "colored", className: "bg-green-500 text-white rounded-lg shadow-lg" });
//         setTimeout(() => router.push("/login"), 2000);
//       }
//     } catch (err: any) {
//       const errorMessage = extractBackendError(err.response?.data, t('register.error_invalid_code'));
//       setError(errorMessage);
//       toast.error(errorMessage, { theme: "colored", className: "bg-red-500 text-white rounded-lg shadow-lg" });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleResendCode = async () => {
//     if (resendTimer > 0) return;
//     try {
//       const response = await registerStep1({
//         email: step1Form.getValues("email"),
//         password: step1Form.getValues("password"),
//         confirm_password: step1Form.getValues("confirm_password")
//       });
//       const result: RegisterStep1Response = response.data;
//       toast.success(result.message || t('register.code_sent'), { theme: "colored", className: "bg-green-500 text-white rounded-lg shadow-lg" });
//       setResendTimer(300); // 5 минут
//     } catch (err: any) {
//       const errorMessage = extractBackendError(err.response?.data, t('register.error_generic'));
//       toast.error(errorMessage, { theme: "colored", className: "bg-red-500 text-white rounded-lg shadow-lg" });
//     }
//   };

//   return (
//     <div className="h-screen bg-muted px-4 w-full bg-radial-[at_50%_60%] from-[var(--bggradient)] via-[var(--bggradientmid)] to-[var(--bgbradientstart)] to-90% pt-[60px] flex items-center justify-center overflow-hidden">
//       <div className="relative perspective-[1000px]">
//         <div ref={spotRef} className="pointer-events-none absolute w-40 h-40 rounded-full bg-white/10 blur-2xl opacity-0 transition-opacity duration-200 z-0"></div>

//         <motion.div
//           ref={cardRef}
//           initial={{ scale: 0, y: 200, opacity: 0 }}
//           animate={{ scale: 1, y: 0, rotateX: -10, rotateY: -5, opacity: 1 }}
//           transition={{ duration: 0.8, ease: 'easeOut' }}
//           className="relative z-10 transition-transform duration-200 ease-out will-change-transform border border-white/20 py-[60px] px-[50px] rounded-2xl bg-[#f7f7f726] backdrop-blur-[20px] md:w-[500px] w-full shadow-2xl"
//         >
//           <Link href={'/'}>
//             <Button className='absolute top-4 right-4 cursor-pointer' variant={'ghost'}>
//               <X />
//             </Button>
//           </Link>
//           <CardHeader>
//             <CardTitle className="text-2xl text-primary">
//               {step === 1 ? t('register.register_title') : t('register.verify_title')}
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             {step === 1 && (
//               <form onSubmit={step1Form.handleSubmit(onStep1Submit)} className="space-y-4">
//                 <div className="grid w-full items-center gap-2">
//                   <Label htmlFor="email" className="text-primary">{t('register.email_label')}</Label>
//                   <FormInput {...{
//                     label: t('register.email_label'),
//                     id: "email",
//                     type: "email",
//                     placeholder: "example@gmail.com",
//                     register: step1Form.register("email"),
//                     error: step1Form.formState.errors.email,
//                     className: cn('focus-visible:ring-2 focus-visible:ring-primary', 'border border-input focus:border-primary')
//                   }} />
//                   <Label htmlFor="email" className="text-primary">{t('register.password_label')}</Label>
//                   <FormInput {...{
//                     label: t('register.password_label'),
//                     id: "password",
//                     type: "password",
//                     placeholder: t('register.password_placeholder'),
//                     register: step1Form.register("password"),
//                     error: step1Form.formState.errors.password,
//                     className: cn('focus-visible:ring-2 focus-visible:ring-primary', 'border border-input focus:border-primary')
//                   }} />
//                   <Label htmlFor="email" className="text-primary">{t('register.confirm_password_label')}</Label>
//                   <FormInput {...{
//                     label: t('register.confirm_password_label'),
//                     id: "confirm_password",
//                     type: "password",
//                     placeholder: t('register.confirm_password_placeholder'),
//                     register: step1Form.register("confirm_password"),
//                     error: step1Form.formState.errors.confirm_password,
//                     className: cn('focus-visible:ring-2 focus-visible:ring-primary', 'border border-input focus:border-primary')
//                   }} />
//                   {/* {error && <p className="text-red-500 text-sm">{error}</p>} */}
//                 </div>
//                 <Button disabled={isLoading || step1Form.formState.isSubmitting} className="w-full">
//                   {isLoading ? <><Icons.spinner className="animate-spin w-4 h-4 mr-2" />{t('register.sending')}</> : t('register.send_code')}
//                 </Button>
//               </form>
//             )}

//             {step === 2 && (
//               <form onSubmit={step2Form.handleSubmit(onStep2Submit)} className="space-y-4">
//                 <p className="text-sm text-muted-foreground">{t('register.enter_code')}</p>
//                 <div className="grid w-full items-center gap-2">
//                   <Label htmlFor="code" className="text-primary">{t('register.code_label')}</Label>
//                   <FormInput {...{
//                     label: t('register.code_label'),
//                     id: "code",
//                     type: "text",
//                     placeholder: t('register.code_placeholder'),
//                     register: step2Form.register("code"),
//                     error: step2Form.formState.errors.code,
//                     className: cn('focus-visible:ring-2 focus-visible:ring-primary', 'border border-input focus:border-primary')
//                   }} />
//                   {/* {error && <p className="text-red-500 text-sm">{error}</p>} */}
//                 </div>
//                 <Button disabled={isLoading || step2Form.formState.isSubmitting} className="w-full">
//                   {isLoading ? <><Icons.spinner className="animate-spin w-4 h-4 mr-2" />{t('register.verifying')}</> : t('register.confirm')}
//                 </Button>
//                 <Button
//                   type="button"
//                   onClick={handleResendCode}
//                   disabled={resendTimer > 0}
//                   variant="outline"
//                   className="w-full"
//                 >
//                   {resendTimer > 0
//                     ? `${t('register.resend_code')} (${resendTimer}s)`
//                     : t('register.resend_code')}
//                 </Button>
//               </form>
//             )}
//           </CardContent>
//         </motion.div>
//       </div>
//       <ToastContainer position="top-right" autoClose={3000} theme="colored" />
//     </div>
//   );
// }
'use client'
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Icons } from '@/components/icons';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import Link from 'next/link';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { registerStep1Schema, verifyEmailSchema } from "@/lib/validation";
import { registerStep1, verifyEmail } from "@/lib/api";
import type { RegisterStep1Response, VerifyEmailResponse } from "../../types/auth";
import FormInput from "@/components/FormInput";
import { toast } from "sonner";
import z from "zod";

type Step1FormData = z.infer<typeof registerStep1Schema>;
type Step2FormData = z.infer<typeof verifyEmailSchema>;

export default function RegisterPage() {
  const { t } = useTranslation("auth");
  const [step, setStep] = useState<1 | 2>(1);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(300);
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement | null>(null);
  const spotRef = useRef<HTMLDivElement | null>(null);

  const step1Form = useForm<Step1FormData>({
    resolver: zodResolver(registerStep1Schema),
  });

  const step2Form = useForm<Step2FormData>({
    resolver: zodResolver(verifyEmailSchema),
  });

  useEffect(() => {
    if (step === 2) setResendTimer(300);
  }, [step]);

  useEffect(() => {
    if (resendTimer > 0 && step === 2) {
      const interval = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [resendTimer, step]);

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

  const extractBackendError = (data: any, fallback: string) => {
    if (!data) return fallback;
    if (typeof data === "string") return data;
    if (data.error) return data.error;
    if (data.message) return data.message;
    if (typeof data === "object") {
      const messages: string[] = [];
      for (const key in data) {
        if (Array.isArray(data[key])) messages.push(...data[key]);
        else if (typeof data[key] === "string") messages.push(data[key]);
      }
      if (messages.length) return messages.join("\n");
    }
    return fallback;
  };

  const onStep1Submit = async (data: Step1FormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await registerStep1(data);
      const result: RegisterStep1Response = response.data;
      if (result.error) {
        setError(result.error);
        toast.error(result.error);
      } else {
        toast.success(result.message || t('register.code_sent'));
        setStep(2);
      }
    } catch (err: any) {
      const errorMessage = extractBackendError(err.response?.data, t('register.error_generic'));
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const onStep2Submit = async (data: Step2FormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await verifyEmail(data);
      const result: VerifyEmailResponse = response.data;
      if (result.error) {
        setError(result.error);
        toast.error(result.error);
      } else {
        toast.success(result.message || t('register.success'));
        setTimeout(() => router.push("/login"), 2000);
      }
    } catch (err: any) {
      const errorMessage = extractBackendError(err.response?.data, t('register.error_invalid_code'));
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (resendTimer > 0) return;
    try {
      const response = await registerStep1({
        email: step1Form.getValues("email"),
        password: step1Form.getValues("password"),
        confirm_password: step1Form.getValues("confirm_password")
      });
      const result: RegisterStep1Response = response.data;
      toast.success(result.message || t('register.code_sent'));
      setResendTimer(300);
    } catch (err: any) {
      const errorMessage = extractBackendError(err.response?.data, t('register.error_generic'));
      toast.error(errorMessage);
    }
  };

  return (
    <div className="h-screen bg-muted px-4 w-full bg-radial-[at_50%_60%] from-[var(--bggradient)] via-[var(--bggradientmid)] to-[var(--bgbradientstart)] to-90% pt-[60px] flex items-center justify-center overflow-hidden">
      <div className="relative perspective-[1000px]">
        <div ref={spotRef} className="pointer-events-none absolute w-40 h-40 rounded-full bg-white/10 blur-2xl opacity-0 transition-opacity duration-200 z-0"></div>

        <motion.div
          ref={cardRef}
          initial={{ scale: 0, y: 200, opacity: 0 }}
          animate={{ scale: 1, y: 0, rotateX: -10, rotateY: -5, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative z-10 transition-transform duration-200 ease-out will-change-transform border border-white/20 py-[60px] px-[50px] rounded-2xl bg-[#f7f7f726] backdrop-blur-[20px] md:w-[500px] w-full shadow-2xl"
        >
          <Link href={'/'}>
            <Button className='absolute top-4 right-4 cursor-pointer' variant={'ghost'}>
              <X />
            </Button>
          </Link>
          <CardHeader>
            <CardTitle className="text-2xl text-primary">
              {step === 1 ? t('register.register_title') : t('register.verify_title')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {step === 1 && (
              <form onSubmit={step1Form.handleSubmit(onStep1Submit)} className="space-y-4">
                <div className="grid w-full items-center gap-2">
                  <Label htmlFor="email" className="text-primary">{t('register.email_label')}</Label>
                  <FormInput {...{
                    label: t('register.email_label'),
                    id: "email",
                    type: "email",
                    placeholder: "example@gmail.com",
                    register: step1Form.register("email"),
                    error: step1Form.formState.errors.email,
                    className: cn('focus-visible:ring-2 focus-visible:ring-primary', 'border border-input focus:border-primary')
                  }} />
                  <Label htmlFor="password" className="text-primary">{t('register.password_label')}</Label>
                  <FormInput {...{
                    label: t('register.password_label'),
                    id: "password",
                    type: "password",
                    placeholder: t('register.password_placeholder'),
                    register: step1Form.register("password"),
                    error: step1Form.formState.errors.password,
                    className: cn('focus-visible:ring-2 focus-visible:ring-primary', 'border border-input focus:border-primary')
                  }} />
                  <Label htmlFor="confirm_password" className="text-primary">{t('register.confirm_password_label')}</Label>
                  <FormInput {...{
                    label: t('register.confirm_password_label'),
                    id: "confirm_password",
                    type: "password",
                    placeholder: t('register.confirm_password_placeholder'),
                    register: step1Form.register("confirm_password"),
                    error: step1Form.formState.errors.confirm_password,
                    className: cn('focus-visible:ring-2 focus-visible:ring-primary', 'border border-input focus:border-primary')
                  }} />
                </div>
                <Button disabled={isLoading || step1Form.formState.isSubmitting} className="w-full">
                  {isLoading ? <><Icons.spinner className="animate-spin w-4 h-4 mr-2" />{t('register.sending')}</> : t('register.send_code')}
                </Button>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={step2Form.handleSubmit(onStep2Submit)} className="space-y-4">
                <p className="text-sm text-muted-foreground">{t('register.enter_code')}</p>
                <div className="grid w-full items-center gap-2">
                  <Label htmlFor="code" className="text-primary">{t('register.code_label')}</Label>
                  <FormInput {...{
                    label: t('register.code_label'),
                    id: "code",
                    type: "text",
                    placeholder: t('register.code_placeholder'),
                    register: step2Form.register("code"),
                    error: step2Form.formState.errors.code,
                    className: cn('focus-visible:ring-2 focus-visible:ring-primary', 'border border-input focus:border-primary')
                  }} />
                </div>
                <Button disabled={isLoading || step2Form.formState.isSubmitting} className="w-full">
                  {isLoading ? <><Icons.spinner className="animate-spin w-4 h-4 mr-2" />{t('register.verifying')}</> : t('register.confirm')}
                </Button>
                <Button
                  type="button"
                  onClick={handleResendCode}
                  disabled={resendTimer > 0}
                  variant="outline"
                  className="w-full"
                >
                  {resendTimer > 0
                    ? `${t('register.resend_code')} (${resendTimer}s)`
                    : t('register.resend_code')}
                </Button>
              </form>
            )}
          </CardContent>
        </motion.div>
      </div>
    </div>
  );
}
