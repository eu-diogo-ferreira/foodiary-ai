import { View } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { HomeHeader } from "../../components/home-header";
import { MealsList } from "../../components/meals-list";
import { CreateMealBottomBar } from "../../components/create-meal-bottom-bar";

SplashScreen.preventAutoHideAsync();

export default function Page() {
  return (
    <View className="bg-white flex-1">
      <HomeHeader />
      <MealsList />
      <CreateMealBottomBar />
    </View>
  );
}
