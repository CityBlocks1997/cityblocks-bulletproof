import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Flag, X } from 'lucide-react';

export default function ReportButton({ brownstone, currentUser }) {
  const [showModal, setShowModal] = useState(false);
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');

  const queryClient = useQueryClient();

  const submitReport = useMutation({
    mutationFn: async () => {
      await base44.entities.Report.create({
        brownstone_id: brownstone.id,
        reporter_email: currentUser.email,
        reason,
        description
      });
      
      await base44.entities.Brownstone.update(brownstone.id, {
        is_flagged: true,
        total_reports: (brownstone.total_reports || 0) + 1
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['brownstone']);
      setShowModal(false);
      setReason('');
      setDescription('');
      alert('Report submitted. Our team will review this content.');
    }
  });

  if (!currentUser) return null;

  return (
    <>
      <Button
        onClick={() => setShowModal(true)}
        variant="outline"
        className="h-12 font-semibold border-red-300 text-red-600 hover:bg-red-50"
      >
        <Flag className="w-5 h-5 mr-2" />
        Report
      </Button>

      {showModal && (
        <div
          onClick={() => setShowModal(false)}
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
              padding: '30px',
              maxWidth: '500px',
              width: '90%',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ color: '#ef4444', fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Flag className="w-6 h-6" />
                Report Content
              </h2>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <p style={{ color: '#666', marginBottom: '20px' }}>
              Report inappropriate content to help keep CityBlocks safe and compliant.
            </p>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#4a2c1f' }}>
                Reason for Report
              </label>
              <Select value={reason} onValueChange={setReason}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Copyright Infringement">Copyright Infringement</SelectItem>
                  <SelectItem value="Inappropriate Content">Inappropriate Content</SelectItem>
                  <SelectItem value="Spam">Spam</SelectItem>
                  <SelectItem value="Harassment">Harassment</SelectItem>
                  <SelectItem value="Terms of Service Violation">Terms of Service Violation</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#4a2c1f' }}>
                Additional Details (Optional)
              </label>
              <Textarea
                placeholder="Provide more information about this report..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-24"
              />
            </div>

            <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
              <Button
                onClick={() => setShowModal(false)}
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                onClick={() => submitReport.mutate()}
                disabled={!reason || submitReport.isPending}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                Submit Report
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}