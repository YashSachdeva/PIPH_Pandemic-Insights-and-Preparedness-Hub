const path = require("path");
const { createServer } = require("vite");
const react = require("@vitejs/plugin-react").default;

async function startClient() {
  const server = await createServer({
    root: path.resolve(__dirname, "..", "client"),
    plugins: [react()],
    server: {
      host: "0.0.0.0",
      port: 5173,
      proxy: {
        "/api": "http://localhost:5000",
        "/legacy-pages": "http://localhost:5000",
        "/images": "http://localhost:5000",
        "/css": "http://localhost:5000",
        "/js": "http://localhost:5000",
        "/uploads": "http://localhost:5000",
        "/register": "http://localhost:5000",
        "/login": {
          target: "http://localhost:5000",
          bypass: (req) => (req.method === "GET" ? "/index.html" : null),
        },
        "/forgot-password": "http://localhost:5000",
        "/reset-password": "http://localhost:5000",
        "/reset-password/verify-otp": "http://localhost:5000",
        "/send": "http://localhost:5000",
        "/requests": "http://localhost:5000",
        "/check-email": "http://localhost:5000",
      },
    },
  });

  await server.listen();
  server.printUrls();
}

startClient().catch((error) => {
  console.error(error);
  process.exit(1);
});
