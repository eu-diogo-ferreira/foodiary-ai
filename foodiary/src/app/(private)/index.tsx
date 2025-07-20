import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import {
  HostGrotesk_400Regular,
  HostGrotesk_500Medium,
  HostGrotesk_600SemiBold,
  HostGrotesk_700Bold,
  useFonts,
} from "@expo-google-fonts/host-grotesk";

import "../../styles/global.css";

import { useEffect } from "react";
import { HomeHeader } from "../../components/home-header";
import { MealsList } from "../../components/meals-list";
import { CreateMealBottomBar } from "../../components/create-meal-bottom-bar";

SplashScreen.preventAutoHideAsync();

export default function Page() {
  const [loaded, error] = useFonts({
    HostGrotesk_400Regular,
    HostGrotesk_500Medium,
    HostGrotesk_600SemiBold,
    HostGrotesk_700Bold,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <View className="bg-white flex-1">
      <HomeHeader />
      <MealsList />
      <CreateMealBottomBar />
    </View>
  );
}
