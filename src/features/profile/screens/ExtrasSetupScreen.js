import { useState } from 'react';
import { View, Text, StyleSheet, InteractionManager } from 'react-native';
import { auth, db } from '../../../config/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../../context/AuthContext';
import PromptPickerScreen from './PromptPickerScreen';

// Step components (to be created next)
import Step_Sexuality from './extrasSteps/Step_Sexuality.js';
import Step_DatingIntentions from './extrasSteps/Step_DatingIntentions';
import Step_Height from './extrasSteps/Step_Height';
import Step_Religion from './extrasSteps/Step_Religion';
import Step_Politics from './extrasSteps/Step_Politics';
import Step_SubstanceUsage from './extrasSteps/Step_SubstanceUsage';
import Step_Interests from './extrasSteps/Step_Interests';

export default function ExtrasSetupScreen() {
  const [step, setStep] = useState(0);
  const [extras, setExtras] = useState({});
  const navigation = useNavigation();
  const { refreshProfile } = useAuth();


  const handleNext = (field, value) => {
    setExtras(prev => ({ ...prev, [field]: value }));
    setStep(prev => prev + 1);
  };

  const handleSubmit = async (prompts) => {
    try {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userRef, { extras: { ...extras, prompts } });
      await refreshProfile();
      console.log('✅ Extras saved to Firestore:', extras);

      InteractionManager.runAfterInteractions(() => {
        navigation.replace('Home');
      });
    } catch (e) {
      console.error('❌ Error saving extras:', e);
    }
  };

  const steps = [
    <Step_Sexuality onNext={(val) => handleNext('sexuality', val)} />,
    <Step_DatingIntentions onNext={(val) => handleNext('intentions', val)} />,
    <Step_Height onNext={(val) => handleNext('height', val)} />,
    <Step_Religion onNext={(val) => handleNext('religion', val)} />,
    <Step_Politics onNext={(val) => handleNext('politics', val)} />,
    <Step_SubstanceUsage onNext={(val) => handleNext('substances', val)} />,
    <Step_Interests onNext={(val) => handleNext('interests', val)} />,
    <PromptPickerScreen onSubmit={handleSubmit} />,
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.progress}>Step {step + 1} of {steps.length}</Text>
      {steps[step]}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  progress: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
    marginBottom: 20,
  },
});
