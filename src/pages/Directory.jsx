import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Heart } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Directory() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const { data: brownstones = [] } = useQuery({
    queryKey: ['directory'],
    queryFn: async () => {
      const result = await base44.entities.Brownstone.filter({ 
        is_published: true,
        is_disabled: false 
      });
      // Sort alphabetically by username
      return result.sort((a, b) => a.username.localeCompare(b.username));
    }
  });

  const filteredBrownstones = brownstones.filter(b => {
    const matchesSearch = !searchQuery || 
      b.display_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.username?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || b.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    'Animators',
    'Illustrators',
    'Motion Graphics Artists',
    '3D Artists',
    'Photographers',
    'Video Editors',
    'Filmmakers',
    'Musicians',
    'Voice Actors',
    'Writers',
    'Game Developers',
    'UX/UI Designers'
  ];

  // Group brownstones by category
  const brownstonesGroupedByCategory = categories.reduce((acc, category) => {
    acc[category] = filteredBrownstones.filter(b => b.category === category);
    return acc;
  }, {});

  return (
    <div style={{ fontFamily: 'Georgia, serif', minHeight: '100vh', background: '#F5F1E8' }}>
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `
            linear-gradient(rgba(245, 241, 232, 0.55), rgba(245, 241, 232, 0.55)),
            url(https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69014b5c7ec1ef01ef6e43d8/94109f1f8_city-street-background.jpg)
          `,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          zIndex: -1
        }}
      />

      <Header />

      <div style={{ maxWidth: '1400px', margin: '40px auto', padding: '0 20px' }}>
        <h1 style={{ color: '#4a2c1f', fontSize: '2.5rem', textAlign: 'center', marginBottom: '40px' }}>
          🏛️ Community Directory
        </h1>

        {/* Filters */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '15px',
          padding: '30px',
          marginBottom: '40px',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr auto', gap: '15px', alignItems: 'center' }}>
            <Input
              placeholder="Search by name or username..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-12 text-base"
            />
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="h-12 text-base">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
              onClick={() => {/* Filter already happens automatically */}}
              className="h-12 bg-[#d4af37] hover:bg-[#f5c842] text-[#2d5016] font-bold px-8"
            >
              Search
            </Button>
          </div>
        </div>

        {/* Category Sections */}
        {categoryFilter === 'all' ? (
          // Show all categories with headers
          categories.map(category => {
            const categoryBrownstones = brownstonesGroupedByCategory[category];
            if (categoryBrownstones.length === 0) return null;
            
            return (
              <div key={category} style={{ marginBottom: '50px' }}>
                <h2 style={{ 
                  color: '#4a2c1f', 
                  fontSize: '2rem', 
                  marginBottom: '25px',
                  padding: '15px 25px',
                  background: 'linear-gradient(135deg, #d4af37 0%, #f5c842 100%)',
                  borderRadius: '12px',
                  textAlign: 'center',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                  border: '3px solid #b8941f'
                }}>
                  {category}
                </h2>
                
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(6, 1fr)', 
                  gap: '15px',
                  marginBottom: '20px'
                }}>
                  {categoryBrownstones.map(brownstone => (
                    <BrownstoneThumbnail key={brownstone.id} brownstone={brownstone} />
                  ))}
                </div>
              </div>
            );
          })
        ) : (
          // Show only selected category
          <div>
            <h2 style={{ 
              color: '#4a2c1f', 
              fontSize: '2rem', 
              marginBottom: '25px',
              padding: '15px 25px',
              background: 'linear-gradient(135deg, #d4af37 0%, #f5c842 100%)',
              borderRadius: '12px',
              textAlign: 'center',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
              border: '3px solid #b8941f'
            }}>
              {categoryFilter}
            </h2>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(6, 1fr)', 
              gap: '15px'
            }}>
              {filteredBrownstones.map(brownstone => (
                <BrownstoneThumbnail key={brownstone.id} brownstone={brownstone} />
              ))}
            </div>
          </div>
        )}

        {filteredBrownstones.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '15px',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
          }}>
            <p style={{ fontSize: '1.2rem', color: '#666' }}>
              No brownstones found. Be the first to create one!
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

function BrownstoneThumbnail({ brownstone }) {
  return (
    <div
      onClick={() => window.location.href = `/UserBrownstone?username=${brownstone.username}`}
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '832 / 1500',
        cursor: 'pointer',
        borderRadius: '8px',
        overflow: 'hidden',
        transition: 'all 0.3s',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
        border: '3px solid #d4af37'
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'scale(1.08)';
        e.currentTarget.style.boxShadow = '0 8px 25px rgba(212, 175, 55, 0.8)';
        e.currentTarget.style.borderColor = '#f5c842';
        e.currentTarget.style.zIndex = '10';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.3)';
        e.currentTarget.style.borderColor = '#d4af37';
        e.currentTarget.style.zIndex = '1';
      }}
    >
      {/* Base desaturated brownstone */}
      <img 
        src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69014b5c7ec1ef01ef6e43d8/130669447_brownstone_desaturated.png"
        alt={`${brownstone.username} brownstone`}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          zIndex: 1
        }}
      />
      
      {/* Color or Image layer with CSS MASK */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 2,
          backgroundColor: brownstone.facade_image_url ? 'transparent' : (brownstone.facade_color || '#8B5A3C'),
          backgroundImage: brownstone.facade_image_url ? `url(${brownstone.facade_image_url})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          WebkitMaskImage: 'url(https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69014b5c7ec1ef01ef6e43d8/f1a38e8a6_brownstone_walls_only.png)',
          maskImage: 'url(https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69014b5c7ec1ef01ef6e43d8/f1a38e8a6_brownstone_walls_only.png)',
          WebkitMaskSize: '100% 100%',
          maskSize: '100% 100%',
          WebkitMaskRepeat: 'no-repeat',
          maskRepeat: 'no-repeat',
          WebkitMaskPosition: '0 0',
          maskPosition: '0 0',
          opacity: (brownstone.facade_image_url ? (brownstone.facade_image_opacity || 50) : (brownstone.facade_opacity || 25)) / 100,
          pointerEvents: 'none'
        }}
      />
      
      {/* Info overlay */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'linear-gradient(to top, rgba(0, 0, 0, 0.95), transparent)',
        color: 'white',
        padding: '20px 6px 6px',
        zIndex: 10
      }}>
        <div style={{ fontSize: '0.7rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '2px' }}>
          @{brownstone.username}
        </div>
        <div style={{ fontSize: '0.65rem', textAlign: 'center', marginBottom: '3px', color: '#d4af37' }}>
          {brownstone.display_name}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', fontSize: '0.6rem' }}>
          <Heart className="w-2.5 h-2.5 fill-current text-red-500" />
          <span>{brownstone.total_likes || 0}</span>
        </div>
      </div>
    </div>
  );
}