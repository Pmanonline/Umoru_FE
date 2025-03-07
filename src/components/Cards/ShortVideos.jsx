import React, { useState, useEffect, useRef, useCallback } from "react";
import { Play, ChevronLeft, ChevronRight } from "lucide-react";

// Optimized VideoCard with responsive sizing
const VideoCard = React.memo(({ videoSrc, isPlaying, onPlay }) => {
  const [thumbnail, setThumbnail] = useState(null);

  const generateThumbnail = useCallback(async () => {
    const video = document.createElement("video");
    video.crossOrigin = "anonymous";
    video.muted = true;
    video.playsInline = true;
    video.src = videoSrc;

    return new Promise((resolve) => {
      video.addEventListener("loadedmetadata", () => {
        video.currentTime = 1;
      });
      video.addEventListener("seeked", () => {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL());
      });
      video.load();
    });
  }, [videoSrc]);

  useEffect(() => {
    let isMounted = true;
    generateThumbnail().then((thumb) => {
      if (isMounted) setThumbnail(thumb);
    });
    return () => {
      isMounted = false;
    };
  }, [generateThumbnail]);

  return (
    <div className="relative min-w-[15rem] sm:min-w-[18rem] md:min-w-[20rem] rounded-md group transition-all shadow-lg hover:shadow-xl flex-shrink-0">
      <div className="relative pt-[56.25%]">
        <div className="absolute top-0 left-0 w-full h-full ">
          {!isPlaying ? (
            thumbnail ? (
              <img
                src={thumbnail}
                alt="Video thumbnail"
                className="w-full h-full object-cover rounded-md"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 animate-pulse rounded-md" />
            )
          ) : (
            <video
              src={videoSrc}
              controls
              autoPlay
              className="w-full h-full object-cover rounded-md"
              preload="metadata"
            />
          )}

          {!isPlaying && (
            <div
              onClick={onPlay}
              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <Play className="text-white w-12 h-12 transform transition-transform hover:scale-110" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

const ShortVideosSection = () => {
  const [playingVideoId, setPlayingVideoId] = useState(null);
  const carouselRef = useRef(null);

  const videos = [
    { id: 1, videoSrc: "/videos/video4.mp4" },
    { id: 2, videoSrc: "/videos/video2.mp4" },
    { id: 3, videoSrc: "/videos/video3.mp4" },
    { id: 4, videoSrc: "/videos/video.mp4" },
  ];

  const handlePlay = (id) => {
    setPlayingVideoId((prevId) => (prevId === id ? null : id));
  };

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -250, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 250, behavior: "smooth" });
    }
  };

  return (
    <div className="mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Short Videos</h2>
      <div className="relative">
        {/* Scrollable Video Container */}
        <div
          ref={carouselRef}
          className="flex gap-4 overflow-x-auto scroll-smooth scrollbar-hide snap-x"
          style={{ scrollSnapType: "x mandatory" }}>
          {videos.map((video) => (
            <div key={video.id} className="snap-center">
              <VideoCard
                videoSrc={video.videoSrc}
                isPlaying={playingVideoId === video.id}
                onPlay={() => handlePlay(video.id)}
              />
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={scrollLeft}
            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors disabled:opacity-50"
            disabled={carouselRef.current?.scrollLeft <= 0}>
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>
          <button
            onClick={scrollRight}
            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors disabled:opacity-50"
            disabled={
              carouselRef.current?.scrollWidth -
                carouselRef.current?.scrollLeft <=
              carouselRef.current?.clientWidth + 1
            }>
            <ChevronRight className="w-6 h-6 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShortVideosSection;
