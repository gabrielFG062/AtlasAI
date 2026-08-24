"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BrandLogo } from "@/components/icons/brand-logo";
import { GoogleIcon } from "@/components/icons/google-icon";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !email.includes("@")) {
      setError("Por favor, insira um e-mail válido.");
      return;
    }
    if (!password) {
      setError("A senha é obrigatória.");
      return;
    }

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      router.push("/dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      router.push("/dashboard");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black selection:bg-blue-500/30">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] glow-blue blur-[120px] rounded-full opacity-60 pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 translate-x-[-30%] translate-y-[-70%] w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] glow-purple blur-[100px] rounded-full opacity-50 pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-[420px] p-8 mx-4 glassmorphism"
      >
        <div className="text-center mb-8">
          <div className="flex justify-center mb-5">
            <BrandLogo className="h-14 w-14" />
          </div>
          <h1
            className="text-3xl font-semibold text-white tracking-tight"
            suppressHydrationWarning
          >
            Acesse sua Conta
          </h1>
          <p className="text-gray-400 text-sm mt-3" suppressHydrationWarning>
            AtlasAI — Pesquisa, Desenvolvimento e IA
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Input
                id="email"
                type="email"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail className="h-4 w-4" />}
                required
              />
            </div>

            <div className="space-y-2">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock className="h-4 w-4" />}
                required
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="hover:text-white transition-colors focus:outline-none"
                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                }
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm font-medium mt-1">{error}</p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex justify-end"
          >
            <Link
              href="/forgot-password"
              className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
            >
              Esqueci minha senha
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold"
              disabled={isLoading || isGoogleLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Autenticando...
                </>
              ) : (
                "Entrar"
              )}
            </Button>
          </motion.div>
        </form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-8 relative"
        >
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[#050505] px-4 text-gray-500 font-medium">Ou</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8"
        >
          <Button
            type="button"
            variant="google"
            className="w-full h-12 text-base"
            onClick={handleGoogleLogin}
            disabled={isLoading || isGoogleLoading}
          >
            <span className="flex w-full items-center justify-center">
              <span className="mr-3 flex h-5 w-5 shrink-0 items-center justify-center">
                {isGoogleLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
                ) : (
                  <GoogleIcon />
                )}
              </span>
              <span>{isGoogleLoading ? "Aguarde..." : "Continuar com Google"}</span>
            </span>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-8 text-center text-sm"
        >
          <span className="text-gray-400">Não possui conta? </span>
          <Link
            href="/register"
            className="text-blue-400 font-medium hover:text-blue-300 transition-colors"
          >
            Criar conta
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
