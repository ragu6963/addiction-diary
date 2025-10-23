import { Theme } from "@/constants/design-tokens";
import { createMixins } from "./common.styles";

// 모달 화면 스타일
export const createModalStyles = (theme: Theme) => {
  const mixins = createMixins(theme);

  return {
    container: {
      ...mixins.flexRowCenter,
      flex: 1,
      padding: theme.spacing[5],
    },
    link: {
      marginTop: theme.spacing[4],
      paddingVertical: theme.spacing[4],
    },
  };
};

// 하위 호환성을 위한 정적 스타일 (deprecated)
export const modalStyles = {
  container: {
    flex: 1,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
};
