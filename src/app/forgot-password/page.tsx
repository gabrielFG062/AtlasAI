"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowLeft, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const router = useRouter();
  
  // 1: Email, 2: Code, 3: New Password
  const [step, setStep] = useState<1 | 2 | 3>(1);
  
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !email.includes("@")) {
      setError("Por favor, insira um e-mail válido.");
      return;
    }

    setIsLoading(true);
    // Simulate API to send code
    setTimeout(() => {
      setIsLoading(false);
      setStep(2);
    }, 1200);
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (code.length < 4) {
      setError("Por favor, insira o código válido recebido.");
      return;
    }

    setIsLoading(true);
    // Simulate API to verify code
    setTimeout(() => {
      setIsLoading(false);
      setStep(3);
    }, 1200);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("A senha deve ter no mínimo 6 caracteres.");
      return;
    }
    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setIsLoading(true);
    // Simulate API to update password
    setTimeout(() => {
      setIsLoading(false);
      router.push("/login");
    }, 1500);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black selection:bg-blue-500/30 font-sans">
      {/* Background Glow Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] glow-blue blur-[120px] rounded-full opacity-60"></div>
      <div className="absolute top-1/2 left-1/2 translate-x-[-30%] translate-y-[-70%] w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] glow-purple blur-[100px] rounded-full opacity-50"></div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-[420px] p-8 mx-4 glassmorphism overflow-hidden relative"
      >
        <Link 
          href="/login" 
          className="absolute top-6 left-6 text-gray-500 hover:text-white transition-colors"
          title="Voltar para o login"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>

        {/* Dynamic Headers */}
        <div className="text-center mb-8 mt-4">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="header-1" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}>
                <h1 className="text-2xl font-semibold text-white tracking-tight">Recuperar Senha</h1>
                <p className="text-gray-400 text-sm mt-3">Enviaremos um código para o seu e-mail.</p>
              </motion.div>
            )}
            {step === 2 && (
              <motion.div key="header-2" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}>
                <h1 className="text-2xl font-semibold text-white tracking-tight">Digite o Código</h1>
                <p className="text-gray-400 text-sm mt-3">Verifique a caixa de entrada de {email}</p>
              </motion.div>
            )}
            {step === 3 && (
              <motion.div key="header-3" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}>
                <h1 className="text-2xl font-semibold text-white tracking-tight">Nova Senha</h1>
                <p className="text-gray-400 text-sm mt-3">Defina sua nova senha de acesso seguro.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Dynamic Forms */}
        <AnimatePresence mode="wait">
          {/* STEP 1: EMAIL */}
          {step === 1 && (
            <motion.form 
              key="step-1"
              onSubmit={handleSendEmail} 
              className="space-y-5"
              initial={{ opacity: 0, x: -10 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: 10 }}
            >
              <div className="space-y-4">
                <Input
                  id="email"
                  type="email"
                  placeholder="Seu e-mail de acesso"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  icon={<Mail className="h-4 w-4" />}
                  required
                />
              </div>

              {error && <p className="text-red-400 text-sm font-medium mt-1">{error}</p>}

              <Button type="submit" className="w-full h-12 text-base font-semibold" disabled={isLoading}>
                {isLoading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processando...</> : "Enviar Código"}
              </Button>
            </motion.form>
          )}

          {/* STEP 2: CODE */}
          {step === 2 && (
            <motion.form 
              key="step-2"
              onSubmit={handleVerifyCode} 
              className="space-y-5"
              initial={{ opacity: 0, x: -10 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: 10 }}
            >
              <div className="space-y-4">
                <Input
                  id="code"
                  type="text"
                  placeholder="Código de verificação"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  icon={<KeyRound className="h-4 w-4" />}
                  required
                />
              </div>

              {error && <p className="text-red-400 text-sm font-medium mt-1">{error}</p>}

              <Button type="submit" className="w-full h-12 text-base font-semibold" disabled={isLoading}>
                {isLoading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Verificando...</> : "Continuar"}
              </Button>

              <div className="text-center text-sm mt-4">
                <button type="button" onClick={() => setStep(1)} className="text-gray-400 hover:text-white transition-colors">
                  Não recebeu? Tentar novamente
                </button>
              </div>
            </motion.form>
          )}

          {/* STEP 3: RESET PASSWORD */}
          {step === 3 && (
            <motion.form 
              key="step-3"
              onSubmit={handleResetPassword} 
              className="space-y-5"
              initial={{ opacity: 0, x: -10 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: 10 }}
            >
              <div className="space-y-4">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Nova Senha (mín. 6 caracteres)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  icon={<Lock className="h-4 w-4" />}
                  required
                  rightElement={
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="hover:text-white transition-colors focus:outline-none">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  }
                />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Repetir Nova Senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  icon={<Lock className="h-4 w-4" />}
                  required
                  rightElement={
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="hover:text-white transition-colors focus:outline-none">
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  }
                />
              </div>

              {error && <p className="text-red-400 text-sm font-medium mt-1">{error}</p>}

              <Button type="submit" className="w-full h-12 text-base font-semibold" disabled={isLoading}>
                {isLoading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Salvando...</> : "Redefinir Senha"}
              </Button>
            </motion.form>
          )}
        </AnimatePresence>

      </motion.div>
    </div>
  );
}
