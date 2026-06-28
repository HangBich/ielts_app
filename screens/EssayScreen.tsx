// screens/EssayScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRecording } from '../hooks/useRecording';
import { ClaudeService } from '../services/claudeAPI';
import {
  RecordButton,
  PlaybackButton,
  TextInput,
  Card,
  SectionHeader,
  Button,
  appColors,
} from '../components/UIComponents';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.background,
  },
  content: {
    padding: 16,
  },
  sampleSentence: {
    backgroundColor: '#EFF6FF',
    borderLeftWidth: 4,
    borderLeftColor: appColors.primary,
    padding: 12,
    borderRadius: 6,
    marginBottom: 12,
  },
  sampleText: {
    fontSize: 15,
    color: appColors.text,
    lineHeight: 22,
    marginBottom: 8,
  },
  analysisBox: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: appColors.success,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  analysisText: {
    fontSize: 13,
    color: appColors.text,
    lineHeight: 18,
  },
  controlsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  errorBox: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: appColors.warning,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  errorText: {
    color: appColors.warning,
    fontSize: 13,
  },
  glossaryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  glossaryTag: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  glossaryTagText: {
    fontSize: 12,
    color: appColors.primary,
    fontWeight: '600',
  },
  loadingText: {
    color: appColors.lightText,
    fontSize: 14,
    marginVertical: 12,
    textAlign: 'center',
  },
  supportIdeasContainer: {
    marginTop: 16,
  },
});

interface SupportIdea {
  id: string;
  rough: string;
  upgraded?: string;
  glossary?: string[];
  recordingUri?: string;
  status: 'draft' | 'analyzing' | 'upgraded';
}

interface EssayScreenProps {
  apiKey: string;
  topic: string;
}

export const EssayScreen: React.FC<EssayScreenProps> = ({ apiKey, topic }) => {
  // ===== State Management =====
  const [step, setStep] = useState<
    'main-idea' | 'main-analysis' | 'support-input' | 'support-upgraded'
  >('main-idea');
  const [mainIdea, setMainIdea] = useState<string>('');
  const [mainAnalysis, setMainAnalysis] = useState<string>('');
  const [supportIdeas, setSupportIdeas] = useState<SupportIdea[]>([]);
  const [currentSupportId, setCurrentSupportId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [allEssayIdeas, setAllEssayIdeas] = useState<string[]>([]);

  // Voice hooks
  const mainRecording = useRecording();
  const supportRecording = useRecording();

  // Claude service
  const claudeService = new ClaudeService(apiKey);

  // ===== Initialize: Generate Main Idea =====
  useEffect(() => {
    const initializeMainIdea = async () => {
      setIsLoading(true);
      try {
        const generated = await claudeService.generateMainIdea(topic);
        setMainIdea(generated);
        setStep('main-analysis');
      } catch (err) {
        Alert.alert('Error', 'Failed to generate main idea');
      } finally {
        setIsLoading(false);
      }
    };

    initializeMainIdea();
  }, []);

  // ===== Rhythm 1: Analyze Main Idea =====
  const handleAnalyzeMainIdea = async () => {
    setIsLoading(true);
    try {
      const analysis = await claudeService.analyzeMainIdea(mainIdea);
      setMainAnalysis(analysis);
    } catch (err) {
      Alert.alert('Error', 'Failed to analyze main idea');
    } finally {
      setIsLoading(false);
    }
  };

  // ===== Rhythm 2: Handle Support Idea Input =====
  const handleStartSupportIdea = () => {
    const newId = `support-${Date.now()}`;
    setSupportIdeas((prev) => [
      ...prev,
      {
        id: newId,
        rough: '',
        status: 'draft',
      },
    ]);
    setCurrentSupportId(newId);
    setStep('support-input');
    supportRecording.deleteRecording();
  };

  const handleSupportTextChange = (text: string) => {
    setSupportIdeas((prev) =>
      prev.map((idea) =>
        idea.id === currentSupportId ? { ...idea, rough: text } : idea
      )
    );
  };

  // ===== Upgrade Support Idea =====
  const handleUpgradeSupportIdea = async () => {
    const current = supportIdeas.find((s) => s.id === currentSupportId);
    if (!current || !current.rough.trim()) {
      Alert.alert('Info', 'Please enter your support idea first');
      return;
    }

    setSupportIdeas((prev) =>
      prev.map((idea) =>
        idea.id === currentSupportId
          ? { ...idea, status: 'analyzing' }
          : idea
      )
    );

    try {
      const { upgraded, glossary } = await claudeService.upgradeToB85(
        current.rough,
        mainIdea,
        topic
      );

      setSupportIdeas((prev) =>
        prev.map((idea) =>
          idea.id === currentSupportId
            ? {
                ...idea,
                upgraded,
                glossary,
                status: 'upgraded',
              }
            : idea
        )
      );

      setStep('support-upgraded');
    } catch (err) {
      Alert.alert('Error', 'Failed to upgrade support idea');
      setSupportIdeas((prev) =>
        prev.map((idea) =>
          idea.id === currentSupportId
            ? { ...idea, status: 'draft' }
            : idea
        )
      );
    }
  };

  // ===== Voice Handlers =====
  const handleRecordSupport = async () => {
    if (supportRecording.isRecording) {
      await supportRecording.stopRecording();
    } else {
      await supportRecording.startRecording();
    }
  };

  const handlePlaySupport = async () => {
    if (supportRecording.isPlaying) {
      await supportRecording.stopPlayback();
    } else {
      await supportRecording.playRecording();
    }
  };

  const handleRecordMain = async () => {
    if (mainRecording.isRecording) {
      await mainRecording.stopRecording();
    } else {
      await mainRecording.startRecording();
    }
  };

  const handlePlayMain = async () => {
    if (mainRecording.isPlaying) {
      await mainRecording.stopPlayback();
    } else {
      await mainRecording.playRecording();
    }
  };

  // ===== Continue to Next Support Idea =====
  const handleContinueSupport = () => {
    const current = supportIdeas.find((s) => s.id === currentSupportId);
    if (current?.upgraded) {
      setAllEssayIdeas((prev) => [...prev, current.upgraded]);
    }
    handleStartSupportIdea();
  };

  // ===== Export Essay =====
  const handleExportEssay = async () => {
    setIsLoading(true);
    try {
      const finalIdeas = supportIdeas
        .filter((s) => s.upgraded)
        .map((s) => s.upgraded || '');

      const essayContent = await claudeService.exportEssay(
        topic,
        [mainIdea],
        [finalIdeas]
      );

      Alert.alert('Success!', `Essay exported:\n\n${essayContent.substring(0, 200)}...`, [
        { text: 'OK' },
      ]);
    } catch (err) {
      Alert.alert('Error', 'Failed to export essay');
    } finally {
      setIsLoading(false);
    }
  };

  const currentSupport = supportIdeas.find((s) => s.id === currentSupportId);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* ===== MAIN IDEA SECTION ===== */}
        <SectionHeader
          title="📌 Body 1 - Main Idea"
          subtitle="Band 8.5+ thesis statement"
        />

        {isLoading && !mainIdea ? (
          <Text style={styles.loadingText}>Generating main idea...</Text>
        ) : (
          <Card>
            <View style={styles.sampleSentence}>
              <Text style={styles.sampleText}>{mainIdea}</Text>
            </View>

            {/* Main Idea Controls */}
            <View style={styles.controlsRow}>
              <RecordButton
                isRecording={mainRecording.isRecording}
                onPress={handleRecordMain}
                duration={mainRecording.duration}
              />
              <PlaybackButton
                isPlaying={mainRecording.isPlaying}
                hasRecording={!!mainRecording.uri}
                onPress={handlePlayMain}
                onStop={() => mainRecording.stopPlayback()}
              />
            </View>

            {mainRecording.error && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{mainRecording.error}</Text>
              </View>
            )}

            {/* Analysis Section */}
            {mainAnalysis ? (
              <View style={styles.analysisBox}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '700',
                    color: appColors.text,
                    marginBottom: 8,
                  }}
                >
                  Linguistic Analysis (X-bar + Semantics)
                </Text>
                <Text style={styles.analysisText}>{mainAnalysis}</Text>
              </View>
            ) : (
              <Button
                title="Analyze Sentence Structure"
                onPress={handleAnalyzeMainIdea}
                isLoading={isLoading}
              />
            )}
          </Card>
        )}

        {/* ===== SUPPORT IDEAS SECTION ===== */}
        <View style={styles.supportIdeasContainer}>
          <SectionHeader
            title="💡 Support Ideas"
            subtitle={`${supportIdeas.length} idea(s) added`}
          />

          {/* Current Support Idea Being Edited */}
          {currentSupport && (
            <Card>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: appColors.text,
                  marginBottom: 12,
                }}
              >
                Your Support Idea {supportIdeas.findIndex((s) => s.id === currentSupportId) + 1}
              </Text>

              {currentSupport.status === 'draft' && (
                <>
                  <TextInput
                    placeholder="Write your support idea in simple English..."
                    value={currentSupport.rough}
                    onChangeText={handleSupportTextChange}
                    maxLength={300}
                  />
                  <Text
                    style={{
                      fontSize: 12,
                      color: appColors.lightText,
                      marginTop: 8,
                    }}
                  >
                    {currentSupport.rough.length}/300
                  </Text>

                  <Button
                    title="Upgrade to Band 8.5"
                    onPress={handleUpgradeSupportIdea}
                    isLoading={isLoading}
                    style={{ marginTop: 12 }}
                  />
                </>
              )}

              {currentSupport.status === 'analyzing' && (
                <Text style={styles.loadingText}>
                  Enhancing your idea to Band 8.5...
                </Text>
              )}

              {currentSupport.status === 'upgraded' && (
                <>
                  <View style={styles.sampleSentence}>
                    <Text style={styles.sampleText}>
                      {currentSupport.upgraded}
                    </Text>
                  </View>

                  {currentSupport.glossary && currentSupport.glossary.length > 0 && (
                    <View>
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: '600',
                          color: appColors.text,
                          marginTop: 12,
                          marginBottom: 8,
                        }}
                      >
                        Academic Vocabulary:
                      </Text>
                      <View style={styles.glossaryContainer}>
                        {currentSupport.glossary.map((term, idx) => (
                          <View key={idx} style={styles.glossaryTag}>
                            <Text style={styles.glossaryTagText}>{term}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}

                  {/* Voice Recording for Upgraded Idea */}
                  <View style={[styles.controlsRow, { marginTop: 16 }]}>
                    <RecordButton
                      isRecording={supportRecording.isRecording}
                      onPress={handleRecordSupport}
                      duration={supportRecording.duration}
                    />
                    <PlaybackButton
                      isPlaying={supportRecording.isPlaying}
                      hasRecording={!!supportRecording.uri}
                      onPress={handlePlaySupport}
                      onStop={() => supportRecording.stopPlayback()}
                    />
                  </View>

                  {supportRecording.error && (
                    <View style={styles.errorBox}>
                      <Text style={styles.errorText}>
                        {supportRecording.error}
                      </Text>
                    </View>
                  )}

                  {/* Next Button */}
                  <Button
                    title="Add Next Support Idea"
                    onPress={handleContinueSupport}
                    style={{ marginTop: 12 }}
                  />

                  <Button
                    title="Export Essay"
                    onPress={handleExportEssay}
                    isLoading={isLoading}
                    style={{ marginTop: 8 }}
                  />
                </>
              )}
            </Card>
          )}

          {/* List of Completed Support Ideas */}
          {supportIdeas
            .filter((s) => s.status === 'upgraded' && s.id !== currentSupportId)
            .map((idea, idx) => (
              <Card key={idea.id}>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: '600',
                    color: appColors.success,
                    marginBottom: 8,
                  }}
                >
                  ✓ Support Idea {idx + 1} (Complete)
                </Text>
                <Text style={styles.sampleText}>{idea.upgraded}</Text>
              </Card>
            ))}

          {/* Initial Add Button */}
          {supportIdeas.length === 0 && (
            <Button
              title="➕ Add First Support Idea"
              onPress={handleStartSupportIdea}
            />
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};
