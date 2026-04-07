"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vite_1 = require("vite");
var plugin_react_swc_1 = require("@vitejs/plugin-react-swc");
var path_1 = require("path");
exports.default = (0, vite_1.defineConfig)({
    plugins: [(0, plugin_react_swc_1.default)()],
    root: "./client",
    server: {
        proxy: {
            "/api": "http://localhost:3000",
        },
    },
    resolve: {
        alias: {
            "@images": path_1.default.resolve(__dirname, "./client/src/assets/images"),
            "@components": path_1.default.resolve(__dirname, "./client/src/components"),
            "@styles": path_1.default.resolve(__dirname, "./client/src/assets/styles"),
        },
    },
    css: {
        preprocessorOptions: {
            scss: {
                quietDeps: true, // 👈 suppresses Bootstrap's deprecation warnings
            },
        },
    },
    build: {
        chunkSizeWarningLimit: 1000, // increase limit from 500 kB to 1 MB
    },
});
