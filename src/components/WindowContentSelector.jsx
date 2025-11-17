import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Youtube, Users, Check, Play } from 'lucide-react';

export default function WindowContentSelector({ windowNum, onSelect, isUploading, onUpload }) {
  const [showLibrary, setShowLibrary] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: clips = [] } = useQuery({
    queryKey: ['community-clips'],
    queryFn: () => base44.entities.CommunityClip.filter({ is_public: true }, '-total_uses', 50),
    enabled: showLibrary
  });

  const filteredClips = clips.filter(clip => {
    const matchesSearch = clip.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || clip.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    'Sound Effects', 'Music Loops', 'Drum Beats', 'Bass Lines',
    'Vocal Samples', 'Comedy Clips', 'Transition Videos', 'Other'
  ];

  if (showLibrary) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 'bold', color: '#4a2c1f' }}>
            Browse Community Library
          </h4>
          <Button
            onClick={() => setShowLibrary(false)}
            variant="outline"
            size="sm"
          >
            ← Back
          </Button>
        </div>

        <Input
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="text-sm"
        />

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(cat => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div style={{ 
          maxHeight: '300px', 
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          {filteredClips.length === 0 ? (
            <p style={{ color: '#666', fontSize: '0.85rem', textAlign: 'center', padding: '20px' }}>
              No clips found
            </p>
          ) : (
            filteredClips.map(clip => (
              <div
                key={clip.id}
                style={{
                  padding: '10px',
                  background: 'rgba(74, 222, 128, 0.1)',
                  border: '1px solid #4ade80',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onClick={async () => {
                  onSelect({ url: clip.clip_url, type: clip.clip_type });
                  await base44.entities.CommunityClip.update(clip.id, {
                    total_uses: (clip.total_uses || 0) + 1
                  });
                  setShowLibrary(false);
                }}
              >
                <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#4a2c1f' }}>
                  {clip.title}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '4px' }}>
                  {clip.category} • {clip.duration}s • Used {clip.total_uses || 0} times
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <label style={{ fontSize: '0.85rem', cursor: 'pointer' }}>
        <input
          type="file"
          accept="video/*,audio/*"
          onChange={(e) => onUpload(e.target.files[0], windowNum)}
          style={{ display: 'none' }}
          disabled={isUploading}
        />
        <div style={{
          padding: '12px',
          background: '#4a2c1f',
          color: 'white',
          borderRadius: '6px',
          textAlign: 'center',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}>
          <Upload className="inline w-4 h-4 mr-2" />
          Upload Video/Audio
        </div>
      </label>

      <Button
        onClick={() => setShowLibrary(true)}
        variant="outline"
        className="w-full border-green-500 text-green-600 hover:bg-green-50"
        size="sm"
      >
        <Users className="w-4 h-4 mr-2" />
        Community Library
      </Button>
      
      <Input
        placeholder="Or paste YouTube URL"
        onBlur={(e) => {
          if (e.target.value) {
            const link = e.target.value;
            let videoId = '';
            if (link.includes('youtube.com/watch?v=')) {
              videoId = link.split('v=')[1]?.split('&')[0];
            } else if (link.includes('youtu.be/')) {
              videoId = link.split('youtu.be/')[1]?.split('?')[0];
            }
            
            if (videoId) {
              onSelect({ url: link, type: 'youtube', videoId });
              e.target.value = '';
            } else {
              alert('Invalid YouTube URL');
            }
          }
        }}
        className="text-sm"
        disabled={isUploading}
      />
    </div>
  );
}