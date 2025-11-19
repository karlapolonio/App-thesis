import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  Animated,
  Alert,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { useUser } from "../UserContext";
import styles, { PALETTE } from "../styles/HomeNavStyle";

const NUTRIENTS = ["calories", "protein", "carbs", "fat"];
const COLORS = {
  calories: PALETTE.mediumGreen,
  protein: PALETTE.limeGreen,
  carbs: PALETTE.lightGreen,
  fat: PALETTE.yellow,
};

const formatDate = (date) => {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${month}-${day}`;
};

export default function HomeNav({ userId, BACKEND_URL }) {
  const { mealRefreshCounter } = useUser();

  const [GOALS, setGOALS] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0
  });

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/profile/${userId}`);
        const data = await res.json();

        setGOALS({
          calories: data.calories || 0,
          protein: data.protein || 0,
          carbs: data.carbs || 0,
          fat: data.fat || 0,
        });

      } catch (error) {
        console.error("Error fetching user goals:", error);
      }
    };

    fetchGoals();
  }, [userId]);

  const [todayTotals, setTodayTotals] = useState({ calories: 0, protein: 0, carbs: 0, fat: 0 });
  const [weeklyData, setWeeklyData] = useState([]);
  const [selectedNutrient, setSelectedNutrient] = useState("calories");
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  const unit = selectedNutrient === "calories" ? "kcal" : "g";

  const [animatedValues] = useState({
    calories: new Animated.Value(0),
    protein: new Animated.Value(0),
    carbs: new Animated.Value(0),
    fat: new Animated.Value(0),
  });

  const safeNumber = (val) => (isNaN(Number(val)) ? 0 : Number(val));

  /////////////////////////
  // Fetch Today's Meals //
  /////////////////////////

  useEffect(() => {
    const fetchToday = async () => {
      try {
        const today = new Date();
        const date = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
          .toISOString()
          .split("T")[0];

        const res = await fetch(`${BACKEND_URL}/meal/?user_id=${userId}&date=${date}`);
        const meals = await res.json();

        const totals = meals.reduce(
          (acc, meal) => ({
            calories: acc.calories + (meal.total_calories || 0),
            protein: acc.protein + (meal.total_protein || 0),
            carbs: acc.carbs + (meal.total_carbs || 0),
            fat: acc.fat + (meal.total_fat || 0),
          }),
          { calories: 0, protein: 0, carbs: 0, fat: 0 }
        );

        setTodayTotals(totals);

        Object.keys(totals).forEach((key) => {
          const goal = GOALS[key] || 0;
          const progress = goal > 0 ? Math.min(totals[key] / goal, 1) : 0;

          Animated.timing(animatedValues[key], {
            toValue: progress,
            duration: 600,
            useNativeDriver: false,
          }).start();
        });

      } catch (err) {
        console.error(err);
      }
    };

    fetchToday();
  }, [mealRefreshCounter, userId, GOALS]);

  useEffect(() => {
    const fetchWeekly = async () => {
      setLoading(true);
      try {
        const data = [];
        for (let i = 6; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          const date = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
            .toISOString()
            .split("T")[0];

          const res = await fetch(`${BACKEND_URL}/meal/?user_id=${userId}&date=${date}`);
          const meals = await res.json();

          const day = { calories: 0, protein: 0, carbs: 0, fat: 0 };
          meals.forEach((m) => {
            day.calories += safeNumber(m.total_calories);
            day.protein += safeNumber(m.total_protein);
            day.carbs += safeNumber(m.total_carbs);
            day.fat += safeNumber(m.total_fat);
          });
          data.push({ date: formatDate(d), ...day });
        }
        setWeeklyData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeekly();
  }, [mealRefreshCounter, userId]);

  const renderBar = (label, value, goal, anim, color) => {
  const progress = goal > 0 ? Math.min(value / goal, 1) : 0;

  return (
      <View style={{ marginBottom: 10 }}>
        <Text style={styles.label}>
          {label}: {value.toFixed(0)} / {goal}
        </Text>

        <View
          style={{
            width: "100%",
            height: 14,
            backgroundColor: "#E0E0E0",
            borderRadius: 10,
            overflow: "hidden",
          }}
        >
          <Animated.View
            style={{
              height: "100%",
              backgroundColor: color,
              width: anim.interpolate({
                inputRange: [0, 1],
                outputRange: ["0%", "100%"],
              }),
            }}
          />
        </View>
      </View>
    );
  };


  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* --- Daily Summary --- */}
      <Text style={[styles.title, { color: PALETTE.darkGreen }]}>Daily Summary</Text>
      {renderBar("Calories", todayTotals.calories, GOALS.calories, animatedValues.calories, COLORS.calories)}
      {renderBar("Protein", todayTotals.protein, GOALS.protein, animatedValues.protein, COLORS.protein)}
      {renderBar("Carbs", todayTotals.carbs, GOALS.carbs, animatedValues.carbs, COLORS.carbs)}
      {renderBar("Fat", todayTotals.fat, GOALS.fat, animatedValues.fat, COLORS.fat)}

      {/* --- Weekly Chart Header --- */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: PALETTE.darkGreen }]}>Last 7 Days Nutrition</Text>
        <TouchableOpacity style={styles.dropdownBox} onPress={() => setModalVisible(true)}>
          <Text style={styles.dropdownText}>
            {selectedNutrient.charAt(0).toUpperCase() + selectedNutrient.slice(1)} ▼
          </Text>
        </TouchableOpacity>
      </View>

      {/* --- Nutrients Selector Modal --- */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            {NUTRIENTS.map((n) => (
              <TouchableOpacity
                key={n}
                style={styles.modalItem}
                onPress={() => {
                  setSelectedNutrient(n);
                  setModalVisible(false);
                }}
              >
                <Text>{n.charAt(0).toUpperCase() + n.slice(1)}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={{ color: "red", textAlign: "center", padding: 8 }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* --- Line Chart --- */}
      {loading ? (
        <ActivityIndicator size="large" color={PALETTE.mediumGreen} style={{ marginTop: 30 }} />
      ) : weeklyData.length > 0 ? (
        <View>
          <LineChart
            data={{
              labels: weeklyData.map((d) => d.date),
              datasets: [
                {
                  data: weeklyData.map((d) => d[selectedNutrient]
                  ),
                },
              ],
            }}
            width={Dimensions.get("window").width - 20}
            height={300}
            yAxisSuffix={`${unit}`}
            verticalLabelRotation={45}
            chartConfig={{
              backgroundGradientFrom: "#C8E6C9",
              backgroundGradientTo: "#E8F5E9",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(27, 94, 32, ${opacity})`,
              propsForDots: {
                r: "5",
                fill: COLORS[selectedNutrient],
              },
              propsForBackgroundLines: {
                stroke: "#E0E0E0",
              },
            }}
            bezier
            style={{
              marginHorizontal: 10,
              borderRadius: 16,
              marginLeft: -5,
            }}
            onDataPointClick={({ value, index }) => {
              Alert.alert(
                selectedNutrient.charAt(0).toUpperCase() + selectedNutrient.slice(1),
                `${weeklyData[index].date}: ${value}${unit}`
              );
            }}
          />
        </View>
      ) : (
        <Text style={styles.noData}>No data available</Text>
      )}
    </ScrollView>
  );
}
