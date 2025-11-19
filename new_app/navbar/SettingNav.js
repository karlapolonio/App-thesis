import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUser } from "../UserContext";
import { useNavigation } from "@react-navigation/native";
import styles from "../styles/SettingNavStyle";

export default function SettingNav() {
  const { setUserId } = useUser();
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove(["userId", "hasProfile"]);
      setUserId(null);

      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });

      console.log("Logged out successfully — cleared AsyncStorage.");
    } catch (error) {
      Alert.alert("Error", "Failed to log out. Please try again.");
      console.error("Logout error:", error);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={[styles.container, { flexGrow: 1, backgroundColor: "#ffffff" }]}
      style={{ backgroundColor: "#ffffff" }}
    >
      <Text style={styles.title}>Settings</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Information</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("About")}
        >
          <Text style={styles.buttonText}>About App</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("PrivacyPolicy")}
        >
          <Text style={styles.buttonText}>Privacy Policy</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
