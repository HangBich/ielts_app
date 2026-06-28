// App.tsx
import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  Alert,
  TextInput as RNTextInput,
  TouchableOpacity,
} from 'react-native';
import { EssayScreen } from './screens/EssayScreen';
import { Button, TextInput, appColors } from './components/UIComponents';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.background,
  },
  setupContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    fontSize: 28,
    fontWeight: '800',
    color: appColors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: appColors.lightText,
    marginBottom: 32,
    textAlign: 'center',
    lineHeight: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: appColors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: appColors.white,
    borderWidth: 1,
    borderColor: appColors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: appColors.text,
  },
  infoBox: {
    backgroundColor: '#EFF6FF',
    borderLeftWidth: 4,
    borderLeftColor: appColors.primary,
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 13,
    color: appColors.text,
    lineHeight: 18,
  },
});

export default function App() {
  const [apiKey, setApiKey] = useState<string>('');
  const [topic, setTopic] = useState<string>('');
  const [isSetup, setIsSetup] = useState(false);

  const handleStartEssay = () => {
    if (!apiKey.trim()) {
      Alert.alert('Error', 'Please enter your Claude API key');
      return;
    }

    if (!topic.trim()) {
      Alert.alert('Error', 'Please enter an IELTS essay topic');
      return;
    }

    setIsSetup(true);
  };

  const handleReset = () => {
    setIsSetup(false);
    setApiKey('');
    setTopic('');
  };

  // Setup Screen
  if (!isSetup) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.setupContainer}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.header}>📚 IELTS Writing Coach</Text>
          <Text style={styles.subtitle}>
            Master Band 8.5+ essays through guided practice with AI linguistic analysis
          </Text>

          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              💡 <Text style={{ fontWeight: '600' }}>How it works:</Text>
              {'\n'}1. Generate band 8.5+ main idea from topic{'\n'}2. Analyze X-bar
              structure & semantics{'\n'}3. Write your rough support ideas{'\n'}4. AI
              upgrades to band 8.5 with academic vocabulary{'\n'}5. Record & playback each
              sentence{'\n'}6. Export polished essay
            </Text>
          </View>

          {/* API Key Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>🔑 Claude API Key</Text>
            <RNTextInput
              style={styles.input}
              placeholder="sk-ant-..."
              value={apiKey}
              onChangeText={setApiKey}
              secureTextEntry={!apiKey.includes('sk-ant-')}
              placeholderTextColor={appColors.lightText}
            />
            <Text
              style={{
                fontSize: 12,
                color: appColors.lightText,
                marginTop: 8,
              }}
            >
              Get your key at console.anthropic.com
            </Text>
          </View>

          {/* Essay Topic Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>📝 IELTS Essay Topic</Text>
            <RNTextInput
              style={[styles.input, { minHeight: 80, textAlignVertical: 'top' }]}
              placeholder={`Example: "Some people believe that technology has made communication easier, while others argue it has reduced genuine human connection. Discuss both views and give your opinion."`}
              value={topic}
              onChangeText={setTopic}
              multiline
              maxLength={500}
              placeholderTextColor={appColors.lightText}
            />
            <Text
              style={{
                fontSize: 12,
                color: appColors.lightText,
                marginTop: 8,
              }}
            >
              {topic.length}/500
            </Text>
          </View>

          {/* Start Button */}
          <Button
            title="🚀 Start Writing"
            onPress={handleStartEssay}
            style={{ marginTop: 8 }}
          />

          {/* Sample Topics */}
          <View
            style={{
              marginTop: 24,
              paddingTop: 20,
              borderTopWidth: 1,
              borderTopColor: appColors.border,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: '600',
                color: appColors.lightText,
                marginBottom: 12,
              }}
            >
              Sample Topics (tap to use):
            </Text>

            {[
              'Modern technology is destroying traditional cultures. To what extent do you agree?',
              'Universities should be free for all students. Do you agree or disagree?',
              'Environmental protection should be prioritized over economic growth. Discuss.',
            ].map((sampleTopic, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={() => setTopic(sampleTopic)}
                style={{
                  backgroundColor: appColors.white,
                  borderWidth: 1,
                  borderColor: appColors.border,
                  padding: 12,
                  borderRadius: 8,
                  marginBottom: 8,
                }}
              >
                <Text style={{ fontSize: 12, color: appColors.text }}>
                  {sampleTopic}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Essay Screen
  return (
    <View style={{ flex: 1 }}>
      <EssayScreen apiKey={apiKey} topic={topic} />
      <TouchableOpacity
        onPress={handleReset}
        style={{
          position: 'absolute',
          top: 10,
          right: 16,
          backgroundColor: appColors.white,
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderRadius: 6,
          borderWidth: 1,
          borderColor: appColors.border,
          zIndex: 100,
        }}
      >
        <Text style={{ fontSize: 12, color: appColors.lightText }}>← Back</Text>
      </TouchableOpacity>
    </View>
  );
}
