import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

const LOGX = path.resolve(__dirname, "../logx/src");
const LOGX_REACT = path.resolve(__dirname, "../logx-react/src");

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@mwakidenis/logx/array": path.resolve(LOGX, "array/index.ts"),
      "@mwakidenis/logx/object": path.resolve(LOGX, "object/index.ts"),
      "@mwakidenis/logx/string": path.resolve(LOGX, "string/index.ts"),
      "@mwakidenis/logx/math": path.resolve(LOGX, "math/index.ts"),
      "@mwakidenis/logx-react/hooks/useDebouncedValue": path.resolve(
        LOGX_REACT,
        "hooks/useDebouncedValue.ts",
      ),
      "@mwakidenis/logx-react/hooks/useCounter": path.resolve(
        LOGX_REACT,
        "hooks/useCounter.ts",
      ),
      "@mwakidenis/logx-react/hooks/useLocalStorage": path.resolve(
        LOGX_REACT,
        "hooks/useLocalStorage.ts",
      ),
      "@mwakidenis/logx-react/components/ErrorBoundary": path.resolve(
        LOGX_REACT,
        "components/ErrorBoundary.tsx",
      ),
      "@mwakidenis/logx-react/components/CopyButton": path.resolve(
        LOGX_REACT,
        "components/CopyButton.tsx",
      ),
    },
  },
  test: {
    environment: "node",
    include: ["src/__tests__/**/*.test.ts"],
    globals: true,
    alias: {
      "@mwakidenis/logx/array": path.resolve(LOGX, "array/index.ts"),
      "@mwakidenis/logx/object": path.resolve(LOGX, "object/index.ts"),
      "@mwakidenis/logx/string": path.resolve(LOGX, "string/index.ts"),
      "@mwakidenis/logx/math": path.resolve(LOGX, "math/index.ts"),
    },
  },
  server: {
    port: 5173,
    open: true,
  },
});
