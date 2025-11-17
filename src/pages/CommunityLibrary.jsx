import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Music, Video, Play, Search, Users } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function CommunityLibrary() {
  const [user, setUser] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);

  React.useEffect(() => {
    async function getUser() {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      } catch (err) {
        setUser(null);
      }
    }
    getUser();
  }, []);

  const { data: clips = [] } = useQuery({
    queryKey: ['community-clips'],
    queryFn: () => base44.entities.CommunityClip.filter({ is_public: true }, '-created_date', 100)
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
        {/* Header Section */}
        <div style={{
          background: 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)',
          borderRadius: '15px',
          padding: '40px',
          marginBottom: '30px',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.2)',
          textAlign: 'center'
        }}>
          <Users className="inline-block w-16 h-16 text-white mb-4" />
          <h1 style={{ color: 'white', fontSize: '2.5rem', marginBottom: '10px' }}>
            🎨 Community Library
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.95)', fontSize: '1.2rem', marginBottom: '20px' }}>
            Free-Use Clips for Cross-Platform Collaboration
          </p>
          {user && (
            <Button
              onClick={() => setShowUploadModal(true)}
              className="h-14 bg-white hover:bg-gray-100 text-green-600 font-bold text-lg"
            >
              <Upload className="w-5 h-5 mr-2" />
              Share Your Clip
            </Button>
          )}
        </div>

        {/* Search & Filter */}
        <div style={{ marginBottom: '30px', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '300px', position: 'relative' }}>
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search clips by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-base"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-64 h-12">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Clips Grid */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '15px',
          padding: '30px',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.2)'
        }}>
          <h2 style={{ color: '#4a2c1f', fontSize: '1.5rem', marginBottom: '20px' }}>
            Available Clips ({filteredClips.length})
          </h2>

          {filteredClips.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              <p style={{ fontSize: '1.2rem' }}>No clips found. Be the first to contribute!</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
              {filteredClips.map(clip => (
                <ClipCard key={clip.id} clip={clip} />
              ))}
            </div>
          )}
        </div>
      </div>

      {showUploadModal && user && (
        <UploadModal 
          user={user} 
          onClose={() => setShowUploadModal(false)} 
        />
      )}

      <Footer />
    </div>
  );
}

function ClipCard({ clip }) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div style={{
      background: 'rgba(74, 222, 128, 0.1)',
      border: '2px solid #4ade80',
      borderRadius: '12px',
      padding: '20px',
      transition: 'all 0.3s'
    }}>
      <div style={{ marginBottom: '15px' }}>
        {clip.clip_type === 'video' ? (
          <Video className="w-10 h-10 text-green-600" />
        ) : (
          <Music className="w-10 h-10 text-green-600" />
        )}
      </div>
      
      <h3 style={{ color: '#4a2c1f', fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '10px' }}>
        {clip.title}
      </h3>
      
      <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '10px' }}>
        <div>Category: <strong>{clip.category}</strong></div>
        <div>Duration: <strong>{clip.duration}s</strong></div>
        <div>Uses: <strong>{clip.total_uses || 0}</strong></div>
      </div>

      <Button
        onClick={() => setIsPlaying(!isPlaying)}
        className="w-full bg-green-500 hover:bg-green-600 text-white"
        size="sm"
      >
        <Play className="w-4 h-4 mr-2" />
        {isPlaying ? 'Playing...' : 'Preview'}
      </Button>

      {isPlaying && (
        <div style={{ marginTop: '10px' }}>
          {clip.clip_type === 'video' ? (
            <video controls autoPlay style={{ width: '100%', borderRadius: '8px' }}>
              <source src={clip.clip_url} />
            </video>
          ) : (
            <audio controls autoPlay style={{ width: '100%' }}>
              <source src={clip.clip_url} />
            </audio>
          )}
        </div>
      )}
    </div>
  );
}

function UploadModal({ user, onClose }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [clipType, setClipType] = useState('video');
  const [isUploading, setIsUploading] = useState(false);

  const queryClient = useQueryClient();

  const uploadClip = useMutation({
    mutationFn: async (clipData) => {
      return await base44.entities.CommunityClip.create(clipData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['community-clips']);
      onClose();
    }
  });

  const handleFileUpload = async (file) => {
    if (!file || !title || !category) {
      alert('Please fill in all fields');
      return;
    }

    setIsUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      
      const duration = 30; // Default, could be calculated
      
      await uploadClip.mutateAsync({
        title,
        clip_type: clipType,
        clip_url: file_url,
        category,
        duration,
        uploaded_by: user.email,
        is_public: true
      });

      alert('🎉 Clip uploaded to Community Library!');
    } catch (err) {
      alert('Upload failed: ' + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const categories = [
    'Sound Effects', 'Music Loops', 'Drum Beats', 'Bass Lines',
    'Vocal Samples', 'Comedy Clips', 'Transition Videos', 'Other'
  ];

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'white',
          borderRadius: '15px',
          padding: '40px',
          maxWidth: '600px',
          width: '90%',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3)'
        }}
      >
        <h2 style={{ color: '#4a2c1f', fontSize: '1.8rem', marginBottom: '20px' }}>
          📤 Share to Community Library
        </h2>
        
        <p style={{ color: '#666', marginBottom: '20px', lineHeight: '1.6' }}>
          By uploading, you grant all CityBlocks members permission to use your clip in their brownstones. Let's collaborate!
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Input
            placeholder="Clip Title (e.g., 'Epic Drum Roll', 'Laugh Track #5')"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="h-12"
          />

          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={clipType} onValueChange={setClipType}>
            <SelectTrigger className="h-12">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="video">Video Clip</SelectItem>
              <SelectItem value="audio">Audio Clip</SelectItem>
            </SelectContent>
          </Select>

          <label style={{ 
            padding: '20px',
            background: '#4ade80',
            color: 'white',
            borderRadius: '8px',
            textAlign: 'center',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '1.1rem'
          }}>
            <input
              type="file"
              accept={clipType === 'video' ? 'video/*' : 'audio/*'}
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) handleFileUpload(file);
              }}
              style={{ display: 'none' }}
              disabled={isUploading}
            />
            {isUploading ? 'Uploading...' : '📁 Choose File to Upload'}
          </label>

          <div style={{ display: 'flex', gap: '15px' }}>
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 h-12"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}