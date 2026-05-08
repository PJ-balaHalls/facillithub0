import Link from "next/link";
import { registerUser } from "../actions";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Crie sua infraestrutura
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Comece a organizar seu negócio hoje mesmo.
          </p>
        </div>

        <form className="mt-8 space-y-6" action={registerUser}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="fullName" className="sr-only">Nome Completo</label>
              <input
                id="fullName" name="fullName" type="text" required
                placeholder="Nome da Empresa ou Responsável"
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="email" className="sr-only">E-mail Corporativo</label>
              <input
                id="email" name="email" type="email" required
                placeholder="seu@email.com.br"
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Senha</label>
              <input
                id="password" name="password" type="password" required
                placeholder="Crie uma senha forte"
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition">
              Finalizar Cadastro
            </button>
          </div>
        </form>
        <div className="text-center text-sm">
          <Link href="/login" className="font-medium text-brand-500 hover:text-brand-400">
            Já possui uma conta? Entre por aqui.
          </Link>
        </div>
      </div>
    </div>
  );
}