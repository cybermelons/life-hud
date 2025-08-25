// Cloudflare Worker to serve static PWA files
import indexHTML from './index.html';
import inventoryHTML from './inventory.html';
import appJS from './app.js';
import swJS from './sw.js';
import manifestJSON from './manifest.json';

const files = {
  '/': indexHTML,
  '/index.html': indexHTML,
  '/inventory': inventoryHTML,
  '/inventory.html': inventoryHTML,
  '/app.js': appJS,
  '/sw.js': swJS,
  '/manifest.json': manifestJSON,
};

export default {
  async fetch(request) {
    const url = new URL(request.url);
    let path = url.pathname;
    
    // Handle root paths
    if (path.endsWith('/')) {
      path = path.slice(0, -1) || '/';
    }
    
    // Check if we have the file
    if (files[path]) {
      // Determine content type
      let contentType = 'text/html';
      if (path.endsWith('.js')) contentType = 'application/javascript';
      else if (path.endsWith('.json')) contentType = 'application/json';
      
      return new Response(files[path], {
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=3600',
          'Service-Worker-Allowed': '/',
        },
      });
    }
    
    // Default to index.html for client-side routing
    return new Response(indexHTML, {
      headers: {
        'Content-Type': 'text/html',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  },
};