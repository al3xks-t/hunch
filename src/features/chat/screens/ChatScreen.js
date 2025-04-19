import { useEffect, useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../../config/firebase';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';


export default function ChatScreen({ route }) {
  const { chatId, user } = route.params;
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const flatListRef = useRef();
  const navigation = useNavigation();

  useEffect(() => {
    const messagesRef = collection(db, 'chats', chatId, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(fetched);
    });

    return () => unsubscribe();
  }, [chatId]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    try {
      const messagesRef = collection(db, 'chats', chatId, 'messages');
      await addDoc(messagesRef, {
        text: input,
        sender: auth.currentUser.uid,
        timestamp: serverTimestamp(),
      });
      setInput('');
      flatListRef.current.scrollToEnd({ animated: true });
    } catch (e) {
      console.error('❌ Failed to send message:', e);
    }
  };


  const renderTimestamp = (timestamp) => {
    if (!timestamp) return null;
    const date = timestamp.toDate();
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formatted = `${(hours % 12) || 12}:${minutes} ${ampm}`;
    return <Text style={styles.timestamp}>{formatted}</Text>;
  };

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: '#fff' }}>

    {/* 🔙 Back Button */}
    <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.chatHeader}>{user.name}</Text>
      </View>

    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1
       }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View
              style={[
                styles.bubble,
                item.sender === auth.currentUser.uid ? styles.myBubble : styles.theirBubble,
              ]}
            >
              <Text style={styles.message}>{item.text}</Text>
              {renderTimestamp(item.timestamp)}
            </View>
          )}
          contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

      <View style={styles.inputContainer}>
        <TextInput
          value={input}
          onChangeText={setInput}
          style={styles.input}
          placeholder="Type a message..."
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        paddingBottom: 4,
        borderBottomWidth: 1,
        borderColor: '#eee',
        backgroundColor: '#fff',
      },
      backText: {
        bottom: 6,
        fontSize: 16,
        color: '#ec4899',
        fontWeight: 'bold',
      },
      chatHeader: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 8,
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
        color: '#444',
      },
  bubble: {
    maxWidth: '75%',
    padding: 10,
    borderRadius: 12,
    marginBottom: 10,
  },
  myBubble: {
    backgroundColor: '#ec4899',
    alignSelf: 'flex-end',
  },
  theirBubble: {
    backgroundColor: '#e5e7eb',
    alignSelf: 'flex-start',
  },
  message: {
    color: '#000',
  },
  timestamp: {
    marginTop: 4,
    fontSize: 10,
    color: '#999',
    textAlign: 'right',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    padding: 12,
    borderRadius: 10,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: '#ec4899',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  sendText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
