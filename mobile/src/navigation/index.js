import React from "react";
import { ActivityIndicator, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "../context/AuthContext";

import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";
import StudentAttendanceScreen from "../screens/StudentAttendanceScreen";
import StudentReportCardScreen from "../screens/StudentReportCardScreen";
import StudentFeesScreen from "../screens/StudentFeesScreen";
import TeacherClassesScreen from "../screens/TeacherClassesScreen";
import TeacherAttendanceScreen from "../screens/TeacherAttendanceScreen";

const Stack = createNativeStackNavigator();

const screenOptions = {
  headerStyle: { backgroundColor: "#193e59" },
  headerTintColor: "#fff",
  headerTitleStyle: { fontWeight: "600" },
};

export default function RootNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#193e59" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={screenOptions}>
        {!user ? (
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        ) : (
          <>
            <Stack.Screen name="Home" component={HomeScreen} options={{ title: "Dashboard" }} />
            <Stack.Screen
              name="StudentAttendance"
              component={StudentAttendanceScreen}
              options={{ title: "My Attendance" }}
            />
            <Stack.Screen
              name="StudentReportCard"
              component={StudentReportCardScreen}
              options={{ title: "My Report Card" }}
            />
            <Stack.Screen
              name="StudentFees"
              component={StudentFeesScreen}
              options={{ title: "My Fees" }}
            />
            <Stack.Screen
              name="TeacherClasses"
              component={TeacherClassesScreen}
              options={{ title: "My Classes" }}
            />
            <Stack.Screen
              name="TeacherAttendance"
              component={TeacherAttendanceScreen}
              options={{ title: "Mark Attendance" }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
