function backendBase() {
  return (process.env.BACKEND_URL || 'http://127.0.0.1:8000')
    .replace(/\/$/, '')
    .replace(/\/api\/v1$/, '');
}

function buildTarget(requestUrl, prefix, pathParts = []) {
  const sourceUrl = new URL(requestUrl);
  const cleanPath = pathParts.map((part) => encodeURIComponent(part)).join('/');
  const base = `${backendBase()}${prefix}${cleanPath ? `/${cleanPath}` : ''}`;
  return `${base}${sourceUrl.search}`;
}

function forwardedHeaders(request) {
  const headers = new Headers(request.headers);
  for (const name of ['host', 'connection', 'content-length']) headers.delete(name);
  return headers;
}

function responseHeaders(upstream) {
  const headers = new Headers(upstream.headers);
  // Node fetch may transparently decode the upstream body. Let Next compute the
  // outgoing length/encoding so the browser never receives stale metadata.
  for (const name of ['connection', 'content-length', 'content-encoding', 'transfer-encoding']) {
    headers.delete(name);
  }
  return headers;
}

export async function proxyToBackend(request, pathParts, prefix) {
  const target = buildTarget(request.url, prefix, pathParts);
  const init = {
    method: request.method,
    headers: forwardedHeaders(request),
    cache: 'no-store',
    redirect: 'follow',
  };

  if (!['GET', 'HEAD'].includes(request.method)) {
    init.body = await request.arrayBuffer();
  }

  try {
    const upstream = await fetch(target, init);
    return new Response(request.method === 'HEAD' ? null : upstream.body, {
      status: upstream.status,
      statusText: upstream.statusText,
      headers: responseHeaders(upstream),
    });
  } catch (error) {
    console.error('AdGenie backend proxy failed:', target, error);
    return Response.json(
      { detail: 'Backend is unavailable. Check BACKEND_URL and the backend service status.' },
      { status: 502 },
    );
  }
}
