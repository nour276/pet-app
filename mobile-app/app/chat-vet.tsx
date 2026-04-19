import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function ChatVetScreen() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: '1', text: 'Hello, how can I help your pet today?', from: 'vet' },
  ]);

  const sendMessage = () => {
    if (!message.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      text: message,
      from: 'user',
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessage('');

    // fake vet reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString() + 'v',
          text: 'Thanks, I will check that for you 👨‍⚕️',
          from: 'vet',
        },
      ]);
    }, 1000);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={26} color="#24364B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Vet Chat</Text>
        <View style={{ width: 26 }} />
      </View>

      {/* Messages */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View
            style={[
              styles.message,
              item.from === 'user' ? styles.userMessage : styles.vetMessage,
            ]}
          >
            <Text
              style={[
                styles.messageText,
                item.from === 'user' && { color: '#fff' },
              ]}
            >
              {item.text}
            </Text>
          </View>
        )}
      />

      {/* Input */}
      <View style={styles.inputRow}>
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="Type your message..."
          style={styles.input}
        />

        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Ionicons name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FB' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 50,
    backgroundColor: '#fff',
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#24364B',
  },

  message: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 10,
  },

  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#88BC55',
  },

  vetMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#E6ECF3',
  },

  messageText: {
    fontSize: 14,
    color: '#24364B',
  },

  inputRow: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
  },

  input: {
    flex: 1,
    height: 45,
    backgroundColor: '#F1F4F9',
    borderRadius: 12,
    paddingHorizontal: 12,
  },

  sendButton: {
    marginLeft: 8,
    backgroundColor: '#88BC55',
    padding: 10,
    borderRadius: 12,
  },
});