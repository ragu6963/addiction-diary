const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// 2025년 최신 최적화 설정
config.maxWorkers = Math.max(1, Math.floor(require("os").cpus().length * 0.75));

// 변환기 최적화 (WSL 환경 호환성 개선)
config.transformer = {
  ...config.transformer,
  // Babel 변환기 명시적 지정
  babelTransformerPath: require.resolve("metro-react-native-babel-transformer"),
  minifierConfig: {
    keep_fnames: true,
    mangle: {
      keep_fnames: true,
    },
    compress: {
      drop_console: true,
      drop_debugger: true,
    },
  },
  getTransformOptions: async () => ({
    transform: {
      experimentalImportSupport: false,
      inlineRequires: true,
      unstable_disableES6Transforms: false,
    },
  }),
};

// 해상도 최적화
config.resolver = {
  ...config.resolver,
  sourceExts: ["js", "jsx", "json", "ts", "tsx"],
  assetExts: ["png", "jpg", "jpeg", "gif", "svg", "webp", "avif"],
  resolverMainFields: ["react-native", "browser", "main"],
  platforms: ["ios", "android", "native", "web"],
};

module.exports = config;
