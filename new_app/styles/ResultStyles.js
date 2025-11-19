import { StyleSheet, Dimensions } from "react-native";
const { width } = Dimensions.get("window");

const colors = {
  primary: "#4CAF50",
  background: "#FFFFFF",
  card: "#FAFAFA",
  textDark: "#333",
  textLight: "#777",
};

export default StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: colors.background,
  },
  section: {
    marginBottom: 28,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
    color: colors.textDark,
    textAlign: "center",
  },
  image: {
    width: width * 0.9,
    height: 280,
  },
  predItem: {
    backgroundColor: colors.card,
    padding: 14,
    marginVertical: 10,
    borderRadius: 12,
    width: "90%",
    alignSelf: "center",
  },
  predText: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
    color: colors.textDark,
  },
  nutritionText: {
    fontSize: 14,
    color: colors.textLight,
    marginVertical: 2,
  },
  servingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  input: {
    borderWidth: 0,
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginHorizontal: 6,
    width: 70,
    textAlign: "center",
    fontSize: 14,
    color: colors.textDark,
  },
  totalBoxContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 20,
  },
  totalBox: {
    width: "45%",
    margin: 8,
    padding: 16,
    backgroundColor: colors.card,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
    color: colors.textLight,
  },
  totalValue: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.primary,
  },
});
