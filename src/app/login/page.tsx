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
    <div className="min-h-[80vh] flex items-center justify-center bg-surface p-4">
      <div className="max-w-md w-full bg-surface-container-lowest p-8 rounded-2xl shadow-xl border border-surface-container-highest">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-headline font-bold text-on-surface mb-2">
            {isLogin ? "Bienvenido de vuelta" : "Únete a Kansas Flag"}
          </h1>
          <p className="text-tertiary font-body">
            {isLogin
              ? "Ingresa a tu portal de jugador o staff"
              : "Crea tu perfil para gestionar tus torneos y pagos"}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-error-container text-on-error-container rounded-lg text-sm font-body">
            {error}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          {!isLogin && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-label text-on-surface-variant mb-1">Nombre</label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-4 py-2 bg-surface-container rounded-lg border border-surface-container-highest focus:outline-none focus:border-primary-container text-on-surface"
                  placeholder="Juan"
                />
              </div>
              <div>
                <label className="block text-sm font-label text-on-surface-variant mb-1">Apellido</label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-4 py-2 bg-surface-container rounded-lg border border-surface-container-highest focus:outline-none focus:border-primary-container text-on-surface"
                  placeholder="Pérez"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-label text-on-surface-variant mb-1">Correo Electrónico</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-surface-container rounded-lg border border-surface-container-highest focus:outline-none focus:border-primary-container text-on-surface"
              placeholder="tu@correo.com"
            />
          </div>

          <div>
            <label className="block text-sm font-label text-on-surface-variant mb-1">Contraseña</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-surface-container rounded-lg border border-surface-container-highest focus:outline-none focus:border-primary-container text-on-surface"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-4 bg-primary-container text-on-primary rounded-full font-label font-bold hover:bg-primary transition-colors disabled:opacity-50"
          >
            {loading ? "Cargando..." : isLogin ? "Iniciar Sesión" : "Crear Cuenta"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm font-body text-primary-container hover:underline"
          >
            {isLogin
              ? "¿No tienes cuenta? Regístrate aquí"
              : "¿Ya tienes cuenta? Inicia sesión"}
          </button>
        </div>
      </div>
    </div>
  );
}
