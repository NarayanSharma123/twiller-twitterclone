import React, { useRef, useState, useEffect } from "react";
import {
  FaPlay,
  FaPause,
  FaVolumeUp,
  FaVolumeMute,
  FaExpand,
  FaCompress,
} from "react-icons/fa";
import "./CustomVideoPlayer.css";

const CustomVideoPlayer = ({
  src,
  onNextVideo,
  onShowComments,
  onCloseWebsite,
}) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState("0:00");
  const [currentTime, setCurrentTime] = useState("0:00");
  const [lastTap, setLastTap] = useState(0);
  const [tapCount, setTapCount] = useState(0);

  // Format time mm:ss
  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  // Update progress
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateProgress = () => {
      setProgress((video.currentTime / video.duration) * 100 || 0);
      setCurrentTime(formatTime(video.currentTime));
      setDuration(formatTime(video.duration));
    };

    video.addEventListener("timeupdate", updateProgress);
    return () => video.removeEventListener("timeupdate", updateProgress);
  }, []);

  const togglePlay = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoRef.current.parentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleProgressClick = (e) => {
    const bar = e.currentTarget;
    const clickX = e.nativeEvent.offsetX;
    const newTime = (clickX / bar.offsetWidth) * videoRef.current.duration;
    videoRef.current.currentTime = newTime;
  };

  // Gesture handling
  const handleTap = (e) => {
    const now = Date.now();
    const overlay = e.currentTarget;
    const tapX = e.clientX || (e.touches && e.touches[0].clientX);
    const width = overlay.clientWidth;

    if (now - lastTap < 400) {
      setTapCount((prev) => prev + 1);
    } else {
      setTapCount(1);
    }
    setLastTap(now);

    const currentTap = tapCount + 1;

    // Single Tap (pause/play)
    if (currentTap === 1) {
      setTimeout(() => {
        if (tapCount === 1) {
          if (tapX > width * 0.33 && tapX < width * 0.66) {
            togglePlay();
          }
        }
      }, 350);
    }

    // Double Tap
    if (currentTap === 2) {
      if (tapX > width * 0.66) {
        videoRef.current.currentTime += 10;
      } else if (tapX < width * 0.33) {
        videoRef.current.currentTime -= 10;
      }
    }

    // Triple Tap
    if (currentTap === 3) {
      if (tapX > width * 0.66) {
        window.close(); // right = close
      } else if (tapX < width * 0.33) {
        onShowComments ? onShowComments() : alert("Comments Section");
      } else {
        onNextVideo ? onNextVideo() : alert("Next Video");
      }
      setTapCount(0);
    }
  };

  return (
    <div className="video-container">
      <video ref={videoRef} src={src} className="video-element" playsInline />

      <div
        className="video-overlay"
        onClick={handleTap}
        onTouchStart={handleTap}
      />

      <div className="controls">
        <div className="progress-bar" onClick={handleProgressClick}>
          <div className="progress" style={{ width: `${progress}%` }}></div>
        </div>

        <div className="controls-row">
          <button onClick={togglePlay} className="control-btn">
            {isPlaying ? <FaPause /> : <FaPlay />}
          </button>

          <button onClick={toggleMute} className="control-btn">
            {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
          </button>

          <span className="time">
            {currentTime} / {duration}
          </span>

          <button onClick={toggleFullscreen} className="control-btn">
            {isFullscreen ? <FaCompress /> : <FaExpand />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomVideoPlayer;
