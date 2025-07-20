import { router } from 'expo-router';
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react-native';
import { useState } from 'react';
import { View } from 'react-native';
import { AuthLayout } from '../../components/auth-layout';
import { Button } from '../../components/button';
import { GenderStep } from '../../components/sign-up-steps/gender-step';
import { GoalStep } from '../../components/sign-up-steps/goal-step';
import { colors } from '../../styles/colors';

export default function SignUp() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const steps = [
    {
      icon: '🎯',
      title: 'Qual é seu objetivo?',
      subtitle: 'O que você pretende alcançar com a dieta?',
      Component: GoalStep,
    },
    {
      icon: '👥',
      title: 'Qual é seu gênero',
      subtitle: 'Seu gênero influencia no tipo da dieta',
      Component: GenderStep,
    },
  ];

  function handlePreviousStep() {
    if (currentStepIndex === 0) {
      router.back();
      return;
    }

    setCurrentStepIndex(prevState => prevState - 1);
  }

  function handleNextStep() {
    setCurrentStepIndex(prevState => prevState + 1);
  }

  const currentStep = steps[currentStepIndex];

  return (
    <AuthLayout
      icon={currentStep.icon}
      title={currentStep.title}
      subtitle={currentStep.subtitle}
    >
      <View className="justify-between flex-1">
        <currentStep.Component />

        <View className="flex-row justify-between">
          <Button size="icon" color="gray" onPress={handlePreviousStep}>
            <ArrowLeftIcon size={20} color={colors.black[700]} />
          </Button>
          
          <Button size="icon" onPress={handleNextStep}>
            <ArrowRightIcon size={20} color={colors.black[700]} />
          </Button>
        </View>
      </View>
    </AuthLayout>
  );
}