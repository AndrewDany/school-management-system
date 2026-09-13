import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useAuth } from "../context/AuthContext";

function MenuButton({ label, description, onPress }) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <Text style={styles.menuLabel}>{label}</Text>
      <Text style={styles.menuDescription}>{description}</Text>
    </TouchableOpacity>
  );
}

export default function HomeScreen({ navigation }) {
  const { user, logout } = useAuth();
  const isStudent = user?.role === "student" && user?.studentProfile;
  const isTeacher = user?.role === "teacher";

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
      <Text style={styles.welcome}>Welcome, {user?.fullName}</Text>
      <Text style={styles.role}>{user?.role}</Text>

      {isStudent && (
        <>
          <MenuButton
            label="My Attendance"
            description="View your attendance history"
            onPress={() => navigation.navigate("StudentAttendance")}
          />
          <MenuButton
            label="My Report Card"
            description="View your grades and term average"
            onPress={() => navigation.navigate("StudentReportCard")}
          />
          <MenuButton
            label="My Fees"
            description="Check balance and payment history"
            onPress={() => navigation.navigate("StudentFees")}
          />
        </>
      )}

      {isTeacher && (
        <MenuButton
          label="My Classes"
          description="Mark attendance for your classes"
          onPress={() => navigation.navigate("TeacherClasses")}
        />
      )}

      {!isStudent && !isTeacher && (
        <Text style={styles.notice}>
          This account isn't linked to a student or teacher record yet — ask your admin to
          link it, or log in through the web app for full admin features.
        </Text>
      )}

      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>Log out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  welcome: { fontSize: 22, fontWeight: "bold", color: "#193e59" },
  role: { fontSize: 14, color: "#64748b", textTransform: "capitalize", marginBottom: 20 },
  menuItem: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  menuLabel: { fontSize: 16, fontWeight: "600", color: "#193e59" },
  menuDescription: { fontSize: 13, color: "#64748b", marginTop: 2 },
  notice: { color: "#64748b", fontSize: 13, marginTop: 12, lineHeight: 20 },
  logoutButton: { marginTop: 24, alignItems: "center", padding: 12 },
  logoutText: { color: "#dc2626", fontWeight: "600" },
});
