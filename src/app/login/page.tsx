"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
  const supabase = createClient();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push("/dashboard");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              first_name: firstName,
              last_name: lastName,
            },
          },
        });
        if (error) throw error;
        // Supabase will automatically create the profile via the trigger we set up in SQL
        // Usually, signUp requires email confirmation unless disabled in Supabase dashboard
        setError("Registro exitoso. Si tu proyecto requiere confirmación por correo, revisa tu bandeja de entrada. De lo contrario, puedes iniciar sesión.");
        setIsLogin(true);
      }
    } catch (err: any) {
      setError(err.message || "Ocurrió un error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center relative overflow-hidden bg-zinc-950">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-[url('/images/inscripciones-hero.jpg')] bg-cover bg-center bg-no-repeat"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/40"></div>
      </div>

      <div className="relative z-10 w-full max-w-[90%] sm:max-w-md mx-auto">
        <div className="bg-white/10 dark:bg-black/40 backdrop-blur-2xl border border-white/10 p-5 sm:p-8 rounded-3xl shadow-2xl">
          <div className="text-center mb-6">
            <h1 className="text-2xl sm:text-4xl font-headline font-black text-white mb-2 tracking-tight">
              {isLogin ? "BIENVENIDO" : "ÚNETE AL EQUIPO"}
            </h1>
            <p className="text-zinc-400 font-body text-xs sm:text-base">
              {isLogin
                ? "Ingresa a tu portal de jugador o staff"
                : "Crea tu perfil para gestionar tus torneos"}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 text-red-200 rounded-xl text-xs sm:text-sm font-body text-center animate-pulse">
              {error}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-4">
            {!isLogin && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] sm:text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Nombre</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-black/20 border border-white/10 rounded-xl focus:outline-none focus:border-red-500 focus:bg-black/40 text-white text-sm transition-all placeholder:text-zinc-600"
                    placeholder="Juan"
                  />
                </div>
                <div>
                  <label className="block text-[10px] sm:text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Apellido</label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-black/20 border border-white/10 rounded-xl focus:outline-none focus:border-red-500 focus:bg-black/40 text-white text-sm transition-all placeholder:text-zinc-600"
                    placeholder="Pérez"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[10px] sm:text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Correo Electrónico</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-black/20 border border-white/10 rounded-xl focus:outline-none focus:border-red-500 focus:bg-black/40 text-white text-sm transition-all placeholder:text-zinc-600"
                placeholder="tu@correo.com"
              />
            </div>

            <div>
              <label className="block text-[10px] sm:text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Contraseña</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-black/20 border border-white/10 rounded-xl focus:outline-none focus:border-red-500 focus:bg-black/40 text-white text-sm transition-all placeholder:text-zinc-600"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 sm:py-4 mt-2 bg-[#E31837] text-white rounded-xl font-headline font-black text-sm sm:text-base uppercase tracking-widest shadow-[0_4px_14px_0_rgba(227,24,55,0.39)] hover:shadow-[0_6px_20px_rgba(227,24,55,0.23)] hover:bg-red-700 active:scale-95 transition-all disabled:opacity-50"
            >
              {loading ? "Cargando..." : isLogin ? "Iniciar Sesión" : "Crear Cuenta"}
            </button>
          </form>

          <div className="mt-6 text-center border-t border-white/5 pt-4">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-xs sm:text-sm font-body text-zinc-400 hover:text-white transition-colors"
            >
              {isLogin
                ? "¿No tienes cuenta? Regístrate aquí"
                : "¿Ya tienes cuenta? Inicia sesión"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
