import { Link } from "expo-router";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { modalStyles } from "@/styles/modal.styles";

export default function ModalScreen() {
  return (
    <ThemedView style={modalStyles.container}>
      <ThemedText type="title">This is a modal</ThemedText>
      <Link href="/main" dismissTo style={modalStyles.link}>
        <ThemedText type="link">Go to home screen</ThemedText>
      </Link>
    </ThemedView>
  );
}
