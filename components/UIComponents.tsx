// components/UIComponents.tsx
import React from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  TextInput as RNTextInput,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

// ===== Colors & Styles =====
const colors = {
  primary: '#2563EB',
  primaryDark: '#1E40AF',
  success: '#16A34A',
  warning: '#DC2626',
  background: '#F9FAFB',
  text: '#1F2937',
  lightText: '#6B7280',
  border: '#E5E7EB',
  white: '#FFFFFF',
};

const styles = StyleSheet.create({
  recordButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    minWidth: 120,
  },
  recordButtonActive: {
    backgroundColor: colors.warning,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  playButton: {
    backgroundColor: colors.success,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    minWidth: 100,
  },
  playButtonActive: {
    backgroundColor: colors.warning,
  },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: colors.text,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  durationText: {
    fontSize: 12,
    color: colors.lightText,
    marginTop: 4,
  },
  errorText: {
    color: colors.warning,
    fontSize: 12,
    marginTop: 4,
  },
  loadingSpinner: {
    width: 20,
    height: 20,
  },
});

// ===== Record Button =====
interface RecordButtonProps {
  isRecording: boolean;
  isLoading?: boolean;
  onPress: () => void;
  duration?: number;
}

export const RecordButton: React.FC<RecordButtonProps> = ({
  isRecording,
  isLoading = false,
  onPress,
  duration = 0,
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View>
      <TouchableOpacity
        style={[styles.recordButton, isRecording && styles.recordButtonActive]}
        onPress={onPress}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator
            color={colors.white}
            style={styles.loadingSpinner}
          />
        ) : (
          <Text style={{ fontSize: 18 }}>{isRecording ? '⏹️' : '🎤'}</Text>
        )}
        <Text style={styles.buttonText}>
          {isRecording ? 'Stop Recording' : 'Record'}
        </Text>
        {isRecording && duration > 0 && (
          <Text style={{ ...styles.buttonText, fontSize: 12 }}>
            ({formatTime(duration)})
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

// ===== Playback Button =====
interface PlaybackButtonProps {
  isPlaying: boolean;
  hasRecording: boolean;
  isLoading?: boolean;
  onPress: () => void;
  onStop?: () => void;
}

export const PlaybackButton: React.FC<PlaybackButtonProps> = ({
  isPlaying,
  hasRecording,
  isLoading = false,
  onPress,
  onStop,
}) => {
  if (!hasRecording) {
    return null;
  }

  return (
    <TouchableOpacity
      style={[styles.playButton, isPlaying && styles.playButtonActive]}
      onPress={isPlaying && onStop ? onStop : onPress}
      disabled={isLoading}
    >
      {isLoading ? (
        <ActivityIndicator
          color={colors.white}
          style={styles.loadingSpinner}
        />
      ) : (
        <Text style={{ fontSize: 18 }}>{isPlaying ? '⏹️' : '▶️'}</Text>
      )}
      <Text style={styles.buttonText}>
        {isPlaying ? 'Stop' : 'Playback'}
      </Text>
    </TouchableOpacity>
  );
};

// ===== Text Input =====
interface TextInputProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  editable?: boolean;
  multiline?: boolean;
  maxLength?: number;
}

export const TextInput: React.FC<TextInputProps> = ({
  placeholder,
  value,
  onChangeText,
  editable = true,
  multiline = true,
  maxLength,
}) => {
  return (
    <RNTextInput
      style={styles.input}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      editable={editable}
      multiline={multiline}
      maxLength={maxLength}
      placeholderTextColor={colors.lightText}
    />
  );
};

// ===== Card Container =====
interface CardProps {
  children: React.ReactNode;
  style?: any;
}

export const Card: React.FC<CardProps> = ({ children, style }) => {
  return (
    <View
      style={[
        {
          backgroundColor: colors.white,
          borderRadius: 12,
          padding: 16,
          marginBottom: 16,
          borderWidth: 1,
          borderColor: colors.border,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

// ===== Section Header =====
interface SectionHeaderProps {
  title: string;
  subtitle?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
}) => {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text
        style={{
          fontSize: 18,
          fontWeight: '700',
          color: colors.text,
          marginBottom: 4,
        }}
      >
        {title}
      </Text>
      {subtitle && (
        <Text style={{ fontSize: 14, color: colors.lightText }}>
          {subtitle}
        </Text>
      )}
    </View>
  );
};

// ===== Button =====
interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  isLoading?: boolean;
  disabled?: boolean;
  style?: any;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  isLoading = false,
  disabled = false,
  style,
}) => {
  const variantColors = {
    primary: colors.primary,
    secondary: colors.background,
    danger: colors.warning,
  };

  const variantTextColors = {
    primary: colors.white,
    secondary: colors.text,
    danger: colors.white,
  };

  return (
    <TouchableOpacity
      style={[
        {
          backgroundColor: variantColors[variant],
          paddingHorizontal: 20,
          paddingVertical: 12,
          borderRadius: 8,
          alignItems: 'center',
          justifyContent: 'center',
          opacity: disabled || isLoading ? 0.5 : 1,
        },
        style,
      ]}
      onPress={onPress}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <ActivityIndicator color={variantTextColors[variant]} />
      ) : (
        <Text
          style={{
            color: variantTextColors[variant],
            fontSize: 16,
            fontWeight: '600',
          }}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export const appColors = colors;
