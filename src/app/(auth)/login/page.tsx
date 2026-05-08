"use client";
import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [userType, setUserType] = useState<"client" | "team">("client");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Acesse sua conta
          </h2>
        </div>

        {/* UX: Seletor de contexto */}
        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setUserType("client")}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition ${userType === "client" ? "bg-white shadow text-black" : "text-gray-500"}`}
          >
            Sou Cliente
          </button>
          <button
            onClick={() => setUserType("team")}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition ${userType === "team" ? "bg-white shadow text-black" : "text-gray-500"}`}
          >
            Sou Equipe
          </button>
        </div>

        <form className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">E-mail</label>
              <input
                id="email" name="email" type="email" required
                placeholder={userType === "team" ? "seu.nome@facillithub.com.br" : "seu@email.com"}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Senha</label>
              <input
                id="password" name="password" type="password" required
                placeholder="Senha"
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900">
              Entrar
            </button>
          </div>
        </form>
        <div className="text-center text-sm">
          <Link href="/register" className="font-medium text-brand-500 hover:text-brand-400">
            Ainda não tem conta? Crie uma aqui.
          </Link>
        </div>
      </div>
    </div>
  );
}