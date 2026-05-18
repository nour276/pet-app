import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const conversationsData = [
  {
    id: '1',
    owner: 'Sarah Ahmed',
    pet: 'Bella',
    lastMessage: 'Bella is feeling better today, thank you doctor.',
    time: '09:24',
    unread: 2,
    online: true,
  },
  {
    id: '2',
    owner: 'Youssef Ben Ali',
    pet: 'Max',
    lastMessage: 'Can I give him the medicine after food?',
    time: '10:10',
    unread: 0,
    online: false,
  },
  {
    id: '3',
    owner: 'Meriem Trabelsi',
    pet: 'Luna',
    lastMessage: 'I sent the latest temperature reading.',
    time: '11:45',
    unread: 1,
    online: true,
  },
];

export default function ChatScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'All Chats' | 'Unread' | 'Online'>('All Chats');

  const filteredConversations = useMemo(() => {
    return conversationsData.filter((item) => {
      const matchSearch =
        item.owner.toLowerCase().includes(search.toLowerCase()) ||
        item.pet.toLowerCase().includes(search.toLowerCase()) ||
        item.lastMessage.toLowerCase().includes(search.toLowerCase());

      const matchFilter =
        selectedFilter === 'All Chats'
          ? true
          : selectedFilter === 'Unread'
          ? item.unread > 0
          : item.online;

      return matchSearch && matchFilter;
    });
  }, [search, selectedFilter]);

  const openConversation = (item: (typeof conversationsData)[0]) => {
    router.push({
      pathname: '/vet/chat-details',
      params: {
        owner: item.owner,
        pet: item.pet,
      },
    });
  };

  return (
    <ImageBackground
      source={require('../../../assets/images/sky.jpg')}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.pageTitle}>Chat</Text>
          <Text style={styles.pageSubtitle}>
            Answer owners quickly and share advice
          </Text>

          <View style={styles.searchBox}>
            <Ionicons name="search-outline" size={20} color="#7B8EA3" />
            <TextInput
              placeholder="Search by owner or pet name"
              placeholderTextColor="#8FA0B3"
              style={styles.searchInput}
              value={search}
              onChangeText={setSearch}
            />
          </View>

          <View style={styles.quickRow}>
            {['All Chats', 'Unread', 'Online'].map((filter) => (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.quickButton,
                  selectedFilter === filter && styles.quickButtonActive,
                ]}
                onPress={() => setSelectedFilter(filter as 'All Chats' | 'Unread' | 'Online')}
              >
                <Text
                  style={[
                    styles.quickButtonText,
                    selectedFilter === filter && styles.quickButtonTextActive,
                  ]}
                >
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {filteredConversations.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.chatCard}
              activeOpacity={0.85}
              onPress={() => openConversation(item)}
            >
              <View style={styles.avatarWrapper}>
                <View style={styles.avatarCircle}>
                  <Ionicons name="person" size={22} color="#7FA5C7" />
                </View>
                {item.online && <View style={styles.onlineDot} />}
              </View>

              <View style={styles.chatContent}>
                <View style={styles.chatTopRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.ownerName}>{item.owner}</Text>
                    <Text style={styles.petName}>Pet: {item.pet}</Text>
                  </View>

                  <View style={styles.rightTop}>
                    <Text style={styles.timeText}>{item.time}</Text>
                    {item.unread > 0 && (
                      <View style={styles.unreadBadge}>
                        <Text style={styles.unreadText}>{item.unread}</Text>
                      </View>
                    )}
                  </View>
                </View>

                <Text style={styles.lastMessage} numberOfLines={2}>
                  {item.lastMessage}
                </Text>

                <View style={styles.cardFooter}>
                  <TouchableOpacity
                    style={styles.smallActionButton}
                    onPress={() => openConversation(item)}
                  >
                    <Ionicons
                      name="document-text-outline"
                      size={16}
                      color="#7DBE8A"
                    />
                    <Text style={styles.smallActionText}>Prescription</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.smallActionButton}
                    onPress={() => openConversation(item)}
                  >
                    <Ionicons
                      name="chatbubble-ellipses-outline"
                      size={16}
                      color="#7FA5C7"
                    />
                    <Text style={styles.smallActionText}>Reply</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}

          {filteredConversations.length === 0 && (
            <View style={styles.emptyCard}>
              <Ionicons name="chatbubble-ellipses-outline" size={28} color="#7FA5C7" />
              <Text style={styles.emptyTitle}>No conversations found</Text>
              <Text style={styles.emptyText}>
                Try another filter or search term.
              </Text>
            </View>
          )}
        </ScrollView>
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
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 60,
    paddingBottom: 30,
  },
  pageTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: '#24364B',
    marginBottom: 5,
  },
  pageSubtitle: {
    fontSize: 15,
    color: '#f9fcff',
    marginBottom: 18,
  },
  searchBox: {
    height: 50,
    borderRadius: 50,
    backgroundColor: 'rgba(242, 241, 247, 0.82)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: '#24364B',
  },
  quickRow: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  quickButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.33)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    marginRight: 10,
  },
  quickButtonActive: {
    backgroundColor: '#FFFFFF',
  },
  quickButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  quickButtonTextActive: {
    color: '#24364B',
  },
  chatCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.76)',
    borderRadius: 30,
    padding: 16,
    marginBottom: 14,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  avatarWrapper: {
    marginRight: 12,
    position: 'relative',
  },
  avatarCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#ffffff98',
    justifyContent: 'center',
    alignItems: 'center',
  },
  onlineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#6BCB77',
    position: 'absolute',
    right: 6,
    bottom: 8,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  chatContent: {
    flex: 1,
  },
  chatTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  ownerName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#080808',
    marginBottom: 2,
  },
  petName: {
    fontSize: 12.5,
    color: '#4b4c4e',
  },
  rightTop: {
    alignItems: 'flex-end',
  },
  timeText: {
    fontSize: 13,
    color: '#000408',
    marginBottom: 6,
  },
  unreadBadge: {
    minWidth: 20,
    height: 20,
    paddingHorizontal: 6,
    borderRadius: 10,
    backgroundColor: '#60b771',
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  lastMessage: {
    fontSize: 13.5,
    lineHeight: 20,
    color: '#5F6E7D',
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    gap: 15,
  },
  smallActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6F9FC',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 12,
  },
  smallActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#093059',
    marginLeft: 6,
  },
  emptyCard: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 22,
    padding: 22,
    alignItems: 'center',
    marginTop: 10,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2a4b24',
    marginTop: 10,
    marginBottom: 6,
  },
  emptyText: {
    fontSize: 13,
    color: '#6B7C8F',
    textAlign: 'center',
  },
});