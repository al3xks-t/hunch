import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';

const promptPool = [
  "I’m known for...", "My toxic trait is...", "One thing I’ll never do again is...", "I geek out over...", "My worst habit is...", "A dream I’ve never told anyone...", "My comfort TV show is...", "If I had a catchphrase, it’d be...", "My personality in 3 emojis:", "I’m irrationally afraid of...",
  "A green flag I look for is...", "I’ll fall for you if...", "My love language is...", "An ideal date looks like...", "I’m looking for someone who...", "A weird romantic hill I’ll die on:", "A small act of love I value:", "My most unhinged relationship opinion is...",
  "I once got kicked out of...", "The most unhinged thing I’ve done on impulse:", "My most niche ick is...", "If I were a conspiracy theory, I'd be...", "The best lie I’ve ever told:", "My villain origin story began when...", "My Roman Empire is...", "A core memory that lives rent free:",
  "A song that lives in my head:", "My guilty pleasure playlist includes...", "My go-to karaoke song:", "A movie that changed me:", "I can quote this movie line by line:", "My top artist last year was...", "If my life had a theme song...",
  "I won’t shut up about...", "My weekend usually looks like...", "The best meal I’ve ever had:", "A weird food combo I swear by:", "I could talk for hours about...", "I’m unreasonably good at...", "You’ll find me happiest when...",
  "A hot take I stand by:", "My most controversial food opinion:", "A belief I’ll never let go of:", "I think everyone should try...", "A hill I’ll die on:", "Something underrated:", "Something overrated:",
  "My favorite place on Earth:", "A travel story I tell too often:", "I want to visit...", "A random bucket list item:", "Where I’d move if I could:", "My dream job as a kid was...",
  "My red flag is...", "My green flag is...", "What keeps me up at night:", "A vibe I give off:", "I judge people by...", "The weirdest compliment I’ve received:", "I act like I’m okay but...",
  "What I’m currently working on:", "A goal I’m proud of:", "One thing I’m trying to be better at:", "Something that changed me:", "I’m in my ___ era:", "In 5 years I hope to...",
  "The last thing I Googled:", "My AI-generated fun fact would be:", "I’m a firm believer that...", "What scares me (in a good way):", "My origin story in 3 words:", "I believe in ___ energy:", "A plot twist in my life:", "My hidden talent:", "My most iconic failure:"
];

export default function PromptPickerScreen({ onSubmit }) {
  const [selectedPrompts, setSelectedPrompts] = useState([]);
  const [answers, setAnswers] = useState({});

  const togglePrompt = (prompt) => {
    if (selectedPrompts.includes(prompt)) {
      setSelectedPrompts(prev => prev.filter(p => p !== prompt));
      const updatedAnswers = { ...answers };
      delete updatedAnswers[prompt];
      setAnswers(updatedAnswers);
    } else if (selectedPrompts.length < 6) {
      setSelectedPrompts(prev => [...prev, prompt]);
    } else {
      Alert.alert("Limit reached", "You can only choose up to 6 prompts.");
    }
  };

  const handleAnswerChange = (prompt, text) => {
    setAnswers(prev => ({ ...prev, [prompt]: text }));
  };

  const handleContinue = () => {
    if (selectedPrompts.length < 3) {
      return Alert.alert("Choose at least 3 prompts");
    }
    const filledAnswers = selectedPrompts.filter(p => answers[p]?.trim().length > 0);
    if (filledAnswers.length < 3) {
      return Alert.alert("Please answer at least 3 prompts.");
    }
    onSubmit(answers);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Pick 3 to 6 prompts and answer them 💭</Text>

      {promptPool.map((prompt, idx) => (
        <View key={idx} style={styles.promptBlock}>
          <TouchableOpacity onPress={() => togglePrompt(prompt)}>
            <Text style={[styles.promptText, selectedPrompts.includes(prompt) && styles.selected]}>
              {prompt}
            </Text>
          </TouchableOpacity>
          {selectedPrompts.includes(prompt) && (
            <TextInput
              style={styles.answerInput}
              placeholder="Your answer..."
              multiline
              value={answers[prompt] || ''}
              onChangeText={(text) => handleAnswerChange(prompt, text)}
            />
          )}
        </View>
      ))}

      <TouchableOpacity style={styles.button} onPress={handleContinue}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingBottom: 100,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  promptBlock: {
    marginBottom: 16,
  },
  promptText: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  selected: {
    fontWeight: 'bold',
    color: '#ec4899',
  },
  answerInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    minHeight: 60,
  },
  button: {
    backgroundColor: '#ec4899',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
