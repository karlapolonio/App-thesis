import { Text, TextInput, View, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, Modal, Alert } from 'react-native';
import { useState } from 'react';
import styles from "../styles/FormStyle";
import { useUser } from "../UserContext";
import axios from "axios";
import { calculateBMR, calculateTDEE, adjustCaloriesForGoal, calculateMacros } from '../formula';

export default function Form({ navigation }) {
  const { userId, BACKEND_URL } = useUser();

  const [formData, setFormData] = useState({
    weight: "",
    height: "",
    age: "",
    sex: "",
    sports_category: "",
    goal: ""
  });

  const [showSexDD, setShowSexDD] = useState(false);
  const [showSCDD, setShowSCDD] = useState(false);
  const [showGoalDD, setShowGoalDD] = useState(false);

  const SexFieldList = ["Male", "Female"];
  const SportsCategoryFieldList = [
    { label: "Endurance (Running, Swimming)", value: "endurance" },
    { label: "Strength/Power (Weightlifting, Sprinting)", value: "strength" },
    { label: "Team / Intermittent (Basketball, Soccer)", value: "team" },
    { label: "Skill-Based (Badminton, Table Tennis)", value: "skill" }
  ];

  const GoalFieldList = [
    { label: "Maintenance", value: "maintain" },
    { label: "Weight Loss", value: "weight_loss" },
    { label: "Muscle Gain", value: "muscle_gain" }
  ];

  const handleSubmit = async () => {
    try {
      if (!userId) {
        Alert.alert("Error", "No user logged in.");
        return;
      }

      const weight = parseFloat(formData.weight);
      const height = parseFloat(formData.height);
      const age = parseInt(formData.age, 10);

      const bmr = calculateBMR(weight, height, age, formData.sex.toLowerCase());
      const tdee = calculateTDEE(bmr, formData.sports_category);
      const calories = adjustCaloriesForGoal(tdee, formData.goal);
      const macros = calculateMacros(weight, calories);

      const payload = {
        weight,
        height,
        age,
        sex: formData.sex,
        sports_category: formData.sports_category,
        goal: formData.goal,
        calories: Math.round(calories),
        carbs: Math.round(macros.carbs),
        protein: Math.round(macros.protein),
        fat: Math.round(macros.fat),
      };

      const response = await axios.post(`${BACKEND_URL}/profile/submit/${userId}`, payload);

      Alert.alert("Success", response.data.message);
      navigation.navigate("Main");

    } catch (error) {
      console.error(error);

      let message = "Something went wrong";
      if (error?.response?.data?.detail) {
        message = error.response.data.detail;
      } else if (error?.message) {
        message = error.message;
      }
      Alert.alert("Error", message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={100}
      style={{ flex: 1, padding: 20, backgroundColor: '#fff' }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.formTitle}>Form</Text>
          <Text style={styles.formSubtitle}>Form description</Text>
        </View>

        {/* Weight & Height */}
        <View style={styles.row}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Weight</Text>
            <TextInput
              style={styles.input}
              value={formData.weight}
              onChangeText={(text) => setFormData(prev => ({ ...prev, weight: text }))}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Height</Text>
            <TextInput
              style={styles.input}
              value={formData.height}
              onChangeText={(text) => setFormData(prev => ({ ...prev, height: text }))}
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Age & Sex */}
        <View style={styles.row}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Age</Text>
            <TextInput
              style={styles.input}
              value={formData.age}
              onChangeText={(text) => setFormData(prev => ({ ...prev, age: text }))}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Sex</Text>
            <TouchableOpacity
              style={styles.dropdownButton}
              onPress={() => setShowSexDD(true)}
            >
              <Text style={styles.dropdownButtonText}>{formData.sex || "Select"}</Text>
              <Text style={styles.dropdownArrow}>▼</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Sports Category */}
        <View style={styles.fullRow}>
          <View style={styles.inputGroup2}>
            <Text style={styles.label}>Sports Category</Text>
            <TouchableOpacity
              style={styles.dropdownButton}
              onPress={() => setShowSCDD(true)}
            >
              <Text style={styles.dropdownButtonText}>
                {SportsCategoryFieldList.find(item => item.value === formData.sports_category)?.label || "Select"}
              </Text>
              <Text style={styles.dropdownArrow}>▼</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Goal */}
        <View style={styles.fullRow}>
          <View style={styles.inputGroup2}>
            <Text style={styles.label}>Goal</Text>
            <TouchableOpacity
              style={styles.dropdownButton}
              onPress={() => setShowGoalDD(true)}
            >
              <Text style={styles.dropdownButtonText}>
                {GoalFieldList.find(item => item.value === formData.goal)?.label || "Select"}
              </Text>
              <Text style={styles.dropdownArrow}>▼</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Submit Button */}
        <View style={{ marginVertical: 20 }}>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
          >
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modals */}
      <Modal visible={showSexDD} transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView>
              {SexFieldList.map((item) => (
                <TouchableOpacity
                  key={item}
                  style={styles.dropdownOption}
                  onPress={() => {
                    setFormData(prev => ({ ...prev, sex: item }));
                    setShowSexDD(false);
                  }}
                >
                  <Text style={styles.dropdownOptionText}>{item}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.modalCloseButton} onPress={() => setShowSexDD(false)}>
              <Text style={{ textAlign: "center", color: "green" }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={showSCDD} transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView>
              {SportsCategoryFieldList.map((item) => (
                <TouchableOpacity
                  key={item.value}
                  style={styles.dropdownOption}
                  onPress={() => {
                    setFormData(prev => ({ ...prev, sports_category: item.value }));
                    setShowSCDD(false);
                  }}
                >
                  <Text style={styles.dropdownOptionText}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.modalCloseButton} onPress={() => setShowSCDD(false)}>
              <Text style={{ textAlign: "center", color: "green" }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={showGoalDD} transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView>
              {GoalFieldList.map((item) => (
                <TouchableOpacity
                  key={item.value}
                  style={styles.dropdownOption}
                  onPress={() => {
                    setFormData(prev => ({ ...prev, goal: item.value }));
                    setShowGoalDD(false);
                  }}
                >
                  <Text style={styles.dropdownOptionText}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.modalCloseButton} onPress={() => setShowGoalDD(false)}>
              <Text style={{ textAlign: "center", color: "green" }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}
