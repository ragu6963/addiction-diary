import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useStyles, useTheme } from "@/hooks/use-styles";
import { createMainStyles, staticMainStyles } from "@/styles/main.styles";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { Animated, Dimensions, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AddictionRecordsScreen from "./addiction-records";
import AlcoholCalendarScreen from "./alcohol-calendar";
import AlcoholRecordsScreen from "./alcohol-records";
import CalendarScreen from "./calendar";
import StatisticsScreen from "./statistics";

const { width } = Dimensions.get("window");

export default function MainScreen() {
  const theme = useTheme();
  const styles = useStyles(createMainStyles);

  const [currentScreen, setCurrentScreen] = useState("calendar");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const slideAnim = useState(new Animated.Value(-width))[0];

  const toggleMenu = () => {
    const toValue = isMenuOpen ? -width : 0;
    Animated.timing(slideAnim, {
      toValue,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setIsMenuOpen(!isMenuOpen);
  };

  const navigateToScreen = (screen: string) => {
    setCurrentScreen(screen);
    toggleMenu();
  };

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case "calendar":
        return <CalendarScreen />;
      case "alcohol-calendar":
        return <AlcoholCalendarScreen />;
      case "statistics":
        return <StatisticsScreen />;
      case "addiction-records":
        return <AddictionRecordsScreen />;
      case "alcohol-records":
        return <AlcoholRecordsScreen />;
      default:
        return <CalendarScreen />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" backgroundColor={theme.colors.background} />

      {/* 네비게이션 바 */}
      <ThemedView style={[styles.navBar, { backgroundColor: "transparent" }]}>
        <TouchableOpacity style={styles.hamburgerButton} onPress={toggleMenu}>
          <ThemedView style={styles.hamburgerLine} />
          <ThemedView style={styles.hamburgerLine} />
          <ThemedView style={styles.hamburgerLine} />
        </TouchableOpacity>

        <ThemedText style={staticMainStyles.navTitle}>
          {currentScreen === "calendar"
            ? "금욕 달력"
            : currentScreen === "alcohol-calendar"
            ? "금주 달력"
            : currentScreen === "statistics"
            ? "통계"
            : currentScreen === "addiction-records"
            ? "금욕 기록"
            : currentScreen === "alcohol-records"
            ? "금주 기록"
            : "금욕 달력"}
        </ThemedText>

        <ThemedView style={staticMainStyles.navSpacer} />
      </ThemedView>

      {/* 메인 콘텐츠 */}
      <ThemedView style={staticMainStyles.content}>
        {renderCurrentScreen()}
      </ThemedView>

      {/* 햄버거 메뉴 오버레이 */}
      {isMenuOpen && (
        <TouchableOpacity
          style={[styles.menuOverlay, staticMainStyles.menuOverlay]}
          onPress={toggleMenu}
          activeOpacity={1}
        />
      )}

      {/* 햄버거 메뉴 패널 */}
      <Animated.View
        style={[
          styles.menuPanel,
          staticMainStyles.menuPanel,
          { transform: [{ translateX: slideAnim }] },
        ]}
      >
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigateToScreen("calendar")}
        >
          <ThemedText style={staticMainStyles.menuItemText}>
            금욕 달력
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigateToScreen("alcohol-calendar")}
        >
          <ThemedText style={staticMainStyles.menuItemText}>
            금주 달력
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigateToScreen("addiction-records")}
        >
          <ThemedText style={staticMainStyles.menuItemText}>
            금욕 기록
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigateToScreen("alcohol-records")}
        >
          <ThemedText style={staticMainStyles.menuItemText}>
            금주 기록
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigateToScreen("statistics")}
        >
          <ThemedText style={staticMainStyles.menuItemText}>통계</ThemedText>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}
