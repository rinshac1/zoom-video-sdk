import React, { useEffect, useContext, useRef } from "react";

import ZoomContext from "../../context/zoom-context";
import ZoomMediaContext from "../../context/media-context";
import VideoFooter from "./components/VideoFooter";
import { useDualParticipantsLayout } from "./hooks/useDualParticipantsLayout";
import "./video.scss";

const VideoContainer = (props) => {
  const zmClient = useContext(ZoomContext);

  const {
    mediaStream,
    video: { decode: isVideoDecodeReady },
  } = useContext(ZoomMediaContext);

  const viewportRef = useRef(null);
  const videoRefMain = useRef(null);
  const videoRefSmall = useRef(null);

  useEffect(() => {
    videoRefMain.current.height = viewportRef.current.offsetHeight;
    videoRefMain.current.width = viewportRef.current.offsetWidth;
  }, []);

  useDualParticipantsLayout(
    zmClient,
    mediaStream,
    isVideoDecodeReady,
    videoRefMain,
    videoRefSmall
  );

  return (
    <div className="viewport" ref={viewportRef}>
      <div className={"video-container"}>
        <div className="canvas-container-1">
          <canvas
            className="canvas-bottom"
            id="canvas1"
            width="800"
            height="500"
            ref={videoRefMain}
          ></canvas>
        </div>
        <div className="canvas-container-2">
          <canvas
            className="canvas-top"
            id="canvas2"
            width="250"
            height="150"
            ref={videoRefSmall}
          ></canvas>
        </div>
        <VideoFooter />
      </div>
    </div>
  );
};

export default VideoContainer;
