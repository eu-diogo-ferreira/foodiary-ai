import { router, useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

import { Button } from '../../../components/button';

export default function MealDetails() {
  const { meal_id } = useLocalSearchParams();

  return (
    <View className="flex-1 items-center justify-center">
      <Text>
        Detalhes da refeição: {meal_id}
      </Text>

      <Button onPress={router.back}>
        Voltar
      </Button>
    </View>
  );
}