import React from 'react';
import { X } from 'lucide-react';

const categoryInfo = {
  'Animators': {
    description: "Join a community of animation professionals showcasing their best work. Your Brownstone in this directory connects you with collaborators, clients, and fellow animators. Share your motion stories, get discovered, and build your network in an algorithm-free space dedicated to visual storytelling.",
    icon: "🎬"
  },
  'Illustrators': {
    description: "Showcase your visual artistry alongside top illustrators and designers. This directory listing puts your portfolio in front of clients seeking talent and creators looking for collaboration. Connect with brands, publishers, and fellow artists in a curated creative space.",
    icon: "🖼️"
  },
  'Motion Graphics Artists': {
    description: "Display your kinetic design work in a community built for motion specialists. Your directory presence helps potential clients find you for title sequences, explainer videos, and visual effects. Network with agencies, studios, and brands seeking dynamic visual content.",
    icon: "✨"
  },
  '3D Artists': {
    description: "Present your 3D portfolio to a community valuing dimensional creativity. From product visualization to character work, your listing connects you with studios, game developers, and clients. Join a directory where your renders and models get the attention they deserve.",
    icon: "🎨"
  },
  'Photographers': {
    description: "Share your visual perspective in a directory dedicated to photographic excellence. Connect with clients seeking professional imagery, collaborate with other creatives, and showcase your unique style. Your Brownstone becomes your digital gallery in a community of visual storytellers.",
    icon: "📸"
  },
  'Video Editors': {
    description: "Join editors who transform raw footage into compelling stories. Your directory listing showcases your editing style to content creators, agencies, and brands. Network with filmmakers, find collaborative projects, and get hired in a space that values post-production craftsmanship.",
    icon: "✂️"
  },
  'Filmmakers': {
    description: "Showcase your cinematic work among fellow directors and cinematographers. Your directory presence attracts producers, collaborators, and audiences interested in your visual storytelling. Connect with the film community, share your reel, and find your next project.",
    icon: "🎥"
  },
  'Musicians': {
    description: "Share your sound with a community that appreciates musical craftsmanship. Your Brownstone lets listeners discover your compositions, producers find collaborators, and clients hire you for their projects. Network with other musicians and build your fanbase in an authentic creative space.",
    icon: "🎵"
  },
  'Voice Actors': {
    description: "Let your voice be heard in a directory connecting talent with opportunity. Showcase your range, demo reels, and vocal abilities to casting directors, game developers, and content creators. Join a community where voice artists network, collaborate, and get discovered.",
    icon: "🎙️"
  },
  'Writers': {
    description: "Join writers sharing their craft in a curated creative community. Your directory listing showcases your work to publishers, producers, and collaborators. Connect with other writers, find projects, and build your audience in a space dedicated to the written word.",
    icon: "✏️"
  },
  'Game Developers': {
    description: "Showcase your interactive creations among fellow game creators. Your directory presence attracts players, publishers, and collaborators. Share your projects, network with the gamedev community, and connect with studios seeking talent in a space celebrating interactive art.",
    icon: "🎮"
  },
  'UX/UI Designers': {
    description: "Display your design thinking in a community of interface craftspeople. Your Brownstone connects you with startups, agencies, and product teams seeking user-focused design. Network with fellow designers, share your process, and get hired for projects that value intuitive experiences.",
    icon: "💻"
  }
};

export default function CategoryModal({ category, onClose }) {
  if (!category) return null;

  // Remove emoji prefix from category name if present
  const cleanCategory = category.replace(/^[^\s]+\s/, '');
  const info = categoryInfo[cleanCategory];
  
  if (!info) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-gradient-to-br from-[#2d1810] to-[#4a2c1f] rounded-xl max-w-2xl w-full p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-3xl font-bold text-[#d4af37] mb-4">
          {info.icon} {cleanCategory}
        </h2>

        <p className="text-white/90 text-lg leading-relaxed mb-6">
          {info.description}
        </p>

        <div className="border-t border-[#d4af37]/30 pt-6">
          <p className="text-[#d4af37] font-semibold mb-2">
            Why Join This Directory?
          </p>
          <ul className="text-white/80 space-y-1 text-sm">
            <li>• Get discovered by clients and collaborators</li>
            <li>• Network with fellow creators in your field</li>
            <li>• Showcase your work algorithm-free</li>
            <li>• Build your professional presence</li>
          </ul>
        </div>
      </div>
    </div>
  );
}