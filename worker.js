import { getAssetFromKV } from '@cloudflare/kv-asset-handler';

export default {
  async fetch(request, env, ctx) {
    try {
      // Handle clean URLs for the PWA
      const url = new URL(request.url);
      let pathname = url.pathname;
      
      // Define route mappings for clean URLs
      const routes = {
        '/': '/index.html',
        '/inventory': '/inventory.html',
        '/library': '/library.html',
        '/mind': '/mind/index.html',
        '/body': '/body/index.html',
        '/mind/feelings': '/mind/feelings.html',
        '/body/senses': '/body/senses.html',
        '/body/actions': '/body/actions.html'
      };
      
      // Check if we have a specific route mapping
      if (routes[pathname]) {
        const mappedRequest = new Request(url.origin + routes[pathname], request);
        return await getAssetFromKV(
          {
            request: mappedRequest,
            waitUntil: ctx.waitUntil.bind(ctx)
          },
          {
            ASSET_NAMESPACE: env.__STATIC_CONTENT,
            ASSET_MANIFEST: JSON.parse(env.__STATIC_CONTENT_MANIFEST)
          }
        );
      }
      
      // Try to serve the asset as-is
      return await getAssetFromKV(
        {
          request,
          waitUntil: ctx.waitUntil.bind(ctx)
        },
        {
          ASSET_NAMESPACE: env.__STATIC_CONTENT,
          ASSET_MANIFEST: JSON.parse(env.__STATIC_CONTENT_MANIFEST)
        }
      );
      
    } catch (e) {
      // If asset not found and path has no extension, try with .html
      const url = new URL(request.url);
      if (!url.pathname.includes('.')) {
        try {
          const htmlRequest = new Request(url.origin + url.pathname + '.html', request);
          return await getAssetFromKV(
            {
              request: htmlRequest,
              waitUntil: ctx.waitUntil.bind(ctx)
            },
            {
              ASSET_NAMESPACE: env.__STATIC_CONTENT,
              ASSET_MANIFEST: JSON.parse(env.__STATIC_CONTENT_MANIFEST)
            }
          );
        } catch (htmlError) {
          // If still not found, serve 404
        }
      }
      
      // Return 404 response
      return new Response('Not found', { 
        status: 404,
        headers: {
          'Content-Type': 'text/plain'
        }
      });
    }
  },
};