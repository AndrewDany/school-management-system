import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { useAuth } from "../context/AuthContext";
import client from "../api/client";

const STATUS_COLORS = {
  present: "#16a34a",
  absent: "#dc2626",
  late: "#d97706",
  excused: "#64748b",
};

export default function StudentAttendanceScreen() {
  const { user } = useAuth();
  const studentId = user?.studentProfile?.id;
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!studentId) return;
    client.get(`/attendance/student/${studentId}`).then((res) => {
      setRecords(res.data);
      setLoading(false);
    });
  }, [studentId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#193e59" />
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={{ padding: 16 }}
      data={records}
      keyExtractor={(item) => item.id}
      ListEmptyComponent={<Text style={styles.empty}>No attendance records yet.</Text>}
      renderItem={({ item }) => (
        <View style={styles.row}>
          <Text style={styles.date}>{item.date}</Text>
          <Text style={[styles.status, { color: STATUS_COLORS[item.status] || "#334155" }]}>
            {item.status}
          </Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f8fafc" },
  row: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 14,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  date: { color: "#334155" },
  status: { fontWeight: "600", textTransform: "capitalize" },
  empty: { textAlign: "center", color: "#64748b", marginTop: 40 },
});
