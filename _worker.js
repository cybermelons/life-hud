export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    let pathname = url.pathname;
    
    // Define route mappings for clean URLs
    const routes = {
      '/': '/index.html',
      '/inventory': '/inventory.html',
      '/library': '/library.html',
      '/mind': '/mind/index.html',
      '/body': '/body/index.html',
      '/mind/feelings': '/mind/feelings/index.html',
      '/body/senses': '/body/senses/index.html',
      '/body/actions': '/body/actions/index.html'
    };
    
    // Check if we have a specific route mapping
    if (routes[pathname]) {
      pathname = routes[pathname];
    }
    // If path has no extension and isn't mapped, try adding .html
    else if (!pathname.includes('.') && pathname !== '/') {
      // First try the exact path with .html
      const withHtml = pathname + '.html';
      // Also try as an index.html in a directory
      const asIndex = pathname + '/index.html';
      
      // Try the direct .html file first
      const directRequest = new Request(new URL(withHtml, request.url).toString(), request);
      const directResponse = await env.ASSETS.fetch(directRequest);
      if (directResponse.status === 200) {
        return directResponse;
      }
      
      // Then try as directory with index.html
      pathname = asIndex;
    }
    
    // Create new request with the resolved pathname
    const modifiedRequest = new Request(new URL(pathname, request.url).toString(), request);
    
    // Try to fetch the asset
    const response = await env.ASSETS.fetch(modifiedRequest);
    
    // If successful, return it
    if (response.status === 200) {
      return response;
    }
    
    // If not found, return index.html as fallback (for client-side handling)
    return env.ASSETS.fetch(new Request(url.origin + '/index.html', request));
  },
};