import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#ffffff", 
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e7d32",
    textAlign: "center",
    marginBottom: 20, 
  },
  section: {
    marginBottom: 20, 
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 15,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16, 
    fontWeight: "600",
    color: "#145a32",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#27ae60",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14, 
    textAlign: "center",
  },
  logoutButton: {
    backgroundColor: "#c0392b",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
