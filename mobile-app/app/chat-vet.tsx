import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
  Image,
  Animated,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

type Message = {
  id: string;
  text: string;
  from: 'user' | 'vet';
  time: string;
};

const QUICK_REPLIES = [
  'My pet is sick',
  'Need vaccination info',
  'Book appointment',
  'Medication question',
];

const VET = {
  name: 'Dr. Sarah Johnson',
  specialty: 'General Practice',
  rating: 4.9,
  online: true,
};

function formatTime(date: Date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

const AUTO_REPLIES: Record<string, string> = {
  'my pet is sick': "I'm sorry to hear that. Could you describe the symptoms? When did they start?",
  'need vaccination info': 'I can help with vaccination schedules. Which animal and how old is your pet?',
  'book appointment': 'I can arrange that for you. Please use the Book Appointment screen or I can check availability here.',
  'medication question': 'Of course. Please tell me which medication you have questions about.',
};

function getAutoReply(text: string): string {
  const lower = text.toLowerCase().trim();
  for (const key of Object.keys(AUTO_REPLIES)) {
    if (lower.includes(key.split(' ')[0])) return AUTO_REPLIES[key];
  }
  return "Thank you for your message. I'll review it and get back to you shortly. 🩺";
}

export default function ChatVetScreen() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m Dr. Sarah Johnson. How can I help your pet today? 🐾',
      from: 'vet',
      time: formatTime(new Date()),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const listRef = useRef<FlatList>(null);
  const typingDot1 = useRef(new Animated.Value(0)).current;
  const typingDot2 = useRef(new Animated.Value(0)).current;
  const typingDot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!isTyping) return;
    const anim = (dot: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, { toValue: -6, duration: 300, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0, duration: 300, useNativeDriver: true }),
        ])
      );
    const a1 = anim(typingDot1, 0);
    const a2 = anim(typingDot2, 150);
    const a3 = anim(typingDot3, 300);
    a1.start(); a2.start(); a3.start();
    return () => { a1.stop(); a2.stop(); a3.stop(); };
  }, [isTyping]);

  const sendMessage = (text?: string) => {
    const content = (text ?? message).trim();
    if (!content) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: content,
      from: 'user',
      time: formatTime(new Date()),
    };
    setMessages(prev => [...prev, userMsg]);
    setMessage('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const reply: Message = {
        id: Date.now().toString() + 'v',
        text: getAutoReply(content),
        from: 'vet',
        time: formatTime(new Date()),
      };
      setMessages(prev => [...prev, reply]);
    }, 1800);
  };

  useEffect(() => {
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
  }, [messages, isTyping]);

  const renderMessage = ({ item, index }: { item: Message; index: number }) => {
    const isUser = item.from === 'user';
    const prevMsg = index > 0 ? messages[index - 1] : null;
    const showAvatar = !isUser && (!prevMsg || prevMsg.from === 'user');

    return (
      <View style={[styles.msgRow, isUser && styles.msgRowUser]}>
        {!isUser && (
          <View style={styles.vetAvatarSmall}>
            {showAvatar ? (
              <Image source={require('@/assets/images/yassine.jpg')} style={styles.vetAvatarImg} />
            ) : (
              <View style={{ width: 36 }} />
            )}
          </View>
        )}
        <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleVet]}>
          <Text style={[styles.bubbleText, isUser && styles.bubbleTextUser]}>{item.text}</Text>
          <Text style={[styles.bubbleTime, isUser && styles.bubbleTimeUser]}>{item.time}</Text>
        </View>
      </View>
    );
  };

  return (
    <ImageBackground source={require('@/assets/images/sky.jpg')} style={styles.container} resizeMode="cover">
      <View style={styles.overlay}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="#24364B" />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Image source={require('@/assets/images/yassine.jpg')} style={styles.headerAvatar} />
            <View style={styles.onlineDot} />
            <View>
              <Text style={styles.headerName}>{VET.name}</Text>
              <View style={styles.headerMeta}>
                <View style={styles.onlinePill}>
                  <View style={styles.onlineDotSmall} />
                  <Text style={styles.onlineText}>Online</Text>
                </View>
                <Text style={styles.specialtyText}> · {VET.specialty}</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.callBtn} onPress={() => {}}>
            <Ionicons name="call-outline" size={20} color="#5B8DEF" />
          </TouchableOpacity>
        </View>

        {/* Vet info strip */}
        <View style={styles.vetInfoStrip}>
          <View style={styles.vetInfoItem}>
            <Ionicons name="star" size={14} color="#F6C453" />
            <Text style={styles.vetInfoText}>{VET.rating} rating</Text>
          </View>
          <View style={styles.vetInfoDivider} />
          <View style={styles.vetInfoItem}>
            <MaterialCommunityIcons name="stethoscope" size={14} color="#7DBE8A" />
            <Text style={styles.vetInfoText}>{VET.specialty}</Text>
          </View>
          <View style={styles.vetInfoDivider} />
          <View style={styles.vetInfoItem}>
            <Ionicons name="shield-checkmark" size={14} color="#5B8DEF" />
            <Text style={styles.vetInfoText}>Verified</Text>
          </View>
        </View>

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={0}
        >
          {/* Messages */}
          <FlatList
            ref={listRef}
            data={messages}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.messagesList}
            renderItem={renderMessage}
            ListFooterComponent={
              isTyping ? (
                <View style={styles.msgRow}>
                  <View style={styles.vetAvatarSmall}>
                    <Image source={require('@/assets/images/yassine.jpg')} style={styles.vetAvatarImg} />
                  </View>
                  <View style={styles.typingBubble}>
                    {[typingDot1, typingDot2, typingDot3].map((dot, i) => (
                      <Animated.View key={i} style={[styles.typingDot, { transform: [{ translateY: dot }] }]} />
                    ))}
                  </View>
                </View>
              ) : null
            }
          />

          {/* Quick replies */}
          {messages.length <= 2 && (
            <View style={styles.quickRepliesRow}>
              {QUICK_REPLIES.map(q => (
                <TouchableOpacity key={q} style={styles.quickChip} onPress={() => sendMessage(q)} activeOpacity={0.8}>
                  <Text style={styles.quickChipText}>{q}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Input bar */}
          <View style={styles.inputBar}>
            <View style={styles.inputWrapper}>
              <TextInput
                value={message}
                onChangeText={setMessage}
                placeholder="Type a message..."
                placeholderTextColor="#9AAABB"
                style={styles.input}
                multiline
                maxLength={500}
                onSubmitEditing={() => sendMessage()}
              />
            </View>
            <TouchableOpacity
              style={[styles.sendBtn, !message.trim() && styles.sendBtnDisabled]}
              onPress={() => sendMessage()}
              activeOpacity={0.85}
            >
              <Ionicons name="send" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(240,245,255,0.82)',
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 54,
    paddingBottom: 12,
    paddingHorizontal: 14,
    backgroundColor: 'rgba(255,255,255,0.96)',
    borderBottomWidth: 1,
    borderBottomColor: '#EDF0F5',
    gap: 10,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F0F4FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    position: 'relative',
  },
  headerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#7DBE8A',
  },
  onlineDot: {
    position: 'absolute',
    left: 32,
    bottom: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#67B56E',
    borderWidth: 2,
    borderColor: '#fff',
  },
  headerName: { fontSize: 15, fontWeight: '800', color: '#24364B' },
  headerMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  onlinePill: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  onlineDotSmall: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: '#67B56E' },
  onlineText: { fontSize: 11, fontWeight: '700', color: '#67B56E' },
  specialtyText: { fontSize: 11, color: '#9AAABB', fontWeight: '600' },
  callBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#EEF4FF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Vet info strip
  vetInfoStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EDF0F5',
    gap: 6,
  },
  vetInfoItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  vetInfoText: { fontSize: 11, fontWeight: '700', color: '#4B6A8C' },
  vetInfoDivider: { width: 1, height: 14, backgroundColor: '#D8DEE8', marginHorizontal: 8 },

  // Messages
  messagesList: {
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 10,
  },
  msgRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 8,
    gap: 8,
  },
  msgRowUser: {
    flexDirection: 'row-reverse',
  },
  vetAvatarSmall: { width: 36, alignItems: 'center' },
  vetAvatarImg: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#7DBE8A',
  },
  bubble: {
    maxWidth: '72%',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  bubbleVet: {
    backgroundColor: 'rgba(255,255,255,0.97)',
    borderBottomLeftRadius: 4,
  },
  bubbleUser: {
    backgroundColor: '#5B8DEF',
    borderBottomRightRadius: 4,
  },
  bubbleText: { fontSize: 14, color: '#24364B', lineHeight: 20 },
  bubbleTextUser: { color: '#fff' },
  bubbleTime: { fontSize: 10, color: '#9AAABB', fontWeight: '600', marginTop: 4, textAlign: 'right' },
  bubbleTimeUser: { color: 'rgba(255,255,255,0.7)' },

  // Typing indicator
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,255,255,0.97)',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 20,
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#9AAABB',
  },

  // Quick replies
  quickRepliesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 14,
    paddingBottom: 10,
  },
  quickChip: {
    backgroundColor: 'rgba(255,255,255,0.94)',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#D8E8FF',
  },
  quickChipText: { fontSize: 12, fontWeight: '700', color: '#5B8DEF' },

  // Input bar
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 14,
    paddingVertical: 10,
    paddingBottom: Platform.OS === 'ios' ? 28 : 14,
    backgroundColor: 'rgba(255,255,255,0.96)',
    borderTopWidth: 1,
    borderTopColor: '#EDF0F5',
    gap: 10,
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: '#F0F4FA',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    minHeight: 46,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E0E8F4',
  },
  input: {
    fontSize: 14,
    color: '#24364B',
    maxHeight: 100,
  },
  sendBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#5B8DEF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#5B8DEF',
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  sendBtnDisabled: {
    backgroundColor: '#B0BAC6',
    shadowOpacity: 0,
    elevation: 0,
  },
});
