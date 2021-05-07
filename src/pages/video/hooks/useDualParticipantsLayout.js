import { useCallback, useEffect, useState } from 'react';
import { useRenderVideo } from './useRenderVideo';
/**
 * Default order of video:
 *  1. video's participants first
 *  2. self on the second position
 */
export function useDualParticipantsLayout(
  zmClient,
  mediaStream,
  isVideoDecodeReady,
  videoRefMain,
  videoRefSmall
) {
  const [visibleParticipants, setVisibleParticipants] = useState([]);
  const [subscribedVideos, setSubscribedVideos] = useState([]);
  const [currentUser, setcurrentUser] = useState(null);

  const onParticipantsChange = useCallback(() => {
    const participants = zmClient.getAllUser();
    const currentUser = zmClient.getCurrentUserInfo();
    setcurrentUser(currentUser);
    if (currentUser && participants.length > 0) {
      let pageParticipants = participants.slice(0, 2);
      setVisibleParticipants(pageParticipants);
      const videoParticipants = pageParticipants
        .filter((user) => user.bVideoOn)
        .map((user) => user.userId);
      setSubscribedVideos(videoParticipants);
    }
  }, [zmClient]);
  useEffect(() => {
    zmClient.on('user-added', onParticipantsChange);
    zmClient.on('user-removed', onParticipantsChange);
    zmClient.on('user-updated', onParticipantsChange);
    return () => {
      zmClient.off('user-added', onParticipantsChange);
      zmClient.off('user-removed', onParticipantsChange);
      zmClient.off('user-updated', onParticipantsChange);
    };
  }, [zmClient, onParticipantsChange]);
  useEffect(() => {
    onParticipantsChange();
  }, [onParticipantsChange]);

  useRenderVideo(
    mediaStream,
    isVideoDecodeReady,
    currentUser,
    videoRefMain,
    videoRefSmall,
    subscribedVideos,
    visibleParticipants
  );
  return {
    visibleParticipants
  };
}
