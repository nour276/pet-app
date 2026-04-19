import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function ChatDetailsScreen() {
  const router = useRouter();
  const { owner, pet } = useLocalSearchParams<{ owner?: string; pet?: string }>();
  const [message, setMessage] = useState('');

  const [messages, setMessages] = useState([
    { id: '1', sender: 'owner', text: `Hello doctor, I wanted to ask about ${pet || 'my pet'}.` },
    { id: '2', sender: 'vet', text: 'Of course, tell me what is happening.' },
    { id: '3', sender: 'owner', text: 'There is a small change and I wanted your advice.' },
  ]);

  const handleSend = () => {
    if (!message.trim()) return;

    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), sender: 'vet', text: message.trim() },
    ]);
    setMessage('');
  };

  return (
    <ImageBackground
      source={require('@/assets/images/sky.jpg')}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={24} color="#24364B" />
            </TouchableOpacity>

            <View style={styles.headerText}>
              <Text style={styles.ownerName}>{owner || 'Conversation'}</Text>
              <Text style={styles.petName}>Pet: {pet || '-'}</Text>
            </View>

            <TouchableOpacity style={styles.headerIcon}>
              <Ionicons name="call-outline" size={20} color="#24364B" />
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={styles.messagesContainer}
            showsVerticalScrollIndicator={false}
          >
            {messages.map((item) => (
              <View
                key={item.id}
                style={[
                  styles.messageBubble,
                  item.sender === 'vet' ? styles.vetBubble : styles.ownerBubble,
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    item.sender === 'vet' ? styles.vetText : styles.ownerText,
                  ]}
                >
                  {item.text}
                </Text>
              </View>
            ))}
          </ScrollView>

          <View style={styles.inputBar}>
            <TouchableOpacity style={styles.attachButton}>
              <Ionicons name="document-attach-outline" size={20} color="#7FA5C7" />
            </TouchableOpacity>

            <TextInput
              style={styles.input}
              placeholder="Write a reply..."
              placeholderTextColor="#8FA0B3"
              value={message}
              onChangeText={setMessage}
            />

            <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
              <Ionicons name="send" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  header: {
    marginTop: 56,
    marginHorizontal: 18,
    marginBottom: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 20,
    minHeight: 72,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#881f1f00',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    flex: 1,
    marginLeft: 12,
  },
  ownerName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#000409',
    marginBottom: 2,
  },
  petName: {
    fontSize: 13,
    color: '#626c78',
  },
  headerIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#7cb98864',
    justifyContent: 'center',
    alignItems: 'center',
  },
  messagesContainer: {
    paddingHorizontal: 18,
    paddingBottom: 20,
  },
  messageBubble: {
    maxWidth: '85%',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 20,
    marginBottom: 12,
  },
  ownerBubble: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(251, 249, 249, 0.92)',
    borderTopLeftRadius: 6,
  },
  vetBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#7DBE8A',
    borderTopRightRadius: 6,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  ownerText: {
    color: '#24364B',
  },
  vetText: {
    color: '#FFFFFF',
  },
  inputBar: {
    marginHorizontal: 18,
    marginBottom: 20,
    backgroundColor: 'rgba(255,255,255,0.94)',
    borderRadius: 25,
    minHeight: 60,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  attachButton: {
    width: 40,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#24364B',
    paddingVertical: 10,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#7DBE8A',
    justifyContent: 'center',
    alignItems: 'center',
  },
});