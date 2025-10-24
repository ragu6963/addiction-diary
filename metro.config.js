const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// TypeScript 파일 처리 최적화
config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve("metro-react-native-babel-transformer"),
};

// TypeScript 파일 확장자 지원
config.resolver.sourceExts = ["js", "jsx", "json", "ts", "tsx"];

// Metro 캐시 설정
config.cacheStores = [
  {
    name: "metro-cache",
    type: "file",
    options: {
      cacheDirectory: ".metro-cache",
    },
  },
];

// 불필요한 파일 제외
config.resolver.blockList = [
  /node_modules\/.*\/node_modules\/react-native\/.*/,
];

module.exports = config;
