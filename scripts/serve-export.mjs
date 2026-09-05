import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "out");
const port = Number.parseInt(process.argv[2] ?? process.env.PORT ?? "3000", 10);

const mimeTypes = new Map([
  [".css", "text/css; charset=utf-8"],
  [".gif", "image/gif"],
  [".html", "text/html; charset=utf-8"],
  [".ico", "image/x-icon"],
  [".jpeg", "image/jpeg"],
  [".jpg", "image/jpeg"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".map", "application/json; charset=utf-8"],
  [".png", "image/png"],
  [".pdf", "application/pdf"],
  [".svg", "image/svg+xml"],
  [".txt", "text/plain; charset=utf-8"],
  [".ttf", "font/ttf"],
  [".wasm", "application/wasm"],
  [".webp", "image/webp"],
  [".woff", "font/woff"],
  [".woff2", "font/woff2"],
  [".xml", "application/xml; charset=utf-8"],
]);

const isFile = async (filePath) => {
  try {
    return (await stat(filePath)).isFile();
  } catch {
    return false;
  }
};

const resolveRequest = async (pathname) => {
  let decodedPath;
  try {
    decodedPath = decodeURIComponent(pathname);
  } catch {
    return null;
  }

  const relativePath = decodedPath.replace(/^\/+/, "");
  const requestedPath = path.resolve(root, relativePath || "index.html");
  const relativeToRoot = path.relative(root, requestedPath);

  if (relativeToRoot.startsWith("..") || path.isAbsolute(relativeToRoot)) return null;

  const candidates = [requestedPath];
  if (!path.extname(requestedPath)) {
    candidates.push(`${requestedPath}.html`, path.join(requestedPath, "index.html"));
  }

  for (const candidate of candidates) {
    if (await isFile(candidate)) return candidate;
  }

  return null;
};

const server = createServer(async (request, response) => {
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405, { Allow: "GET, HEAD" });
    response.end("Method Not Allowed");
    return;
  }

  const requestUrl = new URL(request.url ?? "/", "http://localhost");
  const requestedFile = await resolveRequest(requestUrl.pathname);
  const filePath = requestedFile ?? path.join(root, "404.html");
  const statusCode = requestedFile ? 200 : 404;

  if (!(await isFile(filePath))) {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Build output not found. Run `pnpm build` first.");
    return;
  }

  const fileStats = await stat(filePath);
  response.writeHead(statusCode, {
    "Cache-Control": "no-cache",
    "Content-Length": fileStats.size,
    "Content-Type": mimeTypes.get(path.extname(filePath).toLowerCase()) ?? "application/octet-stream",
  });

  if (request.method === "HEAD") {
    response.end();
    return;
  }

  createReadStream(filePath).pipe(response);
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`Port ${port} is already in use. Choose another one, for example: pnpm start -- 3001`);
  } else {
    console.error(error);
  }
  process.exitCode = 1;
});

server.listen(port, "0.0.0.0", () => {
  console.log(`Serving static export from ${root}`);
  console.log(`Local:   http://localhost:${port}`);
});
