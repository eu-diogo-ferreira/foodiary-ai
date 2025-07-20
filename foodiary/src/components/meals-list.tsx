import { FlatList, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DailyStats } from './daily-stats';
import { DateSwitcher } from './date-switcher';
import { MealCard } from './meal-card';
import { useAuth } from '../hooks/use-auth';
import { useQuery } from '@tanstack/react-query';
import { httpClient } from '../services/http-client';

function MealsListHeader() {
  const { user } = useAuth();

  return (
    <View>
      <DateSwitcher />

      <View className="mt-2">
        <DailyStats
          calories={{
            current: 0,
            goal: user!.calories,
          }}
          proteins={{
            current: 0,
            goal: user!.proteins,
          }}
          carbohydrates={{
            current: 0,
            goal: user!.carbohydrates,
          }}
          fats={{
            current: 0,
            goal: user!.fats
          }}
        />
      </View>

      <View className="h-px bg-gray-200 mt-7" />

      <Text className="text-black-700 m-5 text-base font-sans-medium tracking-[1.28px]">
        REFEIÇÕES
      </Text>
    </View>
  );
}

function Separator() {
  return (
    <View className="h-8" />
  );
}

type Meals = {
  name: string;
  id: string;
  icon: string;
  foods: {
    name: string;
    quantity: string;
    calories: number;
    proteins: number;
    carbohydrates: number;
    fasts: number;
  }[];
  createdAt: string;
}

export function MealsList() {
  const { bottom } = useSafeAreaInsets();

  const { data: meals } = useQuery({
    queryKey: ['meals'],
    queryFn: async () => {
      const { data } = await httpClient.get<{ meals: Meals[] }>('/meals', {
        params: {
          // TODO: Implemet pagination (based in dates from api: maybe user created date ref?)
          date: '2025-07-20',
        },
      });

      return data.meals;
    },
  });
  
  return (
    <FlatList
      data={meals}
      contentContainerStyle={{ paddingBottom: 80 + bottom + 16 }}
      keyExtractor={meal => meal.id}
      ListEmptyComponent={<Text>Nenhuma refeição cadastrada...</Text>}
      ListHeaderComponent={MealsListHeader}
      ItemSeparatorComponent={Separator}
      renderItem={({ item: meal }) => (
        <View className="mx-5">
          <MealCard
            id={meal.id}
            name={meal.name}
          />
        </View>
      )}
    />
  );
}