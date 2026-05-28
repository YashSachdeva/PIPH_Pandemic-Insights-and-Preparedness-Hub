const path = require("path");
const { build } = require("vite");
const react = require("@vitejs/plugin-react").default;

build({
  root: path.resolve(__dirname, "..", "client"),
  plugins: [react()],
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
}).catch((error) => {
  console.error(error);
  process.exit(1);
});
