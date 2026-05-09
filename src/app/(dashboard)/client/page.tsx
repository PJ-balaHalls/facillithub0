import { createClient } from "@/lib/server";

export default async function ClientDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Olá, {user?.user_metadata?.full_name || 'Cliente'}
          </h1>
          <p className="text-gray-600">
            Bem-vindo à sua área do cliente Facillit Hub. O seu painel de infraestrutura e resultados estará disponível aqui em breve.
          </p>
        </div>
      </div>
    </div>
  );
}