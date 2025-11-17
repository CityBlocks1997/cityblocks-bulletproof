import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save } from 'lucide-react';

const WINDOW_CATEGORIES = {
  1: 'Animators',
  2: 'Composers',
  3: 'Cosplayers',
  4: 'Filmmakers',
  5: 'Game Developers',
  6: 'Illustrators',
  7: 'Musicians',
  8: 'Performers',
  9: 'Producers',
  10: 'Agencies',
  11: 'Voice Actors',
  12: 'Writers'
};

export default function HomepageManager() {
  const queryClient = useQueryClient();
  const [windowSelections, setWindowSelections] = useState({});

  const { data: config } = useQuery({
    queryKey: ['homepage-config'],
    queryFn: async () => {
      const configs = await base44.entities.HomepageConfig.list();
      if (configs.length > 0) {
        const cfg = configs[0];
        const selections = {};
        for (let i = 1; i <= 12; i++) {
          if (cfg[`window_${i}_brownstone_id`]) {
            selections[i] = cfg[`window_${i}_brownstone_id`];
          }
        }
        setWindowSelections(selections);
        return cfg;
      }
      return null;
    }
  });

  const { data: allBrownstones = [] } = useQuery({
    queryKey: ['all-published-brownstones'],
    queryFn: () => base44.entities.Brownstone.filter({ 
      is_published: true, 
      is_disabled: false 
    }, '-created_date', 100),
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const data = {};
      for (let i = 1; i <= 12; i++) {
        data[`window_${i}_brownstone_id`] = windowSelections[i] || null;
      }

      if (config) {
        await base44.entities.HomepageConfig.update(config.id, data);
      } else {
        await base44.entities.HomepageConfig.create(data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['homepage-config']);
      alert('✅ Homepage configuration saved!');
    }
  });

  const handleWindowChange = (windowNum, brownstoneId) => {
    setWindowSelections(prev => ({
      ...prev,
      [windowNum]: brownstoneId
    }));
  };

  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '30px',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
      marginBottom: '30px'
    }}>
      <h2 style={{ fontSize: '1.8rem', color: '#4a2c1f', marginBottom: '20px' }}>
        🏠 Homepage Featured Windows
      </h2>
      <p style={{ color: '#666', marginBottom: '30px' }}>
        Select which brownstone appears in each window on the homepage. Each window represents a category.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '30px' }}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(num => (
          <div key={num} style={{
            background: '#f9f9f9',
            padding: '20px',
            borderRadius: '10px',
            border: '2px solid #d4af37'
          }}>
            <label style={{
              display: 'block',
              fontWeight: 'bold',
              color: '#4a2c1f',
              marginBottom: '10px',
              fontSize: '1.1rem'
            }}>
              Win#{num} - {WINDOW_CATEGORIES[num]}
            </label>
            
            <Select 
              value={windowSelections[num] || ''} 
              onValueChange={(value) => handleWindowChange(num, value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a brownstone..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={null}>None</SelectItem>
                {allBrownstones.map(b => (
                  <SelectItem key={b.id} value={b.id}>
                    @{b.username} - {b.display_name} ({b.category})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {windowSelections[num] && (
              <div style={{ marginTop: '10px', fontSize: '0.9rem', color: '#666' }}>
                ✅ Selected: {allBrownstones.find(b => b.id === windowSelections[num])?.username}
              </div>
            )}
          </div>
        ))}
      </div>

      <Button
        onClick={() => saveMutation.mutate()}
        disabled={saveMutation.isPending}
        className="h-14 bg-green-600 hover:bg-green-700 text-white font-bold text-lg"
      >
        <Save className="w-5 h-5 mr-2" />
        {saveMutation.isPending ? 'Saving...' : 'Save Homepage Configuration'}
      </Button>

      <div style={{
        marginTop: '30px',
        padding: '20px',
        background: '#f0f8ff',
        borderRadius: '10px',
        border: '2px solid #4a90e2'
      }}>
        <h3 style={{ color: '#4a2c1f', marginBottom: '10px' }}>💡 Future Automation Plan:</h3>
        <ul style={{ color: '#666', lineHeight: '1.8' }}>
          <li>✅ Manual curation (current)</li>
          <li>🔮 Submission queue with approval workflow</li>
          <li>🔮 Auto-populate approved brownstones to category windows</li>
          <li>🔮 Time-based rotation (e.g., 7-day featured period)</li>
          <li>🔮 Auto-bump to Top Ten after featured period</li>
          <li>🔮 Then move to Community Directory</li>
        </ul>
      </div>
    </div>
  );
}