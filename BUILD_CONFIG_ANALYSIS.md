# 빌드 설정 최신화 가이드

## 현재 상태 평가: ✅ 대부분 적절함

### 잘 설정된 부분들

- Expo SDK 54 (최신)
- React Native 0.81.5 (안정)
- TypeScript 5.9.2 (최신)
- 새로운 아키텍처 활성화

### 개선 권장사항

#### 1. Metro 설정 최적화

```javascript
// metro.config.js - 권장 설정
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// 성능 최적화
config.transformer = {
  ...config.transformer,
  minifierConfig: {
    keep_fnames: true,
    mangle: {
      keep_fnames: true,
    },
  },
};

// 파일 해상도 최적화
config.resolver = {
  ...config.resolver,
  sourceExts: ["js", "jsx", "json", "ts", "tsx"],
  assetExts: ["png", "jpg", "jpeg", "gif", "svg", "webp"],
};

module.exports = config;
```

#### 2. Babel 설정 추가

```javascript
// babel.config.js - 권장 설정
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      // 성능 최적화 플러그인들
      ["@babel/plugin-transform-runtime", { regenerator: true }],
    ],
  };
};
```

#### 3. package.json 스크립트 개선

```json
{
  "scripts": {
    "start": "expo start",
    "start:clear": "expo start --clear",
    "start:dev": "expo start --dev-client",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "lint": "expo lint",
    "lint:fix": "expo lint --fix",
    "type-check": "tsc --noEmit",
    "clean": "rm -rf .expo .metro-cache node_modules/.cache",
    "prebuild": "npm run clean",
    "build:android": "eas build --platform android",
    "build:ios": "eas build --platform ios"
  }
}
```

#### 4. 환경 변수 설정

```bash
# .env 파일
EXPO_NO_TYPESCRIPT_CHECK=1
EXPO_NO_METRO_LAZY=1
NODE_ENV=development
```

#### 5. EAS 빌드 설정 최적화

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "resourceClass": "m-medium"
      },
      "android": {
        "resourceClass": "medium"
      }
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "resourceClass": "m-medium"
      },
      "android": {
        "resourceClass": "medium"
      }
    },
    "production": {
      "autoIncrement": true,
      "ios": {
        "resourceClass": "m-medium"
      },
      "android": {
        "resourceClass": "medium"
      }
    }
  }
}
```

## 성능 최적화 팁

### 1. 캐시 활용

```bash
# Metro 캐시 활용
npx expo start --clear

# 의존성 캐시 정리
npm run clean
```

### 2. 개발 환경 최적화

```bash
# Node.js 메모리 증가
export NODE_OPTIONS="--max-old-space-size=4096"

# 병렬 처리 최적화
export EXPO_METRO_MAX_WORKERS=4
```

### 3. 빌드 최적화

- 불필요한 파일 제외
- 소스맵 최적화
- 압축 설정 조정

## 모니터링 및 측정

### 빌드 시간 측정

```bash
# 빌드 시간 측정
time npm run build

# 타입 체크 시간
time npm run type-check
```

### 성능 분석

- React DevTools Profiler
- Metro Bundle Analyzer
- Flipper 디버깅

## 결론

현재 설정은 **최신 버전 기준에 적절**합니다.
추가 최적화를 원한다면 위의 권장사항을 단계적으로 적용하세요.
