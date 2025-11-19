import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUser } from "../UserContext";

export default function StartupScreen({ navigation }) {
  const { setUserId } = useUser();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("userId");
        const storedHasProfile = await AsyncStorage.getItem("hasProfile");

        console.log("Startup storedUserId:", storedUserId);
        console.log("Startup storedHasProfile:", storedHasProfile);

        if (!storedUserId) {
          navigation.reset({ index: 0, routes: [{ name: "Login" }] });
          return;
        }

        setUserId(storedUserId);

        if (storedHasProfile === "true") {
          navigation.reset({ index: 0, routes: [{ name: "Main" }] });
        } else {
          navigation.reset({ index: 0, routes: [{ name: "Login" }] });
        }
      } catch (error) {
        console.error("Startup check failed:", error);
        navigation.reset({ index: 0, routes: [{ name: "Login" }] });
      }
    };

    checkUser();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="green" />
    </View>
  );
}
