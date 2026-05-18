import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

type Message = { id: string; text: string; sender: 'vet' | 'owner'; time: string };
type Contact = { id: string; name: string; petName: string; petType: string; lastTime: string; unread: number; avatar: string };

const PET_ICON: Record<string, string> = { Dog: 'dog-side', Cat: 'cat', Bird: 'bird', Rabbit: 'rabbit' };
const PET_COLOR: Record<string, { color: string; bg: string }> = {
  Dog: { color: '#5B8DEF', bg: '#EEF4FF' },
  Cat: { color: '#9B8DEF', bg: '#F0EEFF' },
  Bird: { color: '#F09A3E', bg: '#FFF3E8' },
  Rabbit: { color: '#7DBE8A', bg: '#E8F7E8' },
};

const AVATAR_COLORS = ['#5B8DEF', '#7DBE8A', '#F09A3E', '#9B8DEF', '#E35D5D'];

const CONTACTS: Contact[] = [
  { id: '1', name: 'Ali Trabelsi', petName: 'Max', petType: 'Dog', lastTime: '10:30', unread: 0, avatar: 'AT' },
  { id: '2', name: 'Sarra Mansouri', petName: 'Luna', petType: 'Cat', lastTime: '09:15', unread: 2, avatar: 'SM' },
  { id: '3', name: 'Karim Ben Salah', petName: 'Charlie', petType: 'Dog', lastTime: 'Yesterday', unread: 1, avatar: 'KB' },
  { id: '4', name: 'Nour Gharbi', petName: 'Bella', petType: 'Cat', lastTime: 'Yesterday', unread: 0, avatar: 'NG' },
  { id: '5', name: 'Houda Slim', petName: 'Rocky', petType: 'Dog', lastTime: '2 days ago', unread: 3, avatar: 'HS' },
];

const INITIAL_MESSAGES: Record<string, Message[]> = {
  '1': [{ id: 'm1', text: 'Hello Dr., when is Max next checkup due?', sender: 'owner', time: '10:20' }],
  '2': [{ id: 'm1', text: 'Is Luna ready for pickup?', sender: 'owner', time: '09:15' }],
  '3': [{ id: 'm1', text: 'What should Charlie eat during recovery?', sender: 'owner', time: 'Yesterday' }],
  '4': [{ id: 'm1', text: "Bella's doing much better. Thank you!", sender: 'owner', time: 'Yesterday' }],
  '5': [{ id: 'm1', text: 'Rocky has not been eating well.', sender: 'owner', time: '2 days ago' }],
};

export default function ChatScreen() {
  const [selected, setSelected] = useState<Contact | null>(null);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [search, setSearch] = useState('');
  const [unread, setUnread] = useState<Record<string, number>>(
    Object.fromEntries(CONTACTS.map(c => [c.id, c.unread]))
  );

  const scrollRef = useRef<ScrollView>(null);

  const totalUnread = Object.values(unread).reduce((a, b) => a + b, 0);

  const filteredContacts = CONTACTS.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.petName.toLowerCase().includes(search.toLowerCase()) ||
    c.petType.toLowerCase().includes(search.toLowerCase())
  );

  const openChat = (c: Contact) => {
    setUnread(prev => ({ ...prev, [c.id]: 0 }));
    setSelected(c);
  };

  const sendMessage = () => {
    if (!input.trim() || !selected) return;

    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const msg: Message = {
      id: Date.now().toString(),
      text: input.trim(),
      sender: 'vet',
      time,
    };

    setMessages(prev => ({
      ...prev,
      [selected.id]: [...(prev[selected.id] || []), msg],
    }));

    setInput('');
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 80);
  };

  if (selected) {
    const thread = messages[selected.id] || [];
    const pc = PET_COLOR[selected.petType] || { color: '#7DBE8A', bg: '#E8F7E8' };
    const pi = PET_ICON[selected.petType] || 'paw';
    const aColor = AVATAR_COLORS[(parseInt(selected.id) - 1) % AVATAR_COLORS.length];

    return (
      <ImageBackground source={require('@/assets/images/sky.jpg')} style={styles.container} resizeMode="cover">
        <View style={styles.chatOverlay}>
          <View style={styles.chatHeader}>
            <TouchableOpacity onPress={() => setSelected(null)} style={styles.backBtn}>
              <Ionicons name="chevron-back" size={22} color="#24364B" />
            </TouchableOpacity>

            <View style={[styles.chatAvatar, { backgroundColor: aColor }]}>
              <Text style={styles.chatAvatarText}>{selected.avatar}</Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.chatHeaderName}>{selected.name}</Text>
              <View style={[styles.chatPetPill, { backgroundColor: pc.bg }]}>
                <MaterialCommunityIcons name={pi as any} size={10} color={pc.color} />
                <Text style={[styles.chatPetText, { color: pc.color }]}>
                  {selected.petName} · {selected.petType}
                </Text>
              </View>
            </View>
          </View>

          <ScrollView
            ref={scrollRef}
            style={styles.messagesArea}
            contentContainerStyle={styles.messagesPad}
            showsVerticalScrollIndicator={false}
          >
            {thread.map(msg => {
              const isVet = msg.sender === 'vet';

              return (
                <View key={msg.id} style={[styles.msgRow, isVet ? styles.msgRowRight : styles.msgRowLeft]}>
                  <View style={[styles.bubble, isVet ? styles.bubbleVet : styles.bubbleOwner]}>
                    <Text style={[styles.bubbleText, isVet ? styles.bubbleTextVet : styles.bubbleTextOwner]}>
                      {msg.text}
                    </Text>
                  </View>
                  <Text style={styles.msgTime}>{msg.time}</Text>
                </View>
              );
            })}
          </ScrollView>

          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <View style={styles.inputBar}>
              <View style={styles.inputWrap}>
                <TextInput
                  value={input}
                  onChangeText={setInput}
                  placeholder="Type a message..."
                  placeholderTextColor="#9AAABB"
                  style={styles.chatInput}
                  multiline
                />
              </View>

              <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
                <Ionicons name="send" size={17} color="#fff" />
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground source={require('@/assets/images/sky.jpg')} style={styles.container} resizeMode="cover">
      <View style={styles.overlay}>
        <View style={styles.header}>
          <View>
            <Text style={styles.pageTitle}>Messages</Text>
            <Text style={styles.pageSubtitle}>
              {totalUnread > 0 ? `${totalUnread} unread messages` : 'All conversations'}
            </Text>
          </View>
        </View>

        {/* Search box */}
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={20} color="#9AAABB" />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search by name or pet..."
            placeholderTextColor="#9AAABB"
            style={styles.searchInput}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={20} color="#9AAABB" />
            </TouchableOpacity>
          )}
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
          {filteredContacts.map((contact, idx) => {
            const pc = PET_COLOR[contact.petType] || { color: '#7DBE8A', bg: '#E8F7E8' };
            const pi = PET_ICON[contact.petType] || 'paw';
            const u = unread[contact.id] || 0;
            const thread = messages[contact.id] || [];
            const lastMsg = thread.length > 0 ? thread[thread.length - 1].text : '—';
            const aColor = AVATAR_COLORS[idx % AVATAR_COLORS.length];

            return (
              <TouchableOpacity
                key={contact.id}
                style={[styles.contactCard, u > 0 && styles.contactCardUnread]}
                onPress={() => openChat(contact)}
                activeOpacity={0.85}
              >
                <View style={styles.avatarWrap}>
                  <View style={[styles.avatarCircle, { backgroundColor: aColor }]}>
                    <Text style={styles.avatarInitials}>{contact.avatar}</Text>
                  </View>
                  <View style={[styles.petBadge, { backgroundColor: pc.bg }]}>
                    <MaterialCommunityIcons name={pi as any} size={10} color={pc.color} />
                  </View>
                </View>

                <View style={styles.contactBody}>
                  <View style={styles.contactRow1}>
                    <Text style={[styles.contactName, u > 0 && styles.contactNameUnread]}>
                      {contact.name}
                    </Text>
                    <Text style={styles.contactTime}>{contact.lastTime}</Text>
                  </View>

                  <View style={styles.contactRow2}>
                    <Text style={styles.contactPreview} numberOfLines={1}>
                      {lastMsg}
                    </Text>

                    {u > 0 && (
                      <View style={styles.unreadBadge}>
                        <Text style={styles.unreadText}>{u}</Text>
                      </View>
                    )}
                  </View>

                  <Text style={styles.contactPetLabel}>
                    {contact.petName} · {contact.petType}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(235,242,255,0.6)',
    paddingTop: 58,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },

  pageTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#24364B',
  },

  pageSubtitle: {
    fontSize: 15,
    color: '#fff',
    fontWeight: '600',
    marginTop: 2,
  },

  searchBox: {
    height: 52,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.95)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 10,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  searchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#24364B',
  },

  list: {
    gap: 10,
    paddingBottom: 20,
  },

  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.97)',
    borderRadius: 20,
    padding: 14,
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  contactCardUnread: {
    borderLeftWidth: 3,
    borderLeftColor: '#7DBE8A',
  },

  avatarWrap: {
    position: 'relative',
    width: 50,
    height: 50,
  },

  avatarCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarInitials: {
    fontSize: 16,
    fontWeight: '800',
    color: '#fff',
  },

  petBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },

  contactBody: {
    flex: 1,
  },

  contactRow1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
  },

  contactName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4B6080',
  },

  contactNameUnread: {
    color: '#24364B',
    fontWeight: '800',
  },

  contactTime: {
    fontSize: 11,
    color: '#B0BAC6',
    fontWeight: '500',
  },

  contactRow2: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },

  contactPreview: {
    flex: 1,
    fontSize: 12,
    color: '#9AAABB',
    fontWeight: '500',
  },

  unreadBadge: {
    backgroundColor: '#7DBE8A',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    paddingHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
  },

  unreadText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#fff',
  },

  contactPetLabel: {
    fontSize: 11,
    color: '#B0BAC6',
    fontWeight: '500',
  },

  chatOverlay: {
    flex: 1,
    backgroundColor: 'rgba(240,245,255,0.88)',
  },

  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.98)',
    paddingTop: 56,
    paddingBottom: 12,
    paddingHorizontal: 12,
    gap: 10,
  },

  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0F3F8',
    justifyContent: 'center',
    alignItems: 'center',
  },

  chatAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
  },

  chatAvatarText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#fff',
  },

  chatHeaderName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#24364B',
  },

  chatPetPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignSelf: 'flex-start',
    marginTop: 2,
  },

  chatPetText: {
    fontSize: 10,
    fontWeight: '700',
  },

  messagesArea: {
    flex: 1,
  },

  messagesPad: {
    padding: 16,
    gap: 14,
    paddingBottom: 10,
  },

  msgRow: {
    maxWidth: '80%',
  },

  msgRowLeft: {
    alignSelf: 'flex-start',
  },

  msgRowRight: {
    alignSelf: 'flex-end',
  },

  bubble: {
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },

  bubbleVet: {
    backgroundColor: '#7DBE8A',
    borderBottomRightRadius: 4,
  },

  bubbleOwner: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
  },

  bubbleText: {
    fontSize: 14,
    lineHeight: 20,
  },

  bubbleTextVet: {
    color: '#fff',
  },

  bubbleTextOwner: {
    color: '#24364B',
  },

  msgTime: {
    fontSize: 10,
    color: '#9AAABB',
    fontWeight: '500',
    marginTop: 3,
  },

  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: 'rgba(255,255,255,0.98)',
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 28,
    gap: 10,
  },

  inputWrap: {
    flex: 1,
    backgroundColor: '#F0F3F8',
    borderRadius: 22,
    paddingHorizontal: 14,
    paddingVertical: 10,
    minHeight: 44,
  },

  chatInput: {
    fontSize: 14,
    color: '#24364B',
    maxHeight: 100,
  },

  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#7DBE8A',
    justifyContent: 'center',
    alignItems: 'center',
  },
})