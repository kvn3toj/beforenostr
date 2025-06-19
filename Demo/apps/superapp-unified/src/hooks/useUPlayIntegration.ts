import { useCallback, useEffect, useState } from 'react';
import { useStudyRooms, useStudyRoom } from './useStudyRooms';
import { useAnalytics, useEngagementTracking } from './useAnalytics';
import { useChallenges, useChallengeActions } from './useChallenges';
import { useSocial, useSocialActions } from './useSocial';

// 🎮 TIPOS PARA INTEGRACIÓN ÜPLAY
export interface UPlaySession {
  videoId: string;
  startTime: Date;
  totalTime: number;
  isInStudyRoom?: boolean;
  studyRoomId?: string;
  challengeId?: string;
  isCompleted: boolean;
}

export interface UPlayContext {
  currentVideo?: string;
  currentPlaylist?: string;
  studyRoom?: string;
  activeChallenge?: string;
  socialPost?: string;
}

// 🪝 HOOK PRINCIPAL: useUPlayIntegration
export const useUPlayIntegration = () => {
  const [currentSession, setCurrentSession] = useState<UPlaySession | null>(null);
  const [context, setContext] = useState<UPlayContext>({});

  // Hooks de funcionalidades
  const { rooms, createRoom, joinRoom, syncRoom, isJoining } = useStudyRooms();
  const { recordEvent, trackVideoView, trackVideoComplete, trackPlaylistView } = useEngagementTracking();
  const { challenges, myChallenges, joinChallenge, updateProgress, completeChallenge } = useChallenges();
  const { createPublication, toggleLike } = useSocialActions();
  const { dashboardMetrics, systemHealth } = useAnalytics();

  // 🎬 FUNCIONES DE VIDEO TRACKING
  const startVideoSession = useCallback((videoId: string, playlistId?: string, studyRoomId?: string) => {
    const session: UPlaySession = {
      videoId,
      startTime: new Date(),
      totalTime: 0,
      isInStudyRoom: !!studyRoomId,
      studyRoomId,
      isCompleted: false,
    };

    setCurrentSession(session);
    setContext(prev => ({
      ...prev,
      currentVideo: videoId,
      currentPlaylist: playlistId,
      studyRoom: studyRoomId,
    }));

    // Track analytics
    trackVideoView(videoId);
    if (playlistId) {
      trackPlaylistView(playlistId);
    }

    // Buscar challenges relacionados con este video
    const relatedChallenge = challenges.find(challenge => 
      challenge.requirements?.videoIds?.includes(videoId) ||
      challenge.requirements?.playlistIds?.includes(playlistId)
    );

    if (relatedChallenge) {
      setContext(prev => ({ ...prev, activeChallenge: relatedChallenge.id }));
    }
  }, [challenges, trackVideoView, trackPlaylistView]);

  const endVideoSession = useCallback((completed: boolean = false) => {
    if (!currentSession) return;

    const duration = Math.floor((Date.now() - currentSession.startTime.getTime()) / 1000);
    
    // Track completion
    if (completed) {
      trackVideoComplete(currentSession.videoId, duration);
    }

    // Update challenge progress if applicable
    if (context.activeChallenge && completed) {
      const challenge = challenges.find(c => c.id === context.activeChallenge);
      if (challenge) {
        updateProgress({
          challengeId: challenge.id,
          progressData: {
            challengeId: challenge.id,
            progress: 100, // Video completed
            metadata: {
              videoId: currentSession.videoId,
              duration,
              completedAt: new Date().toISOString(),
            }
          }
        });
      }
    }

    // Reset session
    setCurrentSession(null);
    setContext(prev => ({
      ...prev,
      currentVideo: undefined,
      activeChallenge: undefined,
    }));
  }, [currentSession, context.activeChallenge, challenges, trackVideoComplete, updateProgress]);

  // 🎪 FUNCIONES DE STUDY ROOMS
  const createVideoRoom = useCallback(async (videoId: string, roomName: string, description?: string) => {
    try {
      return new Promise((resolve, reject) => {
        createRoom({
          name: roomName,
          description,
          videoId,
          maxParticipants: 10,
        });
        
        // Note: Since createRoom is a mutation, we'll handle the social post separately
        // TODO: Implement proper async handling with mutation callbacks
        
        // For now, create the social post independently
        createPublication({
          content: `¡Creé una sala de estudio para ver "${roomName}" juntos! 🎪 ¿Te unes?`,
          type: 'text',
          metadata: {
            videoId,
            type: 'study_room_created'
          },
          visibility: 'public',
        });
        
        resolve({ success: true });
      });
    } catch (error) {
      console.error('Error creating video room:', error);
      throw error;
    }
  }, [createRoom, createPublication]);

  const joinVideoRoom = useCallback(async (roomId: string) => {
    try {
      return new Promise((resolve, reject) => {
        joinRoom(roomId);
        
        // Note: Since joinRoom is a mutation, we can't directly access the room data
        // The video session will be started when the room data is available
        // TODO: Implement proper async handling with mutation callbacks
        
        resolve({ success: true });
      });
    } catch (error) {
      console.error('Error joining video room:', error);
      throw error;
    }
  }, [joinRoom]);

  // 🎯 FUNCIONES DE CHALLENGES
  const startVideoChallenge = useCallback(async (challengeId: string) => {
    try {
      const userChallenge = await joinChallenge(challengeId);
      
      setContext(prev => ({
        ...prev,
        activeChallenge: challengeId,
      }));

      // Create social post about joining challenge
      const challenge = challenges.find(c => c.id === challengeId);
      if (challenge) {
        createPublication({
          content: `¡Acepto el desafío "${challenge.title}"! 🎯 Vamos a ver qué tal lo hago.`,
          type: 'text',
          metadata: {
            challengeId,
            type: 'challenge_joined'
          },
          visibility: 'public',
        });
      }

      return userChallenge;
    } catch (error) {
      console.error('Error starting challenge:', error);
      throw error;
    }
  }, [joinChallenge, challenges, createPublication]);

  const completeVideoChallenge = useCallback(async (challengeId: string, metadata?: Record<string, any>) => {
    try {
      const result = await completeChallenge(challengeId);
      
      // Create celebration post
      const challenge = challenges.find(c => c.id === challengeId);
      if (challenge) {
        createPublication({
          content: `¡Completé el desafío "${challenge.title}"! 🏆 +${challenge.merits} mëritos ganados!`,
          type: 'text',
          metadata: {
            challengeId,
            meritsEarned: challenge.merits,
            type: 'challenge_completed',
            ...metadata
          },
          visibility: 'public',
        });
      }

      setContext(prev => ({
        ...prev,
        activeChallenge: undefined,
      }));

      return result;
    } catch (error) {
      console.error('Error completing challenge:', error);
      throw error;
    }
  }, [completeChallenge, challenges, createPublication]);

  // 🤝 FUNCIONES SOCIALES
  const shareVideoExperience = useCallback(async (videoId: string, rating: number, comment: string) => {
    try {
      const publication = await createPublication({
        content: `Acabo de ver un video increíble! ⭐${rating}/5\n\n${comment}`,
        type: 'text',
        metadata: {
          videoId,
          rating,
          type: 'video_review'
        },
        visibility: 'public',
      });

      // Track analytics
      recordEvent({
        eventType: 'video_shared',
        contentId: videoId,
        contentType: 'video',
        metadata: { rating, hasComment: comment.length > 0 }
      });

      return publication;
    } catch (error) {
      console.error('Error sharing video experience:', error);
      throw error;
    }
  }, [createPublication, recordEvent]);

  // 📊 FUNCIONES DE ANALYTICS AVANZADAS
  const getUPlayInsights = useCallback(() => {
    const myActiveChallenges = myChallenges.filter(uc => uc.status === 'in_progress');
    const myCompletedChallenges = myChallenges.filter(uc => uc.status === 'completed');
    const availableRooms = rooms.filter(room => room.isActive);

    return {
      session: currentSession,
      context,
      challenges: {
        active: myActiveChallenges.length,
        completed: myCompletedChallenges.length,
        available: challenges.filter(c => c.isActive).length,
      },
      studyRooms: {
        available: availableRooms.length,
        participating: availableRooms.filter(room => 
          room.participants?.some(p => p.userId === 'current-user') // TODO: get from auth
        ).length,
      },
      analytics: {
        systemHealth: systemHealth?.status || 'unknown',
        totalUsers: dashboardMetrics?.totalUsers || 0,
        engagement: dashboardMetrics?.engagement || null,
      }
    };
  }, [currentSession, context, myChallenges, challenges, rooms, systemHealth, dashboardMetrics]);

  // 🔄 AUTO-SYNC PARA STUDY ROOMS
  useEffect(() => {
    if (currentSession?.isInStudyRoom && currentSession.studyRoomId && currentSession.totalTime > 0) {
      const interval = setInterval(() => {
        syncRoom({
          roomId: currentSession.studyRoomId!,
          syncData: {
            currentTime: currentSession.totalTime,
            isPaused: false, // TODO: get from video player state
          }
        });
      }, 10000); // Sync every 10 seconds

      return () => clearInterval(interval);
    }
  }, [currentSession, syncRoom]);

  return {
    // Session Management
    currentSession,
    context,
    startVideoSession,
    endVideoSession,

    // Study Rooms
    availableRooms: rooms,
    createVideoRoom,
    joinVideoRoom,
    isJoiningRoom: isJoining,

    // Challenges
    availableChallenges: challenges.filter(c => c.isActive),
    myChallenges,
    startVideoChallenge,
    completeVideoChallenge,

    // Social
    shareVideoExperience,
    toggleLike,

    // Analytics & Insights
    getUPlayInsights,
    dashboardMetrics,
    systemHealth,

    // Utilities
    recordEvent,
  };
};

// 🪝 HOOK DE UTILIDAD: useUPlayAutoTracking
export const useUPlayAutoTracking = (videoId?: string, playlistId?: string) => {
  const { startVideoSession, endVideoSession, recordEvent } = useUPlayIntegration();

  useEffect(() => {
    if (videoId) {
      startVideoSession(videoId, playlistId);
      
      return () => {
        endVideoSession(false); // Not completed if component unmounts
      };
    }
  }, [videoId, playlistId, startVideoSession, endVideoSession]);

  const markAsCompleted = useCallback(() => {
    endVideoSession(true);
  }, [endVideoSession]);

  const trackInteraction = useCallback((interactionType: string, metadata?: Record<string, any>) => {
    if (videoId) {
      recordEvent({
        eventType: interactionType,
        contentId: videoId,
        contentType: 'video',
        metadata,
      });
    }
  }, [videoId, recordEvent]);

  return {
    markAsCompleted,
    trackInteraction,
  };
};