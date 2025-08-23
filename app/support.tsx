import React from 'react';
import { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Phone, Mail, MessageCircle } from 'lucide-react-native';
import { useSelector, useDispatch } from 'react-redux';
import { selectIsDark } from '@/store/themeSlice';
import ChatMessage from '@/components/support/ChatMessage';
import ChatInput from '@/components/support/ChatInput';
import { Text, Card } from '@/components/ui';
import { colors } from '@/utils/theme';
import {
  selectSupportMessages,
  addMessage,
  clearChat,
} from '@/store/supportSlice';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: Date;
}

export default function SupportScreen() {
  const isDark = useSelector(selectIsDark);
  const dispatch = useDispatch();
  const messages = useSelector(selectSupportMessages);
  
  const [activeTab, setActiveTab] = useState<'chat' | 'contact' | 'faq'>('chat');
  const flatListRef = useRef<FlatList>(null);
  
  useEffect(() => {
    if (messages.length === 0) {
      dispatch(addMessage({
        id: '1',
        sender: 'agent',
        content: 'Hello! How can I help you today?',
        timestamp: new Date().toISOString(),
      }));
    }
  }, [messages, dispatch]);
  
  useEffect(() => {
    // Scroll to bottom when messages change
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);
  
  const handleSendMessage = (text: string) => {
    // Add user message
    dispatch(addMessage({
      id: Date.now().toString(),
      sender: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    }));
    
    // Simulate agent response after a delay
    setTimeout(() => {
      const responses = [
        "I'll look into that for you right away.",
        "Thanks for reaching out. Let me check that for you.",
        "I understand your concern. Here's what we can do.",
        "That's a great question. The answer is...",
        "I'm sorry to hear that. Let me help resolve this issue."
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      dispatch(addMessage({
        id: (Date.now() + 1).toString(),
        sender: 'agent',
        content: randomResponse,
        timestamp: new Date().toISOString(),
      }));
    }, 1000);
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#F8F8F8' }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      <View style={[
        styles.header, 
        { 
          backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
          borderBottomColor: isDark ? '#333333' : '#EEEEEE' 
        }
      ]}>
        <Text variant="h3" weight="bold">Support</Text>
      </View>
      
      <View style={[
        styles.tabsContainer, 
        { 
          backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
          borderBottomColor: isDark ? '#333333' : '#EEEEEE' 
        }
      ]}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'chat' && styles.activeTab,
            activeTab === 'chat' && { borderBottomColor: colors.primary[700] }
          ]}
          onPress={() => setActiveTab('chat')}
        >
          <Text
            variant="body"
            weight="medium"
            color={activeTab === 'chat' ? 'accent' : 'secondary'}
          >
            Chat
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'contact' && styles.activeTab,
            activeTab === 'contact' && { borderBottomColor: colors.primary[700] }
          ]}
          onPress={() => setActiveTab('contact')}
        >
          <Text
            variant="body"
            weight="medium"
            color={activeTab === 'contact' ? 'accent' : 'secondary'}
          >
            Contact
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'faq' && styles.activeTab,
            activeTab === 'faq' && { borderBottomColor: colors.primary[700] }
          ]}
          onPress={() => setActiveTab('faq')}
        >
          <Text
            variant="body"
            weight="medium"
            color={activeTab === 'faq' ? 'accent' : 'secondary'}
          >
            FAQ
          </Text>
        </TouchableOpacity>
      </View>
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
        keyboardVerticalOffset={100}
      >
        {activeTab === 'chat' && (
          <>
            <FlatList
              ref={flatListRef}
              data={messages}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <ChatMessage message={item} />}
              contentContainerStyle={styles.chatList}
              showsVerticalScrollIndicator={false}
            />
            <ChatInput onSend={handleSendMessage} />
          </>
        )}
        
        {activeTab === 'contact' && (
          <FlatList
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.contactSection}
            data={[]}
            renderItem={null}
            ListHeaderComponent={
              <>
                <Card style={styles.contactCard}>
                  <View style={styles.contactItem}>
                    <View style={styles.contactIconContainer}>
                      <Phone size={20} color={colors.primary[700]} />
                    </View>
                    <View>
                      <Text variant="body-sm" color="secondary">
                        Phone
                      </Text>
                      <Text variant="body" weight="medium">
                        +1 (555) 123-4567
                      </Text>
                    </View>
                  </View>
                  
                  <View style={[styles.divider, { backgroundColor: isDark ? '#333333' : '#EEEEEE' }]} />
                  
                  <View style={styles.contactItem}>
                    <View style={styles.contactIconContainer}>
                      <Mail size={20} color={colors.primary[700]} />
                    </View>
                    <View>
                      <Text variant="body-sm" color="secondary">
                        Email
                      </Text>
                      <Text variant="body" weight="medium">
                        support@quickmart.com
                      </Text>
                    </View>
                  </View>
                  
                  <View style={[styles.divider, { backgroundColor: isDark ? '#333333' : '#EEEEEE' }]} />
                  
                  <View style={styles.contactItem}>
                    <View style={styles.contactIconContainer}>
                      <MessageCircle size={20} color={colors.primary[700]} />
                    </View>
                    <View>
                      <Text variant="body-sm" color="secondary">
                        Live Chat
                      </Text>
                      <Text variant="body" weight="medium">
                        Available 24/7
                      </Text>
                    </View>
                  </View>
                </Card>
                
                <View style={styles.officeSection}>
                  <Text variant="h4" weight="semibold" style={styles.sectionTitle}>
                    Our Office
                  </Text>
                  
                  <Card style={styles.officeCard}>
                    <Image
                      source={{ uri: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=800&auto=format&fit=crop' }}
                      style={styles.officeImage}
                    />
                    
                    <View style={styles.officeInfo}>
                      <Text variant="h4" weight="semibold">
                        QuickMart Headquarters
                      </Text>
                      <Text variant="body" color="secondary">
                        123 Commerce Street
                      </Text>
                      <Text variant="body" color="secondary">
                        San Francisco, CA 94103
                      </Text>
                      <Text variant="body-sm" color="secondary" style={styles.officeHours}>
                        Monday - Friday: 9:00 AM - 6:00 PM
                      </Text>
                    </View>
                  </Card>
                </View>
              </>
            }
          />
        )}
        
        {activeTab === 'faq' && (
          <FlatList
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.faqSection}
            data={[
              {
                id: '1',
                question: 'How do I track my order?',
                answer: 'You can track your order in real-time by going to the "My Orders" section in your profile and selecting the order you want to track.'
              },
              {
                id: '2',
                question: 'What is the delivery time?',
                answer: 'We aim to deliver all orders within 30 minutes of confirmation. Delivery times may vary based on your location and order volume.'
              },
              {
                id: '3',
                question: 'How do I cancel my order?',
                answer: 'You can cancel your order within 5 minutes of placing it by going to the order details page and selecting "Cancel Order".'
              },
              {
                id: '4',
                question: 'What payment methods do you accept?',
                answer: 'We accept all major credit cards, debit cards, digital wallets (Apple Pay, Google Pay), and cash on delivery for eligible orders.'
              },
              {
                id: '5',
                question: 'How do I return a product?',
                answer: 'If you\'re not satisfied with your purchase, you can request a return within 7 days. Contact our support team or use the "Return" option in your order details.'
              },
              {
                id: '6',
                question: 'Do you offer free delivery?',
                answer: 'Yes, we offer free standard delivery on all orders above $20. For orders below this amount, a small delivery fee may apply.'
              }
            ]}
            renderItem={({ item }) => (
              <Card style={styles.faqCard}>
                <View style={styles.faqItem}>
                  <Text variant="body" weight="semibold">
                    {item.question}
                  </Text>
                  <Text variant="body" color="secondary" style={styles.faqAnswer}>
                    {item.answer}
                  </Text>
                </View>
              </Card>
            )}
            keyExtractor={item => item.id}
            ItemSeparatorComponent={() => <View style={styles.faqSeparator} />}
          />
        )}
      </KeyboardAvoidingView>
    </View>
  );
}

const Image = ({ source, style }: { source: any; style?: any }) => (
  <img src={source.uri} style={style} />
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomWidth: 2,
  },
  content: {
    flex: 1,
  },
  chatList: {
    padding: 16,
    paddingBottom: 16,
  },
  contactSection: {
    padding: 16,
  },
  contactCard: {
    marginBottom: 24,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  contactIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF0EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  divider: {
    height: 1,
    marginLeft: 56,
  },
  officeSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  officeCard: {
    overflow: 'hidden',
  },
  officeImage: {
    width: '100%',
    height: 200,
  },
  officeInfo: {
    padding: 16,
  },
  officeHours: {
    marginTop: 8,
  },
  faqSection: {
    padding: 16,
  },
  faqCard: {
    marginBottom: 0,
  },
  faqItem: {
    padding: 16,
  },
  faqAnswer: {
    marginTop: 8,
  },
  faqSeparator: {
    height: 16,
  },
});