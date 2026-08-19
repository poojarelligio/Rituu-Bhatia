"use client";

import { useState } from "react";
import Image from "next/image";
import { Play, X } from "lucide-react";
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
    embedUrl: "https://www.youtube.com/embed/rTQiHZ23x3A",
    title: "Client Success Story",
    description: "Hear how Rituu's guidance brought clarity and transformation.",
  },
  {
    id: 2,
    embedUrl: "https://www.youtube.com/embed/KWNGTSguHvo",
    title: "Client Testimonial",
    description: "A journey from confusion to confidence with Rituu's sessions.",
  },
  {
    id: 3,
    embedUrl: "https://www.youtube.com/embed/GRuJEcwx0hQ",
    title: "Energy Healing Session",
    description: "Real experience of a Reiki healing session with Rituu.",
  },
  {
    id: 4,
    embedUrl: "https://www.youtube.com/embed/3TXl5T64J0U",
    title: "Consultation Experience",
    description: "What it's like to work with Rituu for Vaastu and Astrology.",
  },
];

export default function HappyClients() {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  return (
    <section className="bg-ivory py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <SectionHeading
          eyebrow="HAPPY CLIENTS"
          title="Stories of transformation"
          description="Real people, real journeys - hear what they have to say about working with Rituu."
          align="center"
        />

        {/* Video Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-12">
          {videoData.map((video) => {
            const videoId = getYouTubeId(video.embedUrl);
            const thumbnailUrl = videoId 
              ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
              : '/images/fallback-video.jpg';

            return (
              <div
                key={video.id}
                onClick={() => setSelectedVideo(video.embedUrl)}
                className="group relative aspect-video bg-charcoal rounded-sm overflow-hidden cursor-pointer border border-line hover:border-gold transition-all duration-300"
              >
                {/* YouTube Thumbnail */}
                <Image
                  src={thumbnailUrl}
                  alt={video.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />

                {/* Dark Overlay for readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent" />
                <div className="absolute inset-0 bg-charcoal/20 group-hover:bg-charcoal/10 transition-all duration-300" />

                {/* Play Button Overlay - Centered */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-gold/90 text-charcoal flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-xl">
                    <Play className="w-6 h-6 ml-1" fill="currentColor" />
                  </div>
                </div>

                {/* Video Info - Bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p className="text-xs text-gold-soft font-label tracking-wider mb-1">WATCH</p>
                  <h3 className="font-display text-lg text-ivory">{video.title}</h3>
                  <p className="text-sm text-ivory/70">{video.description}</p>
                </div>
              </div>
            );
          })}
        </div>

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
              {/* Close Button */}
              <button
                onClick={() => setSelectedVideo(null)}
                className="absolute -top-12 right-0 text-ivory/60 hover:text-ivory transition-colors z-10"
              >
                <X className="w-8 h-8" />
              </button>

              {/* YouTube Iframe */}
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