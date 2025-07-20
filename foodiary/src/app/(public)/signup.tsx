import { router } from 'expo-router';
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react-native';
import { useState } from 'react';
import { View } from 'react-native';
import { AuthLayout } from '../../components/auth-layout';
import { Button } from '../../components/button';
import { GenderStep } from '../../components/sign-up-steps/gender-step';
import { GoalStep } from '../../components/sign-up-steps/goal-step';
import { colors } from '../../styles/colors';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signUpSchema } from '../../components/sign-up-steps/sign-up-schema';
import { BirthDateStep } from '../../components/sign-up-steps/birth-date-step';
import { HeightStep } from '../../components/sign-up-steps/height-step';
import { WeightStep } from '../../components/sign-up-steps/weight-step';
import { ActivityLevelStep } from '../../components/sign-up-steps/activity-level-step';
import { AccountStep } from '../../components/sign-up-steps/account-step';

export default function SignUp() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const form = useForm({
    resolver: zodResolver(signUpSchema),
  });

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
    {
      icon: '📅',
      title: 'Qual é sua data de nascimento?',
      subtitle: 'Sua idade ajuda a personalizar sua dieta',
      Component: BirthDateStep,
    },
    {
      icon: '📏',
      title: 'Qual é sua altura?',
      subtitle: 'Sua altura é importante para o cálculo do IMC',
      Component: HeightStep,
    },
    {
      icon: '⚖️',
      title: 'Qual é seu peso atual?',
      subtitle: 'Seu peso atual nos ajuda a criar sua dieta',
      Component: WeightStep,
    },
    {
      icon: '🏃',
      title: 'Qual é seu nível de atividade?',
      subtitle: 'Isso nos ajuda a calcular suas necessidades calóricas',
      Component: ActivityLevelStep,
    },
    {
      icon: '📝',
      title: 'Crie sua conta',
      subtitle: 'Finalize seu cadastro para começar sua jornada',
      Component: AccountStep,
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
  const isLastStep = currentStepIndex === steps.length - 1;

  return (
    <AuthLayout
      icon={currentStep.icon}
      title={currentStep.title}
      subtitle={currentStep.subtitle}
    >
      <View className="justify-between flex-1">
        <FormProvider {...form}>
          <currentStep.Component />
        </FormProvider>

        <View className="flex-row justify-between gap-4">
          <Button size="icon" color="gray" onPress={handlePreviousStep}>
            <ArrowLeftIcon size={20} color={colors.black[700]} />
          </Button>
          
          {isLastStep ? (
            <Button className="flex-1" onPress={handleNextStep}>
              Criar conta
            </Button>
          ) : (
            <Button size="icon" onPress={handleNextStep}>
              <ArrowRightIcon size={20} color={colors.black[700]} />
            </Button>
          )}
        </View>
      </View>
    </AuthLayout>
  );
}