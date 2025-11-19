import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  Alert,
  KeyboardAvoidingView,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import styles from "../styles/RegisterStyle";
import axios from "axios";
import { useUser } from "../UserContext";

const Register = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const { BACKEND_URL } = useUser();

  const handleRegister = async () => {
    if (!username || !email || !password || !confirmPassword) {
      Alert.alert("Invalid Input", "Please fill all fields");
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(email)) {
      Alert.alert(
        "Invalid Email Format",
        "Please enter a valid email address.\n\nExample: user@example.com"
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Password Mismatch", "Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${BACKEND_URL}/account/register`,
        { username, email, password }
      );

      Alert.alert("Success", "Account created!");
      console.log("User registered:", response.data);
      navigation.navigate("Login");
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.detail || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Registration</Text>
        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          placeholderTextColor="#888"
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          editable={!loading}
        />
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!loading}
        />
        <Text style={styles.label}>Password</Text>
        <View style={[styles.input, { flexDirection: "row", alignItems: "center" }]}>
          <TextInput
            style={{ flex: 1, color: "black"}}
            placeholder="Password"
            placeholderTextColor="#888"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            editable={!loading}
          />
          <Pressable onPress={() => setShowPassword(!showPassword)}>
            <MaterialIcons
              name={showPassword ? "visibility" : "visibility-off"}
              size={24}
              color="#555"
            />
          </Pressable>
        </View>
        <Text style={styles.label}>Confirm Password</Text>
        <View style={[styles.input, { flexDirection: "row", alignItems: "center" }]}>
          <TextInput
            style={{ flex: 1, color: "black" }}
            placeholder="Confirm Password"
            placeholderTextColor="#888"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirm}
            editable={!loading}
          />
          <Pressable onPress={() => setShowConfirm(!showConfirm)}>
            <MaterialIcons
              name={showConfirm ? "visibility" : "visibility-off"}
              size={24}
              color="#555"
            />
          </Pressable>
        </View>

        <TouchableOpacity
          style={[styles.button, loading && { backgroundColor: "#063b00ff" }]}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.buttonText}>Register</Text>
          )}
        </TouchableOpacity>

        <View
          style={{
            marginTop: 20,
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <Text>Already have an account? </Text>
          <TouchableOpacity
            onPress={() => !loading && navigation.navigate("Login")}
            disabled={loading}
          >
            <Text style={{ color: "green", fontWeight: "bold" }}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Register;
