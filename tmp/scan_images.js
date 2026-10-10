const sites = [
  { id: "demo-barbearia-kings", url: "https://king-s-barber-2-yn3c.vercel.app" },
  { id: "demo-salao-premium", url: "https://sal-o-premium.vercel.app" },
  { id: "demo-nova-arq", url: "https://nexaweb-nova-arq-1.vercel.app" },
  { id: "demo-lumiere", url: "https://nexaweb-lumiere.vercel.app" },
  { id: "demo-vertex-digital", url: "https://nexaweb-vertex-digital.vercel.app" },
  { id: "demo-pet-shop", url: "https://pet-shop-personalidade-e-profission.vercel.app" },
  { id: "demo-restaurante-premium", url: "https://restaurante-premium-delta.vercel.app" },
  { id: "demo-academia-premium", url: "https://academia-premium-beryl.vercel.app" },
  { id: "demo-engenharia-premium", url: "https://engenharia-premium.vercel.app" },
  { id: "demo-imobiliaria-premium", url: "https://imobili-ria-premium.vercel.app" },
  { id: "demo-loja-premium", url: "https://loja-premium.vercel.app" },
  { id: "demo-clinica-saude", url: "https://grok-workspace-1-three-alpha.vercel.app" },
  { id: "demo-grok-workspace-puce", url: "https://grok-workspace-puce.vercel.app" }
];

async function scan() {
  for (const s of sites) {
    try {
      const htmlRes = await fetch(s.url);
      const html = await htmlRes.text();
      const jsMatches = [...html.matchAll(/src="([^"]+\.js)"/g)].map(m => m[1]);
      let allImgs = [];
      for (const jsPath of jsMatches) {
        const jsUrl = jsPath.startsWith("http") ? jsPath : new URL(jsPath, s.url).href;
        const jsRes = await fetch(jsUrl);
        const jsText = await jsRes.text();
        const imgMatches = [...jsText.matchAll(/(https?:\/\/[^"'\`\s\)]+\.(?:jpg|jpeg|png|webp)|(?:\/assets\/[^"'\`\s\)]+\.(?:jpg|jpeg|png|webp)))/gi)].map(m => m[1]);
        for (const img of imgMatches) {
          const fullImgUrl = img.startsWith("http") ? img : new URL(img, s.url).href;
          if (!allImgs.includes(fullImgUrl)) {
            allImgs.push(fullImgUrl);
          }
        }
      }
      console.log(`\n=== ${s.id} (${allImgs.length} images) ===`);
      console.log(JSON.stringify(allImgs.slice(0, 10), null, 2));
    } catch (e) {
      console.error(`Error on ${s.id}:`, e.message);
    }
  }
}
scan();
