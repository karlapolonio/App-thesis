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
import styles from "../styles/LoginStyle";
import axios from "axios";
import { useUser } from "../UserContext";
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = ({ navigation }) => {
  const { setUserId, BACKEND_URL } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() && !password.trim()) {
      Alert.alert("Missing Fields", "Please enter both email and password.");
      return;
    }
    if (!email.trim()) {
      Alert.alert("Missing Email", "Please enter your email.");
      return;
    }
    if (!password.trim()) {
      Alert.alert("Missing Password", "Please enter your password.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${BACKEND_URL}/account/login`,
        { email, password }
      );

      const { has_profile, user } = response.data;
      const user_id = user.id;

      setUserId(user_id);
      await AsyncStorage.setItem('userId', user_id.toString());
      await AsyncStorage.setItem("hasProfile", has_profile ? "true" : "false");

      setTimeout(() => {
        if (has_profile) {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Main' }],
          });
        } else {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Form' }],
          });
        }
        setLoading(false);
      }, 500);

    } catch (error) {
      setLoading(false);
      if (error.response?.status === 401) {
        Alert.alert("Login Failed", "Incorrect email or password. Please try again.");
        return;
      }
      Alert.alert("Error", error.response?.data?.detail || "Something went wrong. Please try again later.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#f5f5f5" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Login</Text>

        {/* --- Email Label --- */}
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!loading}
        />

        {/* --- Password Label --- */}
        <Text style={styles.label}>Password</Text>
        <View style={[styles.input, styles.passwordContainer]}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Enter your password"
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

        {/* --- Login Button --- */}
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>

        {/* --- Register Link --- */}
        <View style={styles.registerContainer}>
          <Text>Don’t have an account yet? </Text>
          <TouchableOpacity
            onPress={() => !loading && navigation.navigate("Register")}
            disabled={loading}
          >
            <Text style={styles.registerText}>Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Login;