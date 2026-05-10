// src/components/ConditionalGTM.tsx
"use client";

import { usePathname } from "next/navigation";

interface ConditionalGTMProps {
  gtmId: string;
}

export default function ConditionalGTM({ gtmId }: ConditionalGTMProps) {
  const pathname = usePathname();

  // Rotas onde o GTM será carregado (ajuste conforme necessário)
  const shouldLoadGTM = pathname === "/" || pathname.startsWith("/client");

  if (!shouldLoadGTM || !gtmId) return null;

  return (
    <>
      {/* Google Tag Manager (script no head) */}
      <script
        dangerouslySetInnerHTML={{
          __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmId}');`,
        }}
      />

      {/* Google Tag Manager (noscript no body) */}
      <noscript
        dangerouslySetInnerHTML={{
          __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=${gtmId}"
height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
        }}
      />
    </>
  );
}