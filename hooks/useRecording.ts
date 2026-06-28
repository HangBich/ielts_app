// hooks/useRecording.ts
import { Audio } from 'expo-av';
import { useState, useRef, useEffect } from 'react';
import * as FileSystem from 'expo-file-system';

interface RecordingState {
  isRecording: boolean;
  isPaused: boolean;
  duration: number;
  uri: string | null;
  error: string | null;
}

interface UseRecordingReturn extends RecordingState {
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<void>;
  playRecording: () => Promise<void>;
  isPlaying: boolean;
  stopPlayback: () => Promise<void>;
  deleteRecording: () => Promise<void>;
}

export const useRecording = (): UseRecordingReturn => {
  const [state, setState] = useState<RecordingState>({
    isRecording: false,
    isPaused: false,
    duration: 0,
    uri: null,
    error: null,
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const recordingRef = useRef<Audio.Recording | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Setup audio permissions on mount
  useEffect(() => {
    const setupAudio = async () => {
      try {
        await Audio.requestPermissionsAsync();
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
          playsInSilentModeIOS: true,
          interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });
      } catch (err) {
        setState((prev) => ({
          ...prev,
          error: 'Failed to setup audio permissions',
        }));
      }
    };

    setupAudio();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      setState((prev) => ({ ...prev, error: null }));

      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      await recording.startAsync();

      recordingRef.current = recording;

      setState((prev) => ({
        ...prev,
        isRecording: true,
        duration: 0,
      }));

      // Track duration
      intervalRef.current = setInterval(async () => {
        const status = await recording.getStatusAsync();
        setState((prev) => ({
          ...prev,
          duration: Math.floor(status.durationMillis / 1000),
        }));
      }, 100);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Recording failed';
      setState((prev) => ({
        ...prev,
        error: errorMsg,
        isRecording: false,
      }));
    }
  };

  const stopRecording = async () => {
    try {
      if (!recordingRef.current) return;

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      await recordingRef.current.stopAndUnloadAsync();
      const uri = recordingRef.current.getURI();

      setState((prev) => ({
        ...prev,
        isRecording: false,
        uri: uri || null,
      }));

      recordingRef.current = null;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Stop failed';
      setState((prev) => ({
        ...prev,
        error: errorMsg,
      }));
    }
  };

  const playRecording = async () => {
    try {
      if (!state.uri) {
        setState((prev) => ({
          ...prev,
          error: 'No recording available',
        }));
        return;
      }

      // Unload previous sound if exists
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
      }

      const { sound } = await Audio.Sound.createAsync({ uri: state.uri });
      soundRef.current = sound;

      setIsPlaying(true);

      sound.setOnPlaybackStatusUpdate((playbackStatus) => {
        if (playbackStatus.isLoaded && playbackStatus.didJustFinish) {
          setIsPlaying(false);
        }
      });

      await sound.playAsync();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Playback failed';
      setState((prev) => ({
        ...prev,
        error: errorMsg,
      }));
      setIsPlaying(false);
    }
  };

  const stopPlayback = async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.stopAsync();
      }
      setIsPlaying(false);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Stop failed';
      setState((prev) => ({
        ...prev,
        error: errorMsg,
      }));
    }
  };

  const deleteRecording = async () => {
    try {
      if (state.uri) {
        await FileSystem.deleteAsync(state.uri, { idempotent: true });
      }

      if (soundRef.current) {
        await soundRef.current.unloadAsync();
      }

      setState((prev) => ({
        ...prev,
        uri: null,
        duration: 0,
        error: null,
      }));
      setIsPlaying(false);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Delete failed';
      setState((prev) => ({
        ...prev,
        error: errorMsg,
      }));
    }
  };

  return {
    ...state,
    startRecording,
    stopRecording,
    playRecording,
    isPlaying,
    stopPlayback,
    deleteRecording,
  };
};
