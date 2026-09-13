import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useAuth } from "../context/AuthContext";

export default function TeacherClassesScreen({ navigation }) {
  const { user } = useAuth();
  const classes = user?.classesTaught || [];

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={{ padding: 16 }}
      data={classes}
      keyExtractor={(item) => item.id}
      ListEmptyComponent={
        <Text style={styles.empty}>
          You're not assigned as class teacher for any class yet — ask an admin to assign you.
        </Text>
      }
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.row}
          onPress={() => navigation.navigate("TeacherAttendance", { classSection: item })}
        >
          <Text style={styles.className}>{item.gradeLevel} - {item.section}</Text>
          <Text style={styles.year}>{item.academicYear}</Text>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  row: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  className: { fontSize: 16, fontWeight: "600", color: "#193e59" },
  year: { fontSize: 13, color: "#64748b", marginTop: 2 },
  empty: { textAlign: "center", color: "#64748b", marginTop: 40, lineHeight: 20 },
});
