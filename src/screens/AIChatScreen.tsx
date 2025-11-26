/**
 * AI Coach Chat Screen
 * Features:
 * - Chat bubble UI (CRED style)
 * - Suggested prompts
 * - Sticky input
 * - User context sidebar
 * - Scrolling history
 * - Responses as cards/metrics/actionable options
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  type?: 'text' | 'card' | 'metrics' | 'action';
}

const AIChatScreen = ({ navigation }: any) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hi! I\'m your AI Financial Coach. I can help you with budgeting, savings goals, investment advice, and more. What would you like to know?',
      timestamp: new Date(),
      type: 'text',
    },
  ]);

  const [inputText, setInputText] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  const suggestedPrompts = [
    'How can I save more?',
    'Analyze my spending',
    'Investment tips',
    'Budget optimization',
    'Goal planning',
    'Debt management',
  ];

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: String(messages.length + 1),
      role: 'user',
      content: inputText,
      timestamp: new Date(),
      type: 'text',
    };

    setMessages([...messages, userMessage]);
    setInputText('');

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: String(messages.length + 2),
        role: 'assistant',
        content: generateAIResponse(inputText),
        timestamp: new Date(),
        type: 'card',
      };
      setMessages((prev) => [...prev, assistantMessage]);
    }, 500);
  };

  const generateAIResponse = (userInput: string): string => {
    const responses: { [key: string]: string } = {
      'save': 'Based on your spending patterns, here are ways to save more:\n\n1. Reduce food spending by 10% - Save ₹850/month\n2. Use public transport - Save ₹400/month\n3. Cancel unused subscriptions - Save ₹500/month\n\nTotal potential savings: ₹1,750/month',
      'spending': 'Your spending analysis:\n\n• Food: ₹8,500 (35%)\n• Shopping: ₹9,400 (38%)\n• Transport: ₹3,200 (13%)\n• Entertainment: ₹2,100 (9%)\n• Utilities: ₹1,200 (5%)\n\nYour highest spending category is Shopping.',
      'investment': 'Investment recommendations based on your profile:\n\n• Emergency Fund: ₹100,000 (Priority)\n• Equity Mutual Funds: 60%\n• Bonds: 30%\n• Gold: 10%\n\nConsider starting with ₹5,000/month SIP.',
      'budget': 'Optimized budget for you:\n\n• Income: ₹45,000\n• Essential: ₹18,000 (40%)\n• Savings: ₹13,500 (30%)\n• Discretionary: ₹13,500 (30%)\n\nThis follows the 40-30-30 rule.',
      'goal': 'Goal planning tips:\n\n1. Set SMART goals (Specific, Measurable, Achievable, Relevant, Time-bound)\n2. Break large goals into smaller milestones\n3. Automate savings for each goal\n4. Review quarterly\n\nYour current goals are on track!',
      'debt': 'Debt management strategy:\n\n1. List all debts with interest rates\n2. Use avalanche method (highest interest first)\n3. Negotiate lower rates\n4. Consider consolidation\n\nYou currently have no outstanding debts.',
    };

    for (const [key, response] of Object.entries(responses)) {
      if (userInput.toLowerCase().includes(key)) {
        return response;
      }
    }

    return 'That\'s a great question! Based on your financial profile, I recommend reviewing your spending patterns and setting clear financial goals. Would you like me to analyze a specific area?';
  };

  const handleSuggestedPrompt = (prompt: string) => {
    setInputText(prompt);
  };

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>AI Coach</Text>
          <Text style={styles.subtitle}>Your financial advisor</Text>
        </View>
        <Ionicons name="sparkles" size={24} color={colors.primary} />
      </View>

      {/* Chat Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.length === 1 && (
          <View style={styles.suggestedPromptsContainer}>
            <Text style={styles.suggestedTitle}>Suggested Topics</Text>
            <View style={styles.promptsGrid}>
              {suggestedPrompts.map((prompt, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.promptButton}
                  onPress={() => handleSuggestedPrompt(prompt)}
                >
                  <Text style={styles.promptText}>{prompt}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageBubble,
              message.role === 'user' ? styles.userBubble : styles.assistantBubble,
            ]}
          >
            {message.role === 'assistant' && (
              <View style={styles.assistantIcon}>
                <Ionicons name="sparkles" size={16} color={colors.white} />
              </View>
            )}

            <View
              style={[
                styles.bubble,
                message.role === 'user' ? styles.userBubbleStyle : styles.assistantBubbleStyle,
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  message.role === 'user' && styles.userMessageText,
                ]}
              >
                {message.content}
              </Text>

              {message.role === 'assistant' && message.type === 'card' && (
                <View style={styles.actionContainer}>
                  <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionButtonText}>View Details</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.actionButton, styles.actionButtonSecondary]}>
                    <Text style={styles.actionButtonTextSecondary}>Save</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {message.role === 'user' && (
              <View style={styles.userIcon}>
                <Ionicons name="person-circle" size={24} color={colors.primary} />
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Ask me anything about your finances..."
            placeholderTextColor={colors.textSecondary}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxHeight={100}
          />
          <TouchableOpacity
            style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
            onPress={handleSendMessage}
            disabled={!inputText.trim()}
          >
            <Ionicons name="send" size={20} color={colors.white} />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.white,
  },
  title: {
    ...typography.h2,
    color: colors.text,
  },
  subtitle: {
    ...typography.small,
    color: colors.textSecondary,
    marginTop: 4,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  suggestedPromptsContainer: {
    marginVertical: 24,
  },
  suggestedTitle: {
    ...typography.h4,
    color: colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  promptsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  promptButton: {
    backgroundColor: colors.white,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    margin: 6,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  promptText: {
    ...typography.small,
    color: colors.primary,
  },
  messageBubble: {
    flexDirection: 'row',
    marginVertical: 8,
    alignItems: 'flex-end',
  },
  userBubble: {
    justifyContent: 'flex-end',
  },
  assistantBubble: {
    justifyContent: 'flex-start',
  },
  assistantIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  userIcon: {
    marginLeft: 8,
  },
  bubble: {
    maxWidth: '80%',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 16,
  },
  userBubbleStyle: {
    backgroundColor: colors.primary,
  },
  assistantBubbleStyle: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.background,
  },
  messageText: {
    ...typography.small,
    color: colors.text,
    lineHeight: 20,
  },
  userMessageText: {
    color: colors.white,
  },
  actionContainer: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: colors.primary,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonSecondary: {
    backgroundColor: colors.background,
  },
  actionButtonText: {
    ...typography.caption,
    color: colors.white,
    fontWeight: '600',
  },
  actionButtonTextSecondary: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '600',
  },
  inputContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.white,
    backgroundColor: colors.background,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: colors.white,
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: colors.text,
    ...typography.body,
    maxHeight: 100,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});

export default AIChatScreen;
