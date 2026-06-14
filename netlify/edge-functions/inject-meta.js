export default async (request, context) => {
  const url = new URL(request.url);
  const userAgent = request.headers.get("user-agent") || "";
  
  // Detect social media crawler bots
  const isBot = /facebookexternalhit|WhatsApp|Twitterbot|LinkedInBot|TelegramBot/i.test(userAgent);
  
  // If it's a regular user browser, continue to normal React routing
  if (!isBot) return;

  try {
    const pathParts = url.pathname.split("/");
    const storeSlug = pathParts[2];
    const productSlug = pathParts[4];

    if (!storeSlug || !productSlug) return;

    // Fetch product details from your Render production backend
    const apiRes = await fetch(`https://your-render-backend-url.onrender.com/public/store/${storeSlug}/product/${productSlug}`);
    
    if (!apiRes.ok) return;
    const data = await apiRes.json();
    
    if (!data || !data.product) return;
    const { product, store } = data;

    // Get the base index.html file
    const response = await context.next();
    let html = await response.text();

    // Construct social preview tags explicitly
    const metaTags = `
      <title>${product.productName} | ${store.storeName}</title>
      <meta property="og:type" content="product" />
      <meta property="og:title" content="${product.productName}" />
      <meta property="og:description" content="${product.description || 'View our latest collection.'}" />
      <meta property="og:image" content="${product.images?.[0] || ''}" />
      <meta property="og:url" content="${url.href}" />
    `;

    // Inject tags cleanly before the head closing tag
    html = html.replace("</head>", `${metaTags}</head>`);

    // Force a 200 OK response with full content size header to eliminate the 206 error
    return new Response(html, {
      status: 200,
      headers: { 
        "content-type": "text/html; charset=utf-8",
        "content-length": String(new TextEncoder().encode(html).length)
      },
    });
  } catch (error) {
    console.error("Edge function error:", error);
    return; // Fall back to standard SPA distribution cleanly on failure
  }
};