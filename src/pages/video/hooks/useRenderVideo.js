import { useEffect } from "react";
import { usePrevious } from "./usePrevious";

export function useRenderVideo(
  mediaStream,
  isVideoDecodeReady,
  currentUser,
  videoRefMain,
  videoRefSmall,
  subscribedVideos,
  participants
) {

  const previousSubscribedVideos = usePrevious(subscribedVideos);
  const previousParticipants = usePrevious(participants);
  const previousIsVideoDecodeReady = usePrevious(isVideoDecodeReady);

  useEffect(() => {
    if (currentUser && isVideoDecodeReady) {
      const addedSubscribers = subscribedVideos.filter(
        (id) => !(previousSubscribedVideos || []).includes(id)
      );
      const removedSubscribers = (previousSubscribedVideos || []).filter(
        (id) => !subscribedVideos.includes(id)
      );
      if (removedSubscribers.length > 0) {
        removedSubscribers.forEach(async (userId) => {
          if (userId !== currentUser.userId) {
            await mediaStream?.stopRenderVideo(videoRefMain.current, userId);
          } else {
            await mediaStream?.stopRenderVideo(videoRefSmall.current, userId);
          }
        });
      }
      if (addedSubscribers.length > 0) {
        addedSubscribers.forEach(async (userId) => {
          if (userId !== currentUser.userId) {
            await mediaStream?.renderVideo(
              videoRefMain.current,
              userId,
              videoRefMain.current.width,
              videoRefMain.current.height,
              0,
              0,
              2
            );
          } else {
            await mediaStream?.renderVideo(
              videoRefSmall.current,
              userId,
              videoRefSmall.current.width,
              videoRefSmall.current.height,
              0,
              0,
              2
            );
          }
        });
      }
    }
  }, [
    mediaStream,
    isVideoDecodeReady,
    videoRefMain,
    videoRefSmall,
    currentUser,
    participants,
    previousParticipants,
    subscribedVideos,
    previousSubscribedVideos,
  ]);

  useEffect(() => {
    if (
      currentUser &&
      previousIsVideoDecodeReady === false &&
      isVideoDecodeReady === true &&
      subscribedVideos.length > 0
    ) {
      subscribedVideos.forEach(async (userId) => {
        if (userId !== currentUser.userId) {
          await mediaStream?.renderVideo(
            videoRefMain.current,
            userId,
            videoRefMain.current.width,
            videoRefMain.current.height,
            0,
            0,
            2
          );
        } else {
          await mediaStream?.renderVideo(
            videoRefSmall.current,
            userId,
            videoRefSmall.current.width,
            videoRefSmall.current.height,
            0,
            0,
            2
          );
        }
      });
    }
  }, [
    mediaStream,
    videoRefMain,
    videoRefSmall,
    currentUser,
    participants,
    subscribedVideos,
    isVideoDecodeReady,
    previousIsVideoDecodeReady,
  ]);
}
