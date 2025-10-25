const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// WSL 환경에서 최소한의 안정적인 설정만 유지
config.maxWorkers = Math.max(1, Math.floor(require("os").cpus().length * 0.75));

module.exports = config;
