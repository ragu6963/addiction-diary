import { Input, Text } from "@/components/ui";
import { useTheme } from "@/hooks/use-styles";
import {
  createAlcoholRecordModalStyles,
  staticAlcoholRecordModalStyles,
} from "@/styles/alcohol-record-modal.styles";
import {
  AlcoholRecord,
  calculateAlcoholContent,
  DrinkItem,
} from "@/utils/dataManager";
import {
  DRINK_PRESETS,
  DrinkType,
  getDrinkIcon,
  getDrinkName,
  UNIT_VOLUMES,
} from "@/utils/drinkConstants";
import { formatCurrentTime } from "@/utils/formatters";
import React, { memo, useCallback, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface AlcoholRecordModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (record: AlcoholRecord) => void;
  selectedDate: string;
  editingRecord?: AlcoholRecord; // 수정할 기록 (선택사항)
  isEditMode?: boolean; // 수정 모드 여부
}

const AlcoholRecordModal = memo<AlcoholRecordModalProps>(
  ({
    visible,
    onClose,
    onSave,
    selectedDate,
    editingRecord,
    isEditMode = false,
  }) => {
    const theme = useTheme();
    const styles = createAlcoholRecordModalStyles(theme);
    const [drinks, setDrinks] = useState<DrinkItem[]>([]);

    // 수정 모드일 때 기존 데이터로 초기화
    React.useEffect(() => {
      if (isEditMode && editingRecord) {
        setDrinks(editingRecord.drinks);
      } else {
        setDrinks([]);
      }
    }, [isEditMode, editingRecord, visible]);

    // 음료 추가
    const addDrink = useCallback(
      (type: DrinkType) => {
        const presets = DRINK_PRESETS[type];
        const preset = presets[0]; // 첫 번째 프리셋 사용

        const newDrink: DrinkItem = {
          id: `${Date.now()}-${Math.random()}`,
          type,
          volume: preset?.volume || UNIT_VOLUMES.glass,
          alcoholPercentage: preset?.alcoholPercentage || 0,
          alcoholContent: 0,
          quantity: 1,
          unit: preset?.unit || "glass",
        };

        // 알코올 함량 계산
        newDrink.alcoholContent = calculateAlcoholContent(
          newDrink.volume * newDrink.quantity,
          newDrink.alcoholPercentage
        );

        setDrinks([...drinks, newDrink]);
      },
      [drinks]
    );

    // 음료 삭제
    const removeDrink = useCallback(
      (id: string) => {
        setDrinks(drinks.filter((drink) => drink.id !== id));
      },
      [drinks]
    );

    // 음료 정보 업데이트
    const updateDrink = useCallback(
      (id: string, field: keyof DrinkItem, value: any) => {
        setDrinks(
          drinks.map((drink) => {
            if (drink.id === id) {
              const updatedDrink = { ...drink, [field]: value };

              // 알코올 함량 재계산
              if (
                field === "volume" ||
                field === "alcoholPercentage" ||
                field === "quantity"
              ) {
                updatedDrink.alcoholContent = calculateAlcoholContent(
                  updatedDrink.volume * updatedDrink.quantity,
                  updatedDrink.alcoholPercentage
                );
              }

              return updatedDrink;
            }
            return drink;
          })
        );
      },
      [drinks]
    );

    // 총 알코올 함량 계산
    const totalAlcoholContent = drinks.reduce(
      (sum, drink) => sum + drink.alcoholContent,
      0
    );
    const totalVolume = drinks.reduce(
      (sum, drink) => sum + drink.volume * drink.quantity,
      0
    );

    // 저장
    const handleSave = useCallback(() => {
      if (drinks.length === 0) {
        Alert.alert("알림", "최소 하나의 음료를 추가해주세요.");
        return;
      }

      const now = new Date();
      const record: AlcoholRecord = {
        id:
          isEditMode && editingRecord
            ? editingRecord.id
            : `${selectedDate}-${Date.now()}`,
        date: selectedDate,
        timestamp:
          isEditMode && editingRecord
            ? editingRecord.timestamp
            : now.toISOString(),
        time:
          isEditMode && editingRecord
            ? editingRecord.time
            : formatCurrentTime(),
        drinks,
        totalAlcoholContent,
        totalVolume,
      };

      onSave(record);
      setDrinks([]);
      onClose();
    }, [
      drinks,
      totalAlcoholContent,
      totalVolume,
      selectedDate,
      onSave,
      onClose,
      isEditMode,
      editingRecord,
    ]);

    return (
      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView
          style={{ flex: 1, backgroundColor: theme.colors.background }}
        >
          {/* 헤더 */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.headerButton}>취소</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>
              {isEditMode ? "음주 기록 수정" : "음주 기록"}
            </Text>
            <TouchableOpacity onPress={handleSave}>
              <Text style={styles.headerSaveButton}>저장</Text>
            </TouchableOpacity>
          </View>

          <KeyboardAvoidingView
            style={staticAlcoholRecordModalStyles.keyboardAvoidingView}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <ScrollView
              style={staticAlcoholRecordModalStyles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {/* 날짜 표시 */}
              <View style={styles.dateSection}>
                <Text style={styles.dateTitle}>기록 날짜</Text>
                <Text style={styles.dateText}>{selectedDate}</Text>
              </View>

              {/* 음료 추가 버튼들 */}
              <View style={styles.drinkAddSection}>
                <Text style={styles.drinkAddTitle}>음료 추가</Text>
                <View style={styles.drinkButtonsContainer}>
                  {Object.keys(DRINK_PRESETS).map((type) => (
                    <TouchableOpacity
                      key={type}
                      onPress={() => addDrink(type as DrinkType)}
                      style={styles.drinkButton}
                    >
                      <Text style={styles.drinkButtonText}>
                        {getDrinkIcon(type as DrinkType)}{" "}
                        {getDrinkName(type as DrinkType)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* 추가된 음료 목록 */}
              {drinks.map((drink, index) => (
                <View key={drink.id} style={styles.drinkItem}>
                  <View style={styles.drinkItemHeader}>
                    <Text style={styles.drinkItemTitle}>
                      {getDrinkIcon(drink.type)} {getDrinkName(drink.type)}
                    </Text>
                    <TouchableOpacity onPress={() => removeDrink(drink.id)}>
                      <Text style={styles.deleteButton}>삭제</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.inputContainer}>
                    {/* 용량 */}
                    <View style={styles.inputField}>
                      <Text style={styles.inputLabel}>용량 (ml)</Text>
                      <Input
                        value={drink.volume.toString()}
                        onChangeText={(text) =>
                          updateDrink(drink.id, "volume", parseFloat(text) || 0)
                        }
                        keyboardType="numeric"
                        containerStyle={styles.inputContainerStyle}
                        inputStyle={styles.inputStyle}
                      />
                    </View>

                    {/* 알코올 도수 */}
                    <View style={styles.inputField}>
                      <Text style={styles.inputLabel}>알코올 도수 (%)</Text>
                      <Input
                        value={drink.alcoholPercentage.toString()}
                        onChangeText={(text) =>
                          updateDrink(
                            drink.id,
                            "alcoholPercentage",
                            parseFloat(text) || 0
                          )
                        }
                        keyboardType="numeric"
                        containerStyle={styles.inputContainerStyle}
                        inputStyle={styles.inputStyle}
                      />
                    </View>

                    {/* 수량 */}
                    <View style={styles.inputField}>
                      <Text style={styles.inputLabel}>수량</Text>
                      <Input
                        value={drink.quantity.toString()}
                        onChangeText={(text) =>
                          updateDrink(drink.id, "quantity", parseInt(text) || 1)
                        }
                        keyboardType="numeric"
                        containerStyle={styles.inputContainerStyle}
                        inputStyle={styles.inputStyle}
                      />
                    </View>

                    {/* 계산된 알코올 함량 */}
                    <View style={styles.alcoholContentContainer}>
                      <Text style={styles.alcoholContentText}>
                        알코올 함량: {drink.alcoholContent.toFixed(1)}g
                      </Text>
                    </View>
                  </View>
                </View>
              ))}

              {/* 총합 정보 */}
              {drinks.length > 0 && (
                <View style={styles.totalSection}>
                  <View style={styles.totalItemsContainer}>
                    <View style={styles.totalItem}>
                      <Text style={styles.totalItemLabel}>총 음주량</Text>
                      <Text style={styles.totalItemValue}>
                        {totalVolume.toFixed(0)}ml
                      </Text>
                    </View>
                    <View style={styles.totalItem}>
                      <Text style={styles.totalItemLabel}>총 알코올 함량</Text>
                      <Text style={styles.totalItemValueError}>
                        {totalAlcoholContent.toFixed(1)}g
                      </Text>
                    </View>
                  </View>
                </View>
              )}
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
    );
  }
);

AlcoholRecordModal.displayName = "AlcoholRecordModal";

export default AlcoholRecordModal;
