module.exports = function (api) {
  api.cache(true);

  const isDev = api.env("development");
  const isProd = api.env("production");

  return {
    presets: [
      [
        "babel-preset-expo",
        {
          lazyImports: true,
          web: { useTransformReactJSXExperimental: true },
        },
      ],
    ],
    plugins: [
      // 성능 최적화 플러그인들
      [
        "@babel/plugin-transform-runtime",
        {
          regenerator: true,
          useESModules: true,
        },
      ],

      // React 최적화
      [
        "@babel/plugin-transform-react-jsx",
        {
          runtime: "automatic",
        },
      ],
    ],
  };
};
