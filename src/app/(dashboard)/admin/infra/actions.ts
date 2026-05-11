"use server";

export async function checkServerEnvs() {
  // Lista exata de variáveis privadas que o servidor deve ter
  const serverEnvs = [
    "SUPABASE_SERVICE_ROLE_KEY",
    "APIFY_TOKEN",
    "APIFY_MAPS_ACTOR_ID",
    "GEMINI_API_KEY",
    "GITHUB_TOKEN",
    "GITHUB_ORG"
  ];

  // Verifica a existência de cada uma (não retornamos os valores por segurança)
  const results = serverEnvs.map((envName) => {
    const isSet = !!process.env[envName];
    return {
      name: envName,
      status: isSet ? "OK" : "MISSING",
    };
  });

  // Delay simulado de 1 segundo para o efeito de auditoria no terminal
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return results;
}