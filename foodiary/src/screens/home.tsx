import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { HomeHeader } from "../components/home-header";
import { MealsList } from "../components/meals-list";
import { CreateMealBottomBar } from "../components/create-meal-bottom-bar";

export function Home() {
  return (
    <View className="bg-white flex-1">
      <SafeAreaProvider>
        <HomeHeader />
        <MealsList />
        
        <CreateMealBottomBar />
      </SafeAreaProvider>
    </View>
  );
}
