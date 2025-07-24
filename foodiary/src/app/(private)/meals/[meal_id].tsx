import { router, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, Text, View } from 'react-native';

import { Button } from '../../../components/button';
import { useQuery } from '@tanstack/react-query';
import { httpClient } from '../../../services/http-client';
import { Logo } from '../../../components/logo';

type Meal = {
  id: string;
  name: string;
  status: "success" | "uploading" | "processing" | "failed";
  icon: string;
  foods: {
    name: string;
    quantity: string;
    calories: number;
    proteins: number;
    carbohydrates: number;
    fasts: number;
  }[];
  createdAt: Date;
}

export default function MealDetails() {
  const { meal_id: mealId } = useLocalSearchParams();

  const { data: meal, isFetching } = useQuery({
    queryKey: ['meal', mealId],
    staleTime: Infinity,
    queryFn: async () => {
      const { data } = await httpClient.get<{ meal: Meal }>(`/meals/${mealId}`);

      return data.meal;
    },
    refetchInterval: (query) => {
      if (query.state.data?.status === 'success') {
        return false;
      }

      return 2_000;
    },
  });

  if (isFetching || meal?.status !== 'success') {
    return (
      <View className="bg-lime-700 flex-1 items-center justify-center gap-12">
        <Logo width={187} height={60} />
        <ActivityIndicator color="#fff" />
      </View>
    );
  }

  return (
    <View className="flex-1 items-center justify-center">
      <Text>
        {JSON.stringify(meal, null, 2)}
      </Text>
      
      <Button onPress={router.back}>
        Voltar
      </Button>
    </View>
  );
}