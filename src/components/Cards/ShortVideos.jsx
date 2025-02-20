import React, { useState, useEffect } from "react";
import { Play } from "lucide-react";

const VideoCard = ({ videoSrc, views, isPlaying, onPlay }) => {
  const [thumbnail, setThumbnail] = useState(null);

  useEffect(() => {
    const video = document.createElement("video");
    video.crossOrigin = "anonymous";
    video.muted = true;
    video.playsInline = true;
    video.src = videoSrc;

    const handleLoadedMetadata = () => {
      video.currentTime = 1;
    };

    const handleSeeked = () => {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      setThumbnail(canvas.toDataURL());
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("seeked", handleSeeked);
    video.load();

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("seeked", handleSeeked);
    };
  }, [videoSrc]);

  return (
    <div className="relative overflow-hidden rounded-md group transition-all shadow-lg hover:shadow-xl">
      <div className="relative pt-[100.78%]">
        <div className="absolute top-0 left-0 w-full h-full">
          {!isPlaying ? (
            thumbnail ? (
              <img
                src={thumbnail}
                alt="Video thumbnail"
                className="w-full h-full object-cover transition-opacity duration-300"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 animate-pulse" />
            )
          ) : (
            <video
              src={videoSrc}
              controls
              autoPlay
              className="w-full h-full object-cover"
            />
          )}

          {!isPlaying && (
            <div
              onClick={onPlay}
              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <Play className="text-white w-12 h-12 transform transition-transform hover:scale-110" />
            </div>
          )}

          <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
            {views} views
          </div>
        </div>
      </div>
    </div>
  );
};

const ShortVideosSection = () => {
  const [playingVideoId, setPlayingVideoId] = useState(null);

  const videos = [
    {
      id: 1,
      videoSrc: "/videos/video4.mp4",
      views: "5,245",
    },
    {
      id: 2,
      videoSrc: "/videos/video2.mp4",
      views: "3,245",
    },
    {
      id: 3,
      videoSrc: "/videos/video3.mp4",
      views: "5,935",
    },
    {
      id: 4,
      videoSrc: "/videos/video.mp4",
      views: "3,247",
    },
  ];

  const handlePlay = (id) => {
    setPlayingVideoId((prevId) => (prevId === id ? null : id));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Short Videos</h2>
        <a
          href="#"
          className="text-gray-600 hover:text-gray-800 font-medium transition-colors">
          See All →
        </a>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
        {videos.map((video) => (
          <VideoCard
            key={video.id}
            videoSrc={video.videoSrc}
            views={video.views}
            isPlaying={playingVideoId === video.id}
            onPlay={() => handlePlay(video.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default ShortVideosSection;
