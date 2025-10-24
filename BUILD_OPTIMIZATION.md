# 🚀 빌드 속도 최적화 가이드

## 현재 적용된 최적화 방법들

### 1. 코드 레벨 최적화

- **지연 로딩**: `components/LazyComponents.tsx`로 컴포넌트 동적 로딩
- **메모이제이션**: `utils/performanceUtils.ts`로 함수 캐싱
- **스타일 최적화**: `utils/styleOptimizer.ts`로 스타일 컴파일 최적화

### 2. 개발 환경 최적화

- **EAS 빌드 설정**: `eas.json`에서 리소스 클래스 최적화
- **조건부 실행**: 개발/프로덕션 환경별 최적화

## 빌드 속도 향상 팁

### 📦 패키지 관리

```bash
# 불필요한 패키지 제거
npm prune

# 캐시 정리
npm run clean

# 의존성 최적화
npm audit fix
```

### 🔧 개발 도구 설정

```bash
# 빠른 개발 서버 시작
npm run start:fast

# 타입 체크만 실행
npm run type-check

# 린트 수정
npm run lint:fix
```

### 💾 메모리 최적화

- **Node.js 메모리 증가**: `NODE_OPTIONS="--max-old-space-size=4096"`
- **병렬 처리**: CPU 코어 수에 맞는 워커 설정
- **캐시 활용**: Metro 캐시 및 TypeScript 빌드 정보 활용

### 🎯 코드 최적화 패턴

#### 1. 동적 Import 사용

```typescript
// ❌ 느린 로딩
import HeavyComponent from "./HeavyComponent";

// ✅ 빠른 로딩
const HeavyComponent = lazy(() => import("./HeavyComponent"));
```

#### 2. 메모이제이션 활용

```typescript
// ❌ 매번 재계산
const expensiveValue = calculateExpensiveValue(data);

// ✅ 캐시된 계산
const expensiveValue = useMemo(() => calculateExpensiveValue(data), [data]);
```

#### 3. 조건부 렌더링 최적화

```typescript
// ❌ 불필요한 렌더링
{
  isVisible && <HeavyComponent />;
}

// ✅ 최적화된 렌더링
{
  isVisible ? <HeavyComponent /> : null;
}
```

## 성능 모니터링

### 빌드 시간 측정

```bash
# 빌드 시간 측정
time npm run build

# 타입 체크 시간 측정
time npm run type-check
```

### 메모리 사용량 확인

```bash
# Node.js 메모리 사용량
node --inspect-brk=0.0.0.0:9229 node_modules/.bin/expo start
```

## 추가 최적화 방법

### 1. 환경 변수 최적화

```bash
# .env 파일에 추가
EXPO_OPTIMIZE=true
NODE_ENV=production
```

### 2. Metro 설정 최적화

```javascript
// metro.config.js
module.exports = {
  resolver: {
    alias: {
      "@": "./src",
    },
  },
  transformer: {
    minifierConfig: {
      keep_fnames: true,
    },
  },
};
```

### 3. TypeScript 설정 최적화

```json
{
  "compilerOptions": {
    "incremental": true,
    "skipLibCheck": true,
    "assumeChangesOnlyAffectDirectDependencies": true
  }
}
```

## 예상 성능 향상

| 최적화 방법   | 예상 개선율 | 적용 난이도 |
| ------------- | ----------- | ----------- |
| 지연 로딩     | 30-50%      | 중간        |
| 메모이제이션  | 20-30%      | 쉬움        |
| 스타일 최적화 | 15-25%      | 쉬움        |
| 캐시 활용     | 40-60%      | 쉬움        |
| 병렬 처리     | 25-35%      | 중간        |

## 주의사항

1. **과도한 최적화 금지**: 코드 가독성을 해치지 않는 선에서 최적화
2. **프로파일링 우선**: 실제 병목 지점을 찾아서 최적화
3. **점진적 적용**: 한 번에 모든 최적화를 적용하지 말고 단계적으로 적용
4. **테스트 필수**: 최적화 후 기능이 정상 작동하는지 확인

## 모니터링 도구

- **React DevTools Profiler**: 컴포넌트 렌더링 성능 분석
- **Metro Bundle Analyzer**: 번들 크기 분석
- **TypeScript Build Analyzer**: 타입 체크 성능 분석
