export default function AdminPage() {
  return (
    <div className="max-w-6xl">
      <div className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight text-primary mb-2">Painel de Orquestração</h1>
        <p className="text-gray-500">Acompanhe o crescimento e a saúde da infraestrutura dos seus clientes.</p>
      </div>

      {/* Grid de Métricas com Linhas Divisórias */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-gray-100 rounded-2xl bg-white overflow-hidden shadow-sm">
        <div className="p-8 border-b md:border-b-0 md:border-r border-gray-100">
          <p className="text-sm font-medium text-gray-400 mb-1">Clientes Totais</p>
          <p className="text-4xl font-bold text-primary">12</p>
          <p className="mt-2 text-xs text-green-500 font-bold">+2 este mês</p>
        </div>
        <div className="p-8 border-b md:border-b-0 md:border-r border-gray-100">
          <p className="text-sm font-medium text-gray-400 mb-1">Automações n8n</p>
          <p className="text-4xl font-bold text-primary">48</p>
          <p className="mt-2 text-xs text-blue-500 font-bold">99.8% Uptime</p>
        </div>
        <div className="p-8">
          <p className="text-sm font-medium text-gray-400 mb-1">MRR Projetado</p>
          <p className="text-4xl font-bold text-primary">R$ 5.400</p>
          <p className="mt-2 text-xs text-gray-400 uppercase tracking-widest font-bold">Estágio 1</p>
        </div>
      </div>

      {/* Seção de Atividades Recentes */}
      <div className="mt-16">
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-xl font-bold text-primary">Logs Recentes</h2>
          <button className="text-sm font-bold text-brand-500 hover:underline">Ver todos</button>
        </div>
        
        <div className="space-y-0 border-t border-gray-100">
          {[1, 2, 3].map((i) => (
            <div key={i} className="py-5 border-b border-gray-50 flex items-center justify-between group hover:bg-gray-50/50 px-2 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <div>
                  <p className="text-sm font-bold text-gray-800">Novo lead capturado via Finder</p>
                  <p className="text-xs text-gray-400">Barbearia do João • há 14 minutos</p>
                </div>
              </div>
              <button className="text-xs font-medium text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1 border border-gray-200 rounded-md">Detalhes</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}