import { createClient } from "@/lib/server";

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Bem-vindo, {user?.user_metadata?.full_name || 'Membro da Equipe'}
        </h1>
        <p className="text-gray-600">
          Este é o seu centro de controle Facillit Hub OS. A partir daqui você orquestra as automações e gerencia as contas dos clientes locais.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Cards de Métricas Futuras */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500">Clientes Ativos</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500">Fluxos n8n Rodando</h3>
          <p className="text-3xl font-bold text-brand-500 mt-2">0</p>
        </div>
      </div>
    </div>
  );
}