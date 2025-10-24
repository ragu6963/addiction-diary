# 빌드 오류 해결 가이드

## 발생한 오류

```
SyntaxError: Unexpected reserved word 'interface'. (15:0)
```

## 원인

- Metro 번들러가 TypeScript 파일을 JavaScript로 변환할 때 `interface` 키워드를 인식하지 못함
- 실험적 기능(`typedRoutes`, `reactCompiler`)이 빌드 과정에서 충돌 발생

## 해결 방법

### 1. Metro 설정 수정 ✅

- `metro.config.js`에 올바른 TypeScript 변환기 설정 추가
- Babel 변환기 명시적 지정

### 2. TypeScript 설정 최적화 ✅

- `tsconfig.json`에 필요한 컴파일 옵션 추가
- `skipLibCheck: true`로 라이브러리 타입 체크 건너뛰기

### 3. 실험적 기능 비활성화 ✅

- `app.json`에서 `typedRoutes`와 `reactCompiler` 비활성화
- 안정적인 빌드 환경 구성

### 4. 캐시 정리

```bash
# 캐시 완전 정리
npm run clean

# Metro 캐시 정리
npx expo start --clear
```

## 추가 해결 방법

### Metro 설정 고급 옵션

```javascript
// metro.config.js에 추가할 수 있는 옵션들
const config = getDefaultConfig(__dirname);

// TypeScript 변환 최적화
config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve("metro-react-native-babel-transformer"),
  getTransformOptions: async () => ({
    transform: {
      experimentalImportSupport: false,
      inlineRequires: true,
    },
  }),
};

// 파일 해상도 최적화
config.resolver = {
  ...config.resolver,
  sourceExts: ["js", "jsx", "json", "ts", "tsx"],
  assetExts: ["png", "jpg", "jpeg", "gif", "svg"],
};
```

### 환경 변수 설정

```bash
# .env 파일에 추가
EXPO_NO_TYPESCRIPT_CHECK=1
EXPO_NO_METRO_LAZY=1
```

### 빌드 명령어 최적화

```bash
# 안전한 빌드 명령어
npx expo export --platform android --dev false --clear

# 또는 EAS 빌드 사용
eas build --platform android --clear-cache
```

## 예방 방법

1. **정기적인 캐시 정리**: 빌드 전 항상 캐시 정리
2. **의존성 업데이트**: Expo SDK와 관련 패키지 정기 업데이트
3. **실험적 기능 신중 사용**: 프로덕션 빌드에서는 안정된 기능만 사용
4. **TypeScript 설정 검증**: 빌드 전 타입 체크 실행

## 모니터링

빌드 성공 후 다음 명령어로 상태 확인:

```bash
# 타입 체크
npx tsc --noEmit

# 린트 검사
npx expo lint

# 로컬 빌드 테스트
npx expo export --platform android --dev false
```
