"use client";

import { useState } from "react";
import Image from "next/image";
import { Play, X, Star } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";

// Helper function to extract video ID from YouTube URL
function getYouTubeId(url: string) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

const videoData = [
  {
    id: 1,
    embedUrl: "https://www.youtube.com/embed/GRuJEcwx0hQ",
    title: "Actress Testimonial",
    description: "Hear how Rituu's guidance brought clarity and transformation.",
    featured: true,
    badge: "Featured",
    starRating: 5,
  },
  {
    id: 2,
    embedUrl: "https://www.youtube.com/embed/KWNGTSguHvo",
    title: "Actor Testimonial",
    description: "A journey from confusion to confidence with Rituu's sessions.",
    featured: true,
    badge: "Featured",
    starRating: 5,
  },
  {
    id: 3,
    embedUrl: "https://www.youtube.com/embed/rTQiHZ23x3A",
    title: "Energy Healing Session",
    description: "Real experience of a Reiki healing session with Rituu.",
    featured: false,
    badge: "Client Story",
    starRating: 5,
  },
  {
    id: 4,
    embedUrl: "https://www.youtube.com/embed/3TXl5T64J0U",
    title: "Consultation Experience",
    description: "What it's like to work with Rituu for Vaastu and Astrology.",
    featured: false,
    badge: "Client Story",
    starRating: 5,
  },
  {
    id: 5,
    embedUrl: "https://youtu.be/f-UkZZPwNRE?si=lTARoyz5kvR7-93g",
    title: "Another Client Story",
    description: "Real transformation through Rituu's sessions.",
    featured: false,
    badge: "Client Story",
    starRating: 4,
  },
];

export default function HappyClients() {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const featuredVideos = videoData.filter((v) => v.featured);
  const regularVideos = videoData.filter((v) => !v.featured);

  return (
    <section className="bg-ivory py-24 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-burgundy/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
        <SectionHeading
          eyebrow="REAL PEOPLE. REAL EXPERIENCES."
          title="Every journey begins with a question."
          description="Some begin with uncertainty, others with a desire to understand, learn or find a new perspective. Discover words from those who have experienced Rituu’s guidance."
          align="center"
        />

        {/* Featured Videos - 2 Large Videos */}
        {featuredVideos.length > 0 && (
          <div className="mt-12 mb-16 grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredVideos.map((video) => {
              const videoId = getYouTubeId(video.embedUrl);
              const thumbnailUrl = videoId 
                ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
                : '/images/fallback-video.jpg';

              return (
                <div
                  key={video.id}
                  onClick={() => setSelectedVideo(video.embedUrl)}
                  className="group relative aspect-video md:aspect-[16/9] bg-charcoal rounded-sm overflow-hidden cursor-pointer border border-line hover:border-gold transition-all duration-500 shadow-lg hover:shadow-2xl"
                >
                  {/* Thumbnail */}
                  <Image
                    src={thumbnailUrl}
                    alt={video.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />

                  {/* Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/30 to-transparent" />
                  <div className="absolute inset-0 bg-charcoal/20 group-hover:bg-charcoal/10 transition-all duration-500" />

                  {/* Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gold/90 text-charcoal flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-2xl">
                      <Play className="w-6 h-6 ml-1 md:w-8 md:h-8 md:ml-1.5" fill="currentColor" />
                    </div>
                  </div>

                  {/* Badge */}
                  <div className="absolute top-4 left-4 z-10 bg-gold/90 text-charcoal text-[10px] font-label tracking-widest px-3 py-1.5 rounded-full">
                    {video.badge}
                  </div>

                  {/* Star Rating - Top Right */}
                  <div className="absolute top-4 right-4 z-10 flex items-center gap-1 bg-charcoal/50 backdrop-blur-sm px-2 py-1 rounded-full">
                    <Star className="w-3 h-3 text-gold fill-gold" />
                    <span className="text-xs text-ivory/80">{video.starRating}.0</span>
                  </div>

                  {/* Content at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
                    <h3 className="font-display text-xl md:text-2xl text-ivory font-light leading-tight mb-1">
                      {video.title}
                    </h3>
                    <p className="text-ivory/70 text-sm md:text-base line-clamp-2">
                      {video.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Regular Videos - Small Grid */}
        {regularVideos.length > 0 && (
          <>
            {/* Divider with label */}
            <div className="flex items-center gap-4 mb-8">
              <span className="text-xs text-charcoal/30 font-label tracking-widest uppercase">More Stories</span>
              <span className="flex-1 h-px bg-line"></span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {regularVideos.map((video) => {
                const videoId = getYouTubeId(video.embedUrl);
                const thumbnailUrl = videoId 
                  ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
                  : '/images/fallback-video.jpg';

                return (
                  <div
                    key={video.id}
                    onClick={() => setSelectedVideo(video.embedUrl)}
                    className="group relative aspect-video bg-charcoal rounded-sm overflow-hidden cursor-pointer border border-line hover:border-gold transition-all duration-300 hover:shadow-lg"
                  >
                    {/* Thumbnail */}
                    <Image
                      src={thumbnailUrl}
                      alt={video.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent" />
                    <div className="absolute inset-0 bg-charcoal/20 group-hover:bg-charcoal/10 transition-all duration-300" />

                    {/* Play Button - smaller */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-gold/90 text-charcoal flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-xl">
                        <Play className="w-4 h-4 ml-1" fill="currentColor" />
                      </div>
                    </div>

                    {/* Badge */}
                    <div className="absolute top-3 left-3 z-10 bg-charcoal/50 backdrop-blur-sm text-ivory/60 text-[9px] font-label tracking-wider px-2 py-0.5 rounded-full">
                      {video.badge}
                    </div>

                    {/* Star Rating */}
                    <div className="absolute bottom-14 left-4 z-10 flex items-center gap-1">
                      <Star className="w-3 h-3 text-gold fill-gold" />
                      <span className="text-[10px] text-ivory/50">{video.starRating}.0</span>
                    </div>

                    {/* Info - Bottom */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h4 className="font-display text-sm text-ivory leading-tight line-clamp-1">
                        {video.title}
                      </h4>
                      <p className="text-[11px] text-ivory/50 line-clamp-1">{video.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Video Modal */}
        {selectedVideo && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/90 backdrop-blur-sm p-4"
            onClick={() => setSelectedVideo(null)}
          >
            <div
              className="relative w-full max-w-4xl aspect-video bg-charcoal rounded-sm overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedVideo(null)}
                className="absolute -top-12 right-0 text-ivory/60 hover:text-ivory transition-colors z-10"
              >
                <X className="w-8 h-8" />
              </button>

              <iframe
                src={`${selectedVideo}?autoplay=1&rel=0&modestbranding=1`}
                title="Client Testimonial"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}