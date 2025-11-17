import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { RotateCw, CheckCircle, XCircle, Clock, TrendingUp } from 'lucide-react';

const WINDOW_LABELS = {
  1: "You're on Stage!",
  2: "Lights, Camera, Action!",
  3: "The Show Must Go On",
  4: "Break a Leg!",
  5: "Wonderful, Wonderful!",
  6: "Let's Go on with the Show!",
  7: "Quiet on the Set!",
  8: "Action!",
  9: "Cue the Lights!",
  10: "Bring Up the Curtain",
  11: "Your Time is Now!",
  12: "Presenting!..."
};

export default function RotationQueueManager() {
  const queryClient = useQueryClient();
  const [expandedWindow, setExpandedWindow] = useState(null);

  const { data: config } = useQuery({
    queryKey: ['homepage-config'],
    queryFn: async () => {
      const configs = await base44.entities.HomepageConfig.list();
      return configs.length > 0 ? configs[0] : null;
    }
  });

  const { data: allBrownstones = [] } = useQuery({
    queryKey: ['published-brownstones-queue'],
    queryFn: () => base44.entities.Brownstone.filter({ 
      is_published: true, 
      is_disabled: false 
    }, '-created_date', 200),
  });

  const rotateNextMutation = useMutation({
    mutationFn: async ({ windowNum }) => {
      // Get ALL brownstones, sorted by least recently featured
      const sortedBrownstones = allBrownstones
        .sort((a, b) => {
          const aTime = a.last_featured_date ? new Date(a.last_featured_date).getTime() : 0;
          const bTime = b.last_featured_date ? new Date(b.last_featured_date).getTime() : 0;
          return aTime - bTime; // oldest first
        });

      if (sortedBrownstones.length === 0) {
        throw new Error('No brownstones available');
      }

      const nextBrownstone = sortedBrownstones[0];

      // Update homepage config
      const data = { [`window_${windowNum}_brownstone_id`]: nextBrownstone.id };
      
      if (config) {
        await base44.entities.HomepageConfig.update(config.id, data);
      } else {
        await base44.entities.HomepageConfig.create(data);
      }

      // Update last_featured_date on the brownstone
      await base44.entities.Brownstone.update(nextBrownstone.id, {
        last_featured_date: new Date().toISOString(),
        is_featured: true
      });

      // Unflag the previous brownstone if different
      const prevId = config?.[`window_${windowNum}_brownstone_id`];
      if (prevId && prevId !== nextBrownstone.id) {
        await base44.entities.Brownstone.update(prevId, {
          is_featured: false
        });
      }

      return { nextBrownstone, windowNum };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['homepage-config']);
      queryClient.invalidateQueries(['published-brownstones-queue']);
      alert(`✅ Rotated to @${data.nextBrownstone.username} in Window #${data.windowNum}`);
    },
    onError: (error) => {
      alert(`❌ ${error.message}`);
    }
  });

  const getQueue = () => {
    return allBrownstones
      .sort((a, b) => {
        const aTime = a.last_featured_date ? new Date(a.last_featured_date).getTime() : 0;
        const bTime = b.last_featured_date ? new Date(b.last_featured_date).getTime() : 0;
        return aTime - bTime;
      });
  };

  const getCurrentBrownstone = (windowNum) => {
    const id = config?.[`window_${windowNum}_brownstone_id`];
    return allBrownstones.find(b => b.id === id);
  };

  const getNextInQueue = () => {
    const queue = getQueue();
    return queue[0];
  };

  const queue = getQueue();
  const nextInQueue = getNextInQueue();

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(139, 90, 60, 0.1) 100%)',
      borderRadius: '12px',
      padding: '30px',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
      marginBottom: '30px',
      border: '2px solid #d4af37'
    }}>
      <h2 style={{ fontSize: '1.8rem', color: '#4a2c1f', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <RotateCw className="w-8 h-8" />
        🎬 Rotation Queue Manager
      </h2>
      <p style={{ color: '#666', marginBottom: '30px' }}>
        Click "Rotate Next" to feature the next brownstone in the queue. All categories compete for the stage!
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(num => {
          const label = WINDOW_LABELS[num];
          const current = getCurrentBrownstone(num);
          const isExpanded = expandedWindow === num;

          return (
            <div key={num} style={{
              background: 'white',
              padding: '20px',
              borderRadius: '10px',
              border: '2px solid #d4af37',
              transition: 'all 0.3s'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '15px'
              }}>
                <div>
                  <h3 style={{ color: '#4a2c1f', fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '5px' }}>
                    Window #{num}
                  </h3>
                  <div style={{ color: '#d4af37', fontWeight: 'bold', fontSize: '0.95rem' }}>
                    {label}
                  </div>
                </div>
                <div style={{
                  background: queue.length > 0 ? 'rgba(76, 175, 80, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                  padding: '5px 12px',
                  borderRadius: '20px',
                  fontSize: '0.85rem',
                  fontWeight: 'bold',
                  color: queue.length > 0 ? '#2d5016' : '#dc2626'
                }}>
                  {queue.length} in queue
                </div>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '5px', fontWeight: 'bold' }}>
                  Currently Featured:
                </div>
                {current ? (
                  <div style={{
                    background: 'rgba(212, 175, 55, 0.15)',
                    padding: '10px',
                    borderRadius: '6px',
                    border: '1px solid #d4af37'
                  }}>
                    <div style={{ fontWeight: 'bold', color: '#4a2c1f' }}>
                      @{current.username}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#666' }}>
                      {current.display_name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#888', marginTop: '3px' }}>
                      {current.category}
                    </div>
                    {current.last_featured_date && (
                      <div style={{ fontSize: '0.75rem', color: '#888', marginTop: '5px' }}>
                        <Clock className="w-3 h-3 inline mr-1" />
                        Featured: {new Date(current.last_featured_date).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{ color: '#999', fontStyle: 'italic', fontSize: '0.9rem' }}>
                    No brownstone featured yet
                  </div>
                )}
              </div>

              <div style={{ marginBottom: '15px' }}>
                <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '5px', fontWeight: 'bold' }}>
                  Next in Queue:
                </div>
                {nextInQueue ? (
                  <div style={{
                    background: 'rgba(76, 175, 80, 0.1)',
                    padding: '10px',
                    borderRadius: '6px',
                    border: '1px solid #4ade80'
                  }}>
                    <div style={{ fontWeight: 'bold', color: '#4a2c1f' }}>
                      @{nextInQueue.username}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#666' }}>
                      {nextInQueue.display_name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#888', marginTop: '3px' }}>
                      {nextInQueue.category}
                    </div>
                    {nextInQueue.last_featured_date ? (
                      <div style={{ fontSize: '0.75rem', color: '#4ade80', marginTop: '5px' }}>
                        <TrendingUp className="w-3 h-3 inline mr-1" />
                        Last: {new Date(nextInQueue.last_featured_date).toLocaleDateString()}
                      </div>
                    ) : (
                      <div style={{ fontSize: '0.75rem', color: '#4ade80', marginTop: '5px', fontWeight: 'bold' }}>
                        ⭐ Never featured!
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{ color: '#ef4444', fontStyle: 'italic', fontSize: '0.9rem' }}>
                    No brownstones in queue
                  </div>
                )}
              </div>

              <Button
                onClick={() => rotateNextMutation.mutate({ windowNum: num })}
                disabled={queue.length === 0 || rotateNextMutation.isPending}
                className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-bold"
              >
                <RotateCw className="w-5 h-5 mr-2" />
                Rotate Next
              </Button>

              {queue.length > 1 && (
                <Button
                  onClick={() => setExpandedWindow(isExpanded ? null : num)}
                  variant="outline"
                  className="w-full mt-2 h-10"
                >
                  {isExpanded ? 'Hide' : 'View'} Full Queue ({queue.length})
                </Button>
              )}

              {isExpanded && (
                <div style={{
                  marginTop: '15px',
                  maxHeight: '200px',
                  overflowY: 'auto',
                  border: '1px solid #e5e5e5',
                  borderRadius: '6px',
                  padding: '10px'
                }}>
                  {queue.map((b, idx) => (
                    <div key={b.id} style={{
                      padding: '8px',
                      marginBottom: '5px',
                      background: idx === 0 ? 'rgba(76, 175, 80, 0.1)' : '#f9f9f9',
                      borderRadius: '4px',
                      fontSize: '0.85rem'
                    }}>
                      <span style={{ fontWeight: 'bold' }}>#{idx + 1}</span> @{b.username}
                      <span style={{ color: '#666', fontSize: '0.75rem', marginLeft: '5px' }}>
                        ({b.category})
                      </span>
                      {b.last_featured_date && (
                        <span style={{ color: '#888', fontSize: '0.75rem', marginLeft: '8px' }}>
                          ({new Date(b.last_featured_date).toLocaleDateString()})
                        </span>
                      )}
                      {!b.last_featured_date && (
                        <span style={{ color: '#4ade80', fontSize: '0.75rem', marginLeft: '8px', fontWeight: 'bold' }}>
                          (New!)
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{
        marginTop: '30px',
        padding: '20px',
        background: '#f0f8ff',
        borderRadius: '10px',
        border: '2px solid #4a90e2'
      }}>
        <h3 style={{ color: '#4a2c1f', marginBottom: '10px', fontWeight: 'bold' }}>
          🎭 How the Stage Works:
        </h3>
        <ul style={{ color: '#666', lineHeight: '1.8', fontSize: '0.95rem' }}>
          <li>🎬 ALL brownstones (any category) compete for the 12 stage windows</li>
          <li>⭐ Least recently featured brownstones get priority</li>
          <li>🎪 New creators who've never been featured get top billing</li>
          <li>🔄 Click "Rotate Next" to bring the next creator onto the stage</li>
          <li>📊 View full queue to see who's waiting in the wings</li>
          <li>🏛️ After their spotlight, creators remain in their category directory</li>
        </ul>
      </div>
    </div>
  );
}