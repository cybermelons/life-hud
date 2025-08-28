export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    let pathname = url.pathname;
    
    // Route mappings for clean URLs
    const routes = {
      '/': '/index.html',
      '/inventory': '/inventory.html',
      '/library': '/library.html',
      '/threads': '/threads.html',
      '/mind': '/mind/index.html',
      '/body': '/body/index.html',
      '/mind/feelings': '/mind/feelings.html',
      '/body/senses': '/body/senses.html',
      '/body/actions': '/body/actions.html'
    };
    
    // Check if we have a route mapping
    if (routes[pathname]) {
      pathname = routes[pathname];
    } else if (!pathname.includes('.') && pathname !== '/') {
      // If no extension, try adding .html
      pathname = pathname + '.html';
    }
    
    // Try to serve the asset using the ASSETS binding
    try {
      // Create a new request with the mapped pathname
      const assetRequest = new Request(new URL(pathname, request.url), request);
      const response = await env.ASSETS.fetch(assetRequest);
      
      // If successful, return the response
      if (response.status !== 404) {
        return response;
      }
      
      // If 404 and no extension, already tried with .html, so return 404
      return new Response('Not found', { status: 404 });
    } catch (e) {
      // Return error response
      return new Response(`Error: ${e.message}`, { 
        status: 500,
        headers: { 'Content-Type': 'text/plain' }
      });
    }
  }
};