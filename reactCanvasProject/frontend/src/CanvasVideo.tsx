import { useEffect, useRef, useState } from "react";
import Typewriter from "./components/typewriter";
import BlinkAnimation from "./components/blinkAnimation";

interface VideoData {
  index: number;
  sentence: string;
  textPosition: string;
  textAnimation: string;
  media: string;
  duration: number;
}

// Original media datasets
// "media": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
// "media": "https://www.w3schools.com/html/mov_bbb.mp4",


const CanvasVideo = () => {

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [muted, setMuted] = useState(true);

  const [BGM, setBGM] = useState(true); //(*)

  const videoRef = useRef<HTMLVideoElement>(document.createElement("video"));
  const videoContainerRef = useRef<{ video: HTMLVideoElement; ready: boolean; scale?: number }>({
    video: videoRef.current,
    ready: false,
  });
  // const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [videoData, setVideoData] = useState<VideoData[]>([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false); // Track if the video is playing

  const audioRef = useRef<HTMLAudioElement>(document.createElement("audio")); // (*) Ref for the audio element

  useEffect(() => {
    // Fetch video data from JSON
    fetch("/videoData.json")
      .then((response) => response.json())
      .then((data: VideoData[]) => {
        if (data.length > 0) {
          setVideoData(data); // Set all video data
        }
      })
      .catch((error) => console.error("Error fetching video data:", error));
  }, [currentVideoIndex]);
  

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const video = videoRef.current;
    const videoContainer = videoContainerRef.current;
    
    const audio = audioRef.current; // (*) Reference to the audio element

    // if (!canvas || !ctx || !videoData) return;
    if (!canvas || !ctx || videoData.length === 0) return;

    // Set up video properties
    // video.src = videoData.media;
    const currentVideo = videoData[currentVideoIndex];
    video.src = currentVideo.media;
    console.log("Current Video:", currentVideo.sentence);
  

    video.autoplay = false;
    video.loop = false;
    video.muted = muted;

    audio.src = "https://www.bensound.com/bensound-music/bensound-creativeminds.mp3"; // (*) Set the audio source
    audio.loop = true; // (*) Loop the audio

    video.onplay = () => {
      if (BGM) audio.play(); // Play the audio when the video starts, if BGM is enabled
    };
  
    video.onpause = () => {
      audio.pause(); // Pause the audio when the video pauses
    };

    video.onerror = () => {
      if (canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
      document.body.innerHTML += "<h2>There is a problem loading the video</h2><br>";
    };

    video.oncanplay = () => {
      videoContainer.scale = Math.min(canvas.width / video.videoWidth, canvas.height / video.videoHeight);
      videoContainer.ready = true;
      requestAnimationFrame(updateCanvas);
    };

    // video.onended = () => {
    //   setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videoData.length);
    // };
    video.onended = () => {
      setCurrentVideoIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % videoData.length;
        video.src = videoData[nextIndex].media; // Update the video source

        videoContainer.scale = Math.min(canvas.width / video.videoWidth, canvas.height / video.videoHeight);
        videoContainer.ready = true;
        video.onloadeddata = () => {
          if (nextIndex === 1) { // Apply the modified start time to the second video.
            video.currentTime = 3;
          } else {
          }
          video.play(); // Start playing the next video
          setIsPlaying(true); // Set the video state to playing
        };
        return nextIndex;
      });
    };

    const updateCanvas = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (videoContainer.ready) {
        const scale = videoContainer.scale!;
        const vidH = video.videoHeight;
        const vidW = video.videoWidth;
        const top = canvas.height / 2 - (vidH / 2) * scale;
        const left = canvas.width / 2 - (vidW / 2) * scale;
    
        ctx.drawImage(video, left, top, vidW * scale, vidH * scale);
    
        if (video.paused) {
          drawPlayIcon(ctx, canvas);
        }
      }
      requestAnimationFrame(updateCanvas);
    };

    const drawPlayIcon = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
      ctx.fillStyle = "black";
      ctx.globalAlpha = 0.5;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#DDD";
      ctx.globalAlpha = 0.75;
      ctx.beginPath();
      const size = (canvas.height / 2) * 0.5;
      ctx.moveTo(canvas.width / 2 + size / 2, canvas.height / 2);
      ctx.lineTo(canvas.width / 2 - size / 2, canvas.height / 2 + size);
      ctx.lineTo(canvas.width / 2 - size / 2, canvas.height / 2 - size);
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = 1;
    };

    const handleCanvasClick = () => {
      if (videoContainer.ready) {
        if (video.paused) {
          video.play();
          setIsPlaying(true);

        } else {
          video.pause();
          setIsPlaying(false);
        }
      }
    };

    canvas.addEventListener("click", handleCanvasClick);
    return () => {
      canvas.removeEventListener("click", handleCanvasClick);
    };
  }, [videoData]);

  useEffect(() => {
    videoRef.current.muted = muted;
  }, [muted]);


  useEffect(() => {
    const audio = audioRef.current;
    console.log("Audio element:", audio);
    if (BGM) {
      audio.play();
    } else {
      audio.pause();
    }

    console.log("BGM State changed:", BGM)
  }, [BGM]);

  return (
    <>
      <div style={{ position: "relative" }}>
        <canvas ref={canvasRef} width={1280} height={720}></canvas>
        <audio ref={audioRef}></audio> {/* Audio element */}
        <div>
          <button onClick={() => setMuted((prev) => !prev)}>
            {muted ? "Unmute" : "Mute"}
          </button>
          <button onClick={() => setBGM((prev) => !prev)}>
            {BGM ? "BGM Off" : "BGM On"}
          </button>
        </div>

        {/* Ensure videoData[currentVideoIndex] exists before accessing its properties */}
                {videoData[currentVideoIndex] && isPlaying && ( // Render animations only if video is playing
          <div
            style={{
              position: "absolute",
              top: videoData[currentVideoIndex].textPosition === "top-right" ? "10px" : "50%",
              right: videoData[currentVideoIndex].textPosition === "top-right" ? "10px" : "auto",
              left: videoData[currentVideoIndex].textPosition === "middle-center" ? "50%" : "auto",
              transform:
                videoData[currentVideoIndex].textPosition === "middle-center"
                  ? "translate(-50%, -50%)"
                  : "none",
              color: "black",
              fontSize: "20px",
              fontFamily: "Arial",
              zIndex: 10,
            }}
          >
            {videoData[currentVideoIndex].textAnimation === "typing" && (
              <Typewriter
                text={videoData[currentVideoIndex].sentence}
                delay={100}
                infinite
              />
            )}
            {videoData[currentVideoIndex].textAnimation === "blink" && (
              <BlinkAnimation
                text={videoData[currentVideoIndex].sentence}
                delay={500}
                infinite
              />
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default CanvasVideo;