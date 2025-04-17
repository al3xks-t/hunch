import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList } from 'react-native';

const MASTER_PROMPTS = [
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

export default function PromptManager({ initialPrompts = {}, onChange }) {
  const [prompts, setPrompts] = useState(initialPrompts);
  const [selectedPrompt, setSelectedPrompt] = useState('');
  const [answer, setAnswer] = useState('');

  const handleAdd = () => {
    if (selectedPrompt && answer.trim()) {
      const updated = { ...prompts, [selectedPrompt]: answer };
      setPrompts(updated);
      setAnswer('');
      setSelectedPrompt('');
      onChange(updated);
    }
  };

  const handleRemove = (prompt) => {
    const updated = { ...prompts };
    delete updated[prompt];
    setPrompts(updated);
    onChange(updated);
  };

  const handleEdit = (prompt, value) => {
    const updated = { ...prompts, [prompt]: value };
    setPrompts(updated);
    onChange(updated);
  };

  return (
    <View>
      <Text style={styles.header}>Edit Prompts</Text>

      <FlatList
        data={Object.keys(prompts)}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <View style={styles.promptRow}>
            <Text style={styles.prompt}>{item}</Text>
            <TextInput
              style={styles.input}
              value={prompts[item]}
              onChangeText={(text) => handleEdit(item, text)}
            />
            <TouchableOpacity onPress={() => handleRemove(item)}>
              <Text style={styles.remove}>🗑</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <Text style={styles.label}>Add Prompt</Text>
      <FlatList
        horizontal
        data={MASTER_PROMPTS.filter(p => !prompts[p])}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => setSelectedPrompt(item)} style={styles.choice}>
            <Text style={{ color: selectedPrompt === item ? '#fff' : '#000' }}>{item}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap' }}
      />

      {selectedPrompt && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Your answer"
            value={answer}
            onChangeText={setAnswer}
          />
          <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
            <Text style={styles.addText}>Add Prompt</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  promptRow: {
    marginBottom: 16,
  },
  prompt: {
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 6,
    marginTop: 4,
    marginBottom: 8,
  },
  remove: {
    color: 'red',
    fontSize: 18,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 8,
  },
  choice: {
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
    marginRight: 8,
  },
  addButton: {
    backgroundColor: '#ec4899',
    padding: 12,
    borderRadius: 10,
    marginTop: 12,
    alignItems: 'center',
  },
  addText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
