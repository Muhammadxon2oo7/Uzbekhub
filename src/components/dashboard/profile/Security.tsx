"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Edit3, Loader2, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

interface SecurityProps {
  profile: {
    email: string;
  };
  isLoading: boolean;
  emailChangeData: { new_email: string; password: string };
  setEmailChangeData: (data: { new_email: string; password: string }) => void;
  isEmailChangeOpen: boolean;
  setIsEmailChangeOpen: (open: boolean) => void;
  handleEmailChangeRequest: () => Promise<void>;
  setIsEmailVerifyOpen: (open: boolean) => void;
  isDeleting: boolean;
  setIsDeleting: (deleting: boolean) => void;
  confirmDelete: string;
  setConfirmDelete: (value: string) => void;
  deletePass: string;
  setDeletePass: (value: string) => void;
  isSureDelete: boolean;
  setIsSureDelete: (sure: boolean) => void;
  handleDeleteAccount: () => void;
  handleReallyDeleteAccount: () => void;
}

export default function Security({
  profile,
  isLoading,
  emailChangeData,
  setEmailChangeData,
  isEmailChangeOpen,
  setIsEmailChangeOpen,
  handleEmailChangeRequest,
  setIsEmailVerifyOpen,
  isDeleting,
  setIsDeleting,
  confirmDelete,
  setConfirmDelete,
  deletePass,
  setDeletePass,
  isSureDelete,
  setIsSureDelete,
  handleDeleteAccount,
  handleReallyDeleteAccount,
}: SecurityProps) {
  const { t } = useTranslation("DashboardProfile");

  const handleEmailModalClose = (open: boolean) => {
    setIsEmailChangeOpen(open);
    if (!open) {
      setEmailChangeData({ new_email: "", password: "" });
    }
  };

  return (
    <TooltipProvider>
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
                      <Button variant="ghost" size="sm" className="p-1">
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
                          <span className="relative z-10">{t("send")}</span>
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </TooltipTrigger>
                <TooltipContent>Email o‘zgartirish</TooltipContent>
              </Tooltip>
            </div>
            <Button
              onClick={() => setIsDeleting(true)}
              size="lg"
              className="bg-red-500 hover:bg-red-500 cursor-pointer hover:scale-105"
            >
              DELETE ACCOUNT!
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      <Dialog open={isDeleting} onOpenChange={setIsDeleting}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("areYouSure")}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <label htmlFor="confirmDelete" className="w-full font-mono">
              <motion.span
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 2, ease: "easeInOut" }}
                className="inline-block font-normal overflow-hidden tracking-tighter whitespace-nowrap"
              >
                Type <span className="text-red-500 font-bold">delete {profile.email}</span> to confirm
              </motion.span>
            </label>
            <Input
              value={confirmDelete}
              onChange={(e) => setConfirmDelete(e.target.value)}
              onPaste={(e) => e.preventDefault()}
              autoComplete="off"
              id="confirmDelete"
            />
            <label htmlFor="deletePass">Type your password</label>
            <Input
              value={deletePass}
              onChange={(e) => setDeletePass(e.target.value)}
              onPaste={(e) => e.preventDefault()}
              autoComplete="off"
              id="deletePass"
              type="password"
            />
          </div>
          <DialogFooter>
            <Button onClick={handleDeleteAccount} variant="outline">
              Delete
            </Button>
            <Button onClick={() => setIsDeleting(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isSureDelete} onOpenChange={setIsSureDelete}>
        <DialogContent>
          <div className="text-4xl font-bold py-8 text-center">
            ARE YOU REALLY SURE?
          </div>
          <DialogFooter>
            <Button
              onClick={handleReallyDeleteAccount}
              variant="outline"
              className="cursor-help"
            >
              YES
            </Button>
            <Button onClick={() => setIsSureDelete(false)}>NO</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}