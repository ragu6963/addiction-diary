# 디자인 시스템

이 프로젝트는 일관성 있고 확장 가능한 디자인 시스템을 사용합니다.

## 🎨 디자인 토큰

### 색상 시스템

- **Primary**: `#007AFF` - 주요 액션 색상
- **Secondary**: `#FF6B6B` - 보조 액션 색상
- **Neutral**: 회색 톤 팔레트 (0-950)
- **Semantic**: Success, Warning, Error, Info

### 타이포그래피

- **Font Family**: 시스템 폰트 사용
- **Font Sizes**: xs(12) ~ 6xl(60)
- **Font Weights**: normal(400), medium(500), semibold(600), bold(700)

### 스페이싱

- **Base Unit**: 4px
- **Scale**: 0, 1(4px), 2(8px), 3(12px), 4(16px), 5(20px), 6(24px), 8(32px), 10(40px), 12(48px), 16(64px), 20(80px), 24(96px), 32(128px)

## 🧩 컴포넌트

### Button

```tsx
<Button
  title="버튼"
  onPress={() => {}}
  type="primary" // primary | secondary | outline | ghost
  size="medium" // small | medium | large
  fullWidth={false}
/>
```

### Card

```tsx
<Card
  elevation="base" // none | sm | base | md | lg
  padding="base" // none | sm | base | lg
  backgroundColor="custom-color"
>
  내용
</Card>
```

### Input

```tsx
<Input
  value={value}
  onChangeText={setValue}
  placeholder="플레이스홀더"
  size="medium" // small | medium | large
  variant="outlined" // default | outlined | filled
  label="라벨"
  errorMessage="오류 메시지"
/>
```

### Text

```tsx
<Text h4 color="#FF6B6B">
  제목 텍스트
</Text>
```

### Divider

```tsx
<Divider
  orientation="horizontal" // horizontal | vertical
  thickness={1}
  color="#E8EAED"
  margin={16}
/>
```

### Spacer

```tsx
<Spacer size={4} horizontal={false} />
```

## 🎯 디자인 원칙

1. **미니멀 디자인**: Less is more 정신을 추구
2. **일관성**: 모든 컴포넌트가 동일한 디자인 토큰 사용
3. **접근성**: 최소 터치 영역 44px 보장
4. **반응형**: 다양한 화면 크기에 대응
5. **다크 모드**: 자동 테마 전환 지원

## 🔧 사용법

```tsx
import { Button, Card, Text } from "@/components/ui";
import { useTheme } from "@/hooks/use-styles";

const MyComponent = () => {
  const theme = useTheme();

  return (
    <Card>
      <Text h4>제목</Text>
      <Button title="액션" onPress={() => {}} />
    </Card>
  );
};
```
