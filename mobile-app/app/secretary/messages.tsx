import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Message {
  id: number;
  from: 'owner' | 'secretary';
  text: string;
  time: string;
}

interface Conversation {
  id: number;
  name: string;
  pet: string;
  phone: string;
  initials: string;
  color: string;
  lastMessage: string;
  lastTime: string;
  unread: number;
  messages: Message[];
}

const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 1,
    name: 'Ali Trabelsi',
    pet: 'Max',
    phone: '+216 55 123 456',
    initials: 'AT',
    color: '#5B8DEF',
    lastMessage: "Can I confirm Max's appointment for tomorrow?",
    lastTime: '09:14',
    unread: 1,
    messages: [
      { id: 1, from: 'owner', text: "Hello! I wanted to ask about Max's checkup next week.", time: '08:50' },
      { id: 2, from: 'secretary', text: "Hi Ali! Max has a checkup scheduled for tomorrow at 09:00. Shall I confirm it?", time: '08:55' },
      { id: 3, from: 'owner', text: "Can I confirm Max's appointment for tomorrow?", time: '09:14' },
    ],
  },
  {
    id: 2,
    name: 'Sarra Mansouri',
    pet: 'Luna',
    phone: '+216 22 987 654',
    initials: 'SM',
    color: '#9B8DEF',
    lastMessage: "Is Luna's appointment still at 10:30?",
    lastTime: '10:02',
    unread: 1,
    messages: [
      { id: 1, from: 'owner', text: "Good morning! I just wanted to double-check Luna's appointment time.", time: '09:45' },
      { id: 2, from: 'owner', text: "Is Luna's appointment still at 10:30?", time: '10:02' },
    ],
  },
  {
    id: 3,
    name: 'Karim Ben Salah',
    pet: 'Charlie',
    phone: '+216 98 456 789',
    initials: 'KB',
    color: '#7DBE8A',
    lastMessage: "Thank you, we'll be there on time.",
    lastTime: 'Yesterday',
    unread: 0,
    messages: [
      { id: 1, from: 'owner', text: "Hi, I need to reschedule Charlie's follow-up.", time: '14:10' },
      { id: 2, from: 'secretary', text: 'Of course! What date works best for you?', time: '14:15' },
      { id: 3, from: 'owner', text: 'Can we do Thursday at 13:00?', time: '14:18' },
      { id: 4, from: 'secretary', text: 'Thursday 13:00 is confirmed for Charlie. See you then!', time: '14:22' },
      { id: 5, from: 'owner', text: "Thank you, we'll be there on time.", time: '14:25' },
    ],
  },
  {
    id: 4,
    name: 'Nour Gharbi',
    pet: 'Bella',
    phone: '+216 71 654 321',
    initials: 'NG',
    color: '#F09A3E',
    lastMessage: 'What documents should I bring for the first visit?',
    lastTime: 'Yesterday',
    unread: 0,
    messages: [
      { id: 1, from: 'owner', text: 'Hello, I registered Bella for her first visit.', time: '11:00' },
      { id: 2, from: 'secretary', text: 'Welcome! We look forward to meeting Bella. Your appointment is at 15:30.', time: '11:05' },
      { id: 3, from: 'owner', text: 'What documents should I bring for the first visit?', time: '11:08' },
    ],
  },
];

const FILTERS = ['All', 'Unread'] as const;

const QUICK_REPLIES = [
  'Appointment confirmed ✓',
  'Please call us',
  "We'll get back to you",
  'The vet will see you soon',
  'Can you reschedule?',
];

const EMOJIS = ['😊', '👋', '✅', '🐾', '📅', '⏰', '💊', '🏥', '👍', '❤️', '🙏', '📞'];

function nowTime() {
  return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
}

export default function SecretaryMessages() {
  const [convs, setConvs]               = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [search, setSearch]             = useState('');
  const [filter, setFilter]             = useState<typeof FILTERS[number]>('All');
  const [activeConv, setActiveConv]     = useState<Conversation | null>(null);
  const [replyText, setReplyText]       = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const scrollRef                       = useRef<ScrollView>(null);

  const totalUnread = convs.reduce((sum, c) => sum + c.unread, 0);

  const visible = convs.filter(c => {
    const matchFilter = filter === 'All' || c.unread > 0;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.pet.toLowerCase().includes(q) ||
      c.lastMessage.toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });

  function openConv(conv: Conversation) {
    setConvs(prev => prev.map(c => c.id === conv.id ? { ...c, unread: 0 } : c));
    setActiveConv({ ...conv, unread: 0 });
    setReplyText('');
  }

  function sendReply() {
    if (!replyText.trim() || !activeConv) return;
    const newMsg: Message = {
      id:   Date.now(),
      from: 'secretary',
      text: replyText.trim(),
      time: nowTime(),
    };
    const updated: Conversation = {
      ...activeConv,
      messages:    [...activeConv.messages, newMsg],
      lastMessage: newMsg.text,
      lastTime:    newMsg.time,
    };
    setActiveConv(updated);
    setConvs(prev => prev.map(c => c.id === updated.id ? updated : c));
    setReplyText('');
    setShowEmojiPicker(false);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 80);
  }

  function handleCall() {
    if (!activeConv) return;
    Alert.alert(
      `Call ${activeConv.name}`,
      activeConv.phone,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Call',
          onPress: () => Linking.openURL(`tel:${activeConv.phone.replace(/\s/g, '')}`),
        },
      ]
    );
  }

  function handleDeleteConv() {
    if (!activeConv) return;
    Alert.alert(
      'Delete Conversation',
      `Remove the conversation with ${activeConv.name}? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setConvs(prev => prev.filter(c => c.id !== activeConv.id));
            setActiveConv(null);
          },
        },
      ]
    );
  }

  function handleOptions() {
    if (!activeConv) return;
    Alert.alert(
      activeConv.name,
      'Choose an action',
      [
        {
          text: 'Mark as Resolved',
          onPress: () =>
            Alert.alert('Resolved', `${activeConv.name}'s conversation has been marked as resolved.`),
        },
        {
          text: 'Delete Conversation',
          style: 'destructive',
          onPress: handleDeleteConv,
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  }

  return (
    <ImageBackground
      source={require('@/assets/images/sky.jpg')}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.overlay}>

        {/* ── Header ── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Messages</Text>
            <Text style={styles.subtitle}>Owner communications</Text>
          </View>
          {totalUnread > 0 && (
            <View style={styles.unreadBubble}>
              <Text style={styles.unreadBubbleText}>{totalUnread} unread</Text>
            </View>
          )}
        </View>

        {/* ── Search ── */}
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={18} color="#9AAABB" />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search conversations…"
            placeholderTextColor="#9AAABB"
            style={styles.searchInput}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={18} color="#9AAABB" />
            </TouchableOpacity>
          )}
        </View>

        {/* ── Filter Tabs ── */}
        <View style={styles.filterRow}>
          {FILTERS.map(f => (
            <TouchableOpacity
              key={f}
              style={[styles.filterTab, filter === f && styles.filterTabActive]}
              onPress={() => setFilter(f)}
              activeOpacity={0.75}
            >
              <Text style={[styles.filterTabText, filter === f && styles.filterTabTextActive]}>
                {f}
              </Text>
              {f === 'Unread' && totalUnread > 0 && (
                <View style={styles.filterBadge}>
                  <Text style={styles.filterBadgeText}>{totalUnread}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Conversation List ── */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
        >
          {visible.length === 0 && (
            <View style={styles.emptyBox}>
              <Ionicons name="chatbubbles-outline" size={44} color="#C8D5E2" />
              <Text style={styles.emptyText}>No messages found</Text>
            </View>
          )}

          {visible.map(conv => (
            <TouchableOpacity
              key={conv.id}
              style={[styles.convCard, conv.unread > 0 && styles.convCardUnread]}
              onPress={() => openConv(conv)}
              activeOpacity={0.8}
            >
              <View style={[styles.avatar, { backgroundColor: conv.color }]}>
                <Text style={styles.avatarText}>{conv.initials}</Text>
                {conv.unread > 0 && <View style={styles.onlineDot} />}
              </View>

              <View style={styles.convContent}>
                <View style={styles.convTopRow}>
                  <Text style={[styles.convName, conv.unread > 0 && styles.convNameBold]}>
                    {conv.name}
                  </Text>
                  <Text style={[styles.convTime, conv.unread > 0 && { color: conv.color }]}>
                    {conv.lastTime}
                  </Text>
                </View>
                <View style={styles.convBottomRow}>
                  <View style={styles.petTag}>
                    <Ionicons name="paw-outline" size={11} color="#9AAABB" />
                    <Text style={styles.petTagText}>{conv.pet}</Text>
                  </View>
                  <Text
                    style={[styles.convPreview, conv.unread > 0 && styles.convPreviewBold]}
                    numberOfLines={1}
                  >
                    {conv.lastMessage}
                  </Text>
                </View>
              </View>

              {conv.unread > 0 && (
                <View style={[styles.unreadDot, { backgroundColor: conv.color }]}>
                  <Text style={styles.unreadDotText}>{conv.unread}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* ── Chat Modal ── */}
      <Modal
        visible={!!activeConv}
        animationType="slide"
        transparent
        onRequestClose={() => setActiveConv(null)}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.chatModal}>
            {activeConv && (
              <>
                {/* Colored accent strip */}
                <View style={[styles.chatAccentBar, { backgroundColor: activeConv.color }]} />

                {/* Header */}
                <View style={styles.chatHeader}>
                  <TouchableOpacity
                    style={styles.chatBackBtn}
                    onPress={() => setActiveConv(null)}
                  >
                    <Ionicons name="arrow-back" size={20} color="#24364B" />
                  </TouchableOpacity>

                  <View style={[styles.chatAvatar, { backgroundColor: activeConv.color }]}>
                    <Text style={styles.chatAvatarText}>{activeConv.initials}</Text>
                  </View>

                  <View style={styles.chatHeaderInfo}>
                    <Text style={styles.chatHeaderName}>{activeConv.name}</Text>
                    <View style={styles.chatStatusRow}>
                      <View style={styles.activeDot} />
                      <Text style={styles.chatStatusText}>Active now</Text>
                      <Text style={styles.chatDotSep}> · </Text>
                      <Ionicons name="paw-outline" size={10} color="#9AAABB" />
                      <Text style={styles.chatPetLabel}> {activeConv.pet}</Text>
                    </View>
                  </View>

                  <TouchableOpacity style={styles.chatActionBtn} onPress={handleCall}>
                    <Ionicons name="call-outline" size={19} color={activeConv.color} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.chatActionBtn} onPress={handleOptions}>
                    <Ionicons name="ellipsis-vertical" size={19} color="#738295" />
                  </TouchableOpacity>
                </View>

                <View style={styles.chatHeaderDivider} />

                {/* Messages */}
                <ScrollView
                  ref={scrollRef}
                  style={styles.chatScroll}
                  contentContainerStyle={styles.chatScrollContent}
                  onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}
                  showsVerticalScrollIndicator={false}
                >
                  {/* Date separator */}
                  <View style={styles.dateSep}>
                    <View style={styles.dateSepLine} />
                    <View style={styles.dateSepChip}>
                      <Text style={styles.dateSepText}>
                        {activeConv.lastTime === 'Yesterday' ? 'Yesterday' : 'Today'}
                      </Text>
                    </View>
                    <View style={styles.dateSepLine} />
                  </View>

                  {activeConv.messages.map((msg, idx) => {
                    const isSec   = msg.from === 'secretary';
                    const isFirst = idx === 0 || activeConv.messages[idx - 1].from !== msg.from;
                    const isLast  =
                      idx === activeConv.messages.length - 1 ||
                      activeConv.messages[idx + 1].from !== msg.from;

                    return (
                      <View
                        key={msg.id}
                        style={[
                          styles.bubbleRow,
                          isSec ? styles.bubbleRowRight : styles.bubbleRowLeft,
                          isFirst && idx > 0 ? { marginTop: 12 } : { marginTop: 2 },
                        ]}
                      >
                        {!isSec && (
                          isFirst
                            ? <View style={[styles.bubbleAvatar, { backgroundColor: activeConv.color }]}>
                                <Text style={styles.bubbleAvatarText}>{activeConv.initials[0]}</Text>
                              </View>
                            : <View style={styles.bubbleAvatarSpacer} />
                        )}

                        <View style={[
                          styles.bubble,
                          isSec ? styles.bubbleSec : styles.bubbleOwner,
                          isSec
                            ? {
                                backgroundColor: activeConv.color,
                                borderBottomRightRadius: isLast ? 5 : 18,
                              }
                            : {
                                borderBottomLeftRadius: isLast ? 5 : 18,
                              },
                        ]}>
                          <Text style={[styles.bubbleText, { color: isSec ? '#fff' : '#24364B' }]}>
                            {msg.text}
                          </Text>
                          <View style={styles.bubbleFooter}>
                            <Text style={[
                              styles.bubbleTime,
                              { color: isSec ? 'rgba(255,255,255,0.6)' : '#9AAABB' },
                            ]}>
                              {msg.time}
                            </Text>
                            {isSec && (
                              <Ionicons
                                name="checkmark-done"
                                size={13}
                                color="rgba(255,255,255,0.75)"
                                style={{ marginLeft: 3 }}
                              />
                            )}
                          </View>
                        </View>
                      </View>
                    );
                  })}
                </ScrollView>

                {/* Emoji Picker */}
                {showEmojiPicker && (
                  <View style={styles.emojiGrid}>
                    {EMOJIS.map(e => (
                      <TouchableOpacity
                        key={e}
                        style={styles.emojiItem}
                        onPress={() => {
                          setReplyText(prev => prev + e);
                          setShowEmojiPicker(false);
                        }}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.emojiChar}>{e}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}

                {/* Quick Replies */}
                <View style={styles.quickReplyBar}>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.quickReplyContent}
                  >
                    {QUICK_REPLIES.map(qr => (
                      <TouchableOpacity
                        key={qr}
                        style={[styles.quickReplyChip, { borderColor: activeConv.color }]}
                        onPress={() => setReplyText(qr)}
                        activeOpacity={0.7}
                      >
                        <Text style={[styles.quickReplyText, { color: activeConv.color }]}>{qr}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>

                {/* Reply Bar */}
                <View style={styles.replyBar}>
                  <TouchableOpacity
                    style={styles.emojiBtn}
                    onPress={() => setShowEmojiPicker(prev => !prev)}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={showEmojiPicker ? 'happy' : 'happy-outline'}
                      size={24}
                      color={showEmojiPicker ? activeConv.color : '#9AAABB'}
                    />
                  </TouchableOpacity>
                  <View style={styles.replyInputBox}>
                    <TextInput
                      value={replyText}
                      onChangeText={setReplyText}
                      placeholder="Type a reply…"
                      placeholderTextColor="#9AAABB"
                      style={styles.replyInput}
                      multiline
                      maxLength={500}
                    />
                  </View>
                  <TouchableOpacity
                    style={[
                      styles.sendBtn,
                      { backgroundColor: replyText.trim() ? activeConv.color : '#E2E8F0' },
                    ]}
                    onPress={sendReply}
                    disabled={!replyText.trim()}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="send" size={18} color={replyText.trim() ? '#fff' : '#9AAABB'} />
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(235,242,255,0.55)',
    paddingTop: 58,
  },

  /* ── List screen header ── */
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#24364B',
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ffffff',
    marginTop: 2,
  },
  unreadBubble: {
    backgroundColor: '#9B8DEF',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 7,
    marginTop: 4,
  },
  unreadBubbleText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#fff',
  },

  /* ── Search ── */
  searchBox: {
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.95)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 10,
    marginHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#24364B',
  },

  /* ── Filter tabs ── */
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 14,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterTabActive: {
    backgroundColor: '#24364B',
    borderColor: '#24364B',
  },
  filterTabText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#738295',
  },
  filterTabTextActive: { color: '#fff' },
  filterBadge: {
    backgroundColor: '#9B8DEF',
    borderRadius: 8,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  filterBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#fff',
  },

  /* ── Conversation list ── */
  list: {
    paddingHorizontal: 16,
    paddingBottom: 110,
    gap: 10,
  },
  emptyBox: {
    alignItems: 'center',
    paddingTop: 60,
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#C8D5E2',
  },

  /* ── Conversation card ── */
  convCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.97)',
    borderRadius: 20,
    padding: 14,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  convCardUnread: {
    borderWidth: 1,
    borderColor: 'rgba(155,141,239,0.25)',
    backgroundColor: '#fff',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  avatarText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#fff',
  },
  onlineDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#F09A3E',
    borderWidth: 2,
    borderColor: '#fff',
  },
  convContent: { flex: 1 },
  convTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  convName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#24364B',
  },
  convNameBold: { fontWeight: '800' },
  convTime: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9AAABB',
  },
  convBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  petTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#F4F7FB',
    borderRadius: 7,
    paddingHorizontal: 6,
    paddingVertical: 2,
    flexShrink: 0,
  },
  petTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9AAABB',
  },
  convPreview: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: '#9AAABB',
  },
  convPreviewBold: {
    fontWeight: '700',
    color: '#738295',
  },
  unreadDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadDotText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#fff',
  },

  /* ── Chat modal shell ── */
  chatModal: {
    flex: 1,
    backgroundColor: '#EDF1F8',
  },
  chatAccentBar: {
    height: 4,
    width: '100%',
  },

  /* ── Chat header ── */
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingTop: 52,
    paddingHorizontal: 14,
    paddingBottom: 14,
    backgroundColor: '#fff',
  },
  chatBackBtn: {
    width: 38,
    height: 38,
    borderRadius: 13,
    backgroundColor: '#F4F7FB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatAvatar: {
    width: 46,
    height: 46,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatAvatarText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#fff',
  },
  chatHeaderInfo: { flex: 1 },
  chatHeaderName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#24364B',
  },
  chatStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  activeDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#7DBE8A',
    marginRight: 5,
  },
  chatStatusText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#7DBE8A',
  },
  chatDotSep: {
    fontSize: 11,
    color: '#C8D5E2',
    marginHorizontal: 3,
  },
  chatPetLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9AAABB',
  },
  chatActionBtn: {
    width: 38,
    height: 38,
    borderRadius: 13,
    backgroundColor: '#F4F7FB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatHeaderDivider: {
    height: 1,
    backgroundColor: '#EAEEF4',
  },

  /* ── Messages ── */
  chatScroll: { flex: 1 },
  chatScrollContent: {
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 16,
  },
  dateSep: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    gap: 10,
  },
  dateSepLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#D4DCE8',
  },
  dateSepChip: {
    backgroundColor: '#D4DCE8',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  dateSepText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7C93',
  },

  /* ── Bubbles ── */
  bubbleRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  bubbleRowLeft:  { justifyContent: 'flex-start' },
  bubbleRowRight: { justifyContent: 'flex-end' },
  bubbleAvatar: {
    width: 30,
    height: 30,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  bubbleAvatarText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#fff',
  },
  bubbleAvatarSpacer: { width: 30 },
  bubble: {
    maxWidth: '74%',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  bubbleSec: {
    borderBottomRightRadius: 5,
  },
  bubbleOwner: {
    borderBottomLeftRadius: 5,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  bubbleText: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  bubbleFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 5,
    gap: 1,
  },
  bubbleTime: {
    fontSize: 10,
    fontWeight: '600',
  },

  /* ── Emoji picker ── */
  emojiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#EAEEF4',
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 4,
  },
  emojiItem: {
    width: '13%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#F4F7FB',
  },
  emojiChar: {
    fontSize: 22,
  },

  /* ── Quick replies ── */
  quickReplyBar: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#EAEEF4',
    paddingVertical: 10,
  },
  quickReplyContent: {
    paddingHorizontal: 14,
    gap: 8,
  },
  quickReplyChip: {
    borderWidth: 1.5,
    borderRadius: 20,
    paddingHorizontal: 13,
    paddingVertical: 6,
  },
  quickReplyText: {
    fontSize: 12,
    fontWeight: '700',
  },

  /* ── Reply bar ── */
  replyBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 30 : 14,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#EAEEF4',
  },
  emojiBtn: {
    width: 42,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  replyInputBox: {
    flex: 1,
    backgroundColor: '#F4F7FB',
    borderRadius: 22,
    paddingHorizontal: 14,
    paddingVertical: 10,
    minHeight: 46,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  replyInput: {
    fontSize: 14,
    fontWeight: '500',
    color: '#24364B',
    maxHeight: 100,
  },
  sendBtn: {
    width: 46,
    height: 46,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
