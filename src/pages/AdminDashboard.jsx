import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, AlertTriangle, Eye, Ban, CheckCircle, XCircle, Search, Mail, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import Header from '../components/Header';
import Footer from '../components/Footer';
import RotationQueueManager from '../components/RotationQueueManager';

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedBrownstone, setSelectedBrownstone] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [actionReason, setActionReason] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const queryClient = useQueryClient();

  useEffect(() => {
    async function checkAdmin() {
      try {
        const currentUser = await base44.auth.me();
        if (currentUser.role !== 'admin') {
          window.location.href = '/';
          return;
        }
        setUser(currentUser);
      } catch (err) {
        base44.auth.redirectToLogin(window.location.href);
      }
    }
    checkAdmin();
  }, []);

  const { data: brownstones = [] } = useQuery({
    queryKey: ['admin-brownstones'],
    queryFn: () => base44.entities.Brownstone.list('-updated_date', 100),
    enabled: !!user
  });

  const { data: reports = [] } = useQuery({
    queryKey: ['admin-reports'],
    queryFn: () => base44.entities.Report.list('-created_date', 100),
    enabled: !!user
  });

  const disableBrownstone = useMutation({
    mutationFn: async ({ brownstoneId, reason }) => {
      const brownstone = brownstones.find(b => b.id === brownstoneId);
      await base44.entities.Brownstone.update(brownstoneId, {
        is_disabled: true,
        is_published: false,
        disabled_reason: reason
      });
      
      await base44.integrations.Core.SendEmail({
        to: brownstone.user_email,
        subject: 'CityBlocks - Content Moderation Notice',
        body: `Dear ${brownstone.display_name},

Your brownstone (@${brownstone.username}) has been disabled for the following reason:

${reason}

If you believe this was a mistake or would like to appeal, please contact support@cityblocks.com.

Best regards,
CityBlocks Team`
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-brownstones']);
      setSelectedBrownstone(null);
      setActionReason('');
    }
  });

  const enableBrownstone = useMutation({
    mutationFn: async (brownstoneId) => {
      await base44.entities.Brownstone.update(brownstoneId, {
        is_disabled: false,
        is_published: true,
        disabled_reason: ''
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-brownstones']);
      setSelectedBrownstone(null);
    }
  });

  const deleteBrownstone = useMutation({
    mutationFn: async (brownstoneId) => {
      await base44.entities.Brownstone.delete(brownstoneId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-brownstones']);
      setDeleteConfirm(null);
    }
  });

  const updateReport = useMutation({
    mutationFn: async ({ reportId, status, action, notes }) => {
      await base44.entities.Report.update(reportId, {
        status,
        action_taken: action,
        admin_notes: notes,
        reviewed_by: user.email
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-reports']);
      setSelectedReport(null);
    }
  });

  const filteredBrownstones = brownstones.filter(b => {
    const matchesSearch = b.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         b.display_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         b.user_email?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterStatus === 'flagged') return matchesSearch && b.is_flagged;
    if (filterStatus === 'disabled') return matchesSearch && b.is_disabled;
    if (filterStatus === 'published') return matchesSearch && b.is_published && !b.is_disabled;
    return matchesSearch;
  });

  const pendingReports = reports.filter(r => r.status === 'pending');

  if (!user) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;
  }

  return (
    <div style={{ fontFamily: 'Georgia, serif', minHeight: '100vh', background: '#F5F1E8' }}>
      <Header />

      <div style={{ maxWidth: '1400px', margin: '40px auto', padding: '0 20px' }}>
        <div style={{
          background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
          borderRadius: '15px',
          padding: '30px',
          marginBottom: '30px',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <Shield className="w-12 h-12 text-white" />
            <div>
              <h1 style={{ color: 'white', fontSize: '2rem', marginBottom: '5px' }}>
                Admin Dashboard
              </h1>
              <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '1rem' }}>
                Queue Rotation & Content Moderation
              </p>
            </div>
          </div>
        </div>

        <RotationQueueManager />

        {/* Stats Overview */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
          <StatCard 
            icon={<Eye className="w-8 h-8" />}
            label="Total Brownstones"
            value={brownstones.length}
            color="#4ade80"
          />
          <StatCard 
            icon={<AlertTriangle className="w-8 h-8" />}
            label="Pending Reports"
            value={pendingReports.length}
            color="#f59e0b"
          />
          <StatCard 
            icon={<Ban className="w-8 h-8" />}
            label="Disabled Content"
            value={brownstones.filter(b => b.is_disabled).length}
            color="#ef4444"
          />
          <StatCard 
            icon={<CheckCircle className="w-8 h-8" />}
            label="Published Content"
            value={brownstones.filter(b => b.is_published && !b.is_disabled).length}
            color="#06b6d4"
          />
        </div>

        {/* Pending Reports Section */}
        {pendingReports.length > 0 && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '3px solid #ef4444',
            borderRadius: '15px',
            padding: '25px',
            marginBottom: '30px'
          }}>
            <h2 style={{ color: '#ef4444', fontSize: '1.5rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <AlertTriangle className="w-6 h-6" />
              Urgent: Pending Reports ({pendingReports.length})
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {pendingReports.map(report => {
                const brownstone = brownstones.find(b => b.id === report.brownstone_id);
                return (
                  <div
                    key={report.id}
                    style={{
                      background: 'white',
                      borderRadius: '10px',
                      padding: '20px',
                      border: '2px solid #fecaca'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ color: '#4a2c1f', fontSize: '1.2rem', marginBottom: '10px' }}>
                          @{brownstone?.username} - {brownstone?.display_name}
                        </h3>
                        <p style={{ color: '#666', marginBottom: '10px' }}>
                          <strong>Reason:</strong> {report.reason}
                        </p>
                        {report.description && (
                          <p style={{ color: '#666', marginBottom: '10px' }}>
                            <strong>Details:</strong> {report.description}
                          </p>
                        )}
                        <p style={{ color: '#888', fontSize: '0.9rem' }}>
                          Reported by: {report.reporter_email} on {new Date(report.created_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <Button
                          onClick={() => setSelectedReport(report)}
                          className="bg-blue-500 hover:bg-blue-600 text-white"
                        >
                          Review
                        </Button>
                        <Button
                          onClick={() => {
                            setSelectedBrownstone(brownstone);
                            setSelectedReport(report);
                          }}
                          className="bg-red-500 hover:bg-red-600 text-white"
                        >
                          Take Action
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Search & Filter */}
        <div style={{ marginBottom: '30px', display: 'flex', gap: '20px' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search by username, display name, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-base"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-48 h-12">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Content</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="flagged">Flagged</SelectItem>
              <SelectItem value="disabled">Disabled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Brownstones List */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '15px',
          padding: '30px',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.2)'
        }}>
          <h2 style={{ color: '#4a2c1f', fontSize: '1.5rem', marginBottom: '20px' }}>
            All Brownstones ({filteredBrownstones.length})
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {filteredBrownstones.map(brownstone => (
              <div
                key={brownstone.id}
                style={{
                  padding: '20px',
                  background: brownstone.is_disabled ? 'rgba(239, 68, 68, 0.1)' : 
                             brownstone.is_flagged ? 'rgba(245, 158, 11, 0.1)' : 
                             'rgba(74, 222, 128, 0.1)',
                  borderRadius: '10px',
                  border: `2px solid ${brownstone.is_disabled ? '#ef4444' : 
                                      brownstone.is_flagged ? '#f59e0b' : 
                                      '#4ade80'}`
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ color: '#4a2c1f', fontSize: '1.2rem', marginBottom: '10px' }}>
                      @{brownstone.username} - {brownstone.display_name}
                    </h3>
                    <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginBottom: '10px' }}>
                      <span style={{ color: '#666' }}>
                        <strong>Email:</strong> {brownstone.user_email}
                      </span>
                      <span style={{ color: '#666' }}>
                        <strong>Category:</strong> {brownstone.category}
                      </span>
                      <span style={{ color: '#666' }}>
                        <strong>Likes:</strong> {brownstone.total_likes || 0}
                      </span>
                      <span style={{ color: '#666' }}>
                        <strong>Reports:</strong> {brownstone.total_reports || 0}
                      </span>
                    </div>
                    {brownstone.is_disabled && (
                      <p style={{ color: '#ef4444', marginTop: '10px' }}>
                        <strong>Disabled Reason:</strong> {brownstone.disabled_reason}
                      </p>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
                    <Link to={createPageUrl(`UserBrownstone?username=${brownstone.username}`)}>
                      <Button
                        className="bg-blue-500 hover:bg-blue-600 text-white w-full"
                        size="sm"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                    </Link>
                    {brownstone.is_disabled ? (
                      <Button
                        onClick={() => enableBrownstone.mutate(brownstone.id)}
                        disabled={enableBrownstone.isPending}
                        className="bg-green-500 hover:bg-green-600 text-white"
                        size="sm"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Enable
                      </Button>
                    ) : (
                      <Button
                        onClick={() => setSelectedBrownstone(brownstone)}
                        className="bg-red-500 hover:bg-red-600 text-white"
                        size="sm"
                      >
                        <Ban className="w-4 h-4 mr-2" />
                        Disable
                      </Button>
                    )}
                    <Button
                      onClick={() => setDeleteConfirm(brownstone)}
                      className="bg-gray-800 hover:bg-gray-900 text-white"
                      size="sm"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Disable Brownstone Modal */}
      {selectedBrownstone && !deleteConfirm && (
        <div
          onClick={() => setSelectedBrownstone(null)}
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
              maxWidth: '600px',
              width: '90%',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3)'
            }}
          >
            <h2 style={{ color: '#ef4444', fontSize: '1.5rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Ban className="w-6 h-6" />
              Disable Brownstone
            </h2>
            <p style={{ color: '#666', marginBottom: '20px' }}>
              You are about to disable <strong>@{selectedBrownstone.username}</strong>. This will hide the content and notify the user via email.
            </p>
            <Textarea
              placeholder="Reason for disabling (will be sent to the user)..."
              value={actionReason}
              onChange={(e) => setActionReason(e.target.value)}
              className="mb-4 min-h-32"
            />
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
              <Button
                onClick={() => {
                  setSelectedBrownstone(null);
                  setActionReason('');
                }}
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                onClick={() => disableBrownstone.mutate({
                  brownstoneId: selectedBrownstone.id,
                  reason: actionReason
                })}
                disabled={!actionReason || disableBrownstone.isPending}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                <Mail className="w-4 h-4 mr-2" />
                Disable & Notify User
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div
          onClick={() => setDeleteConfirm(null)}
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
            <h2 style={{ color: '#ef4444', fontSize: '1.5rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Trash2 className="w-6 h-6" />
              Delete Brownstone Permanently?
            </h2>
            <p style={{ color: '#666', marginBottom: '20px' }}>
              Are you sure you want to permanently delete <strong>@{deleteConfirm.username}</strong>? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
              <Button
                onClick={() => setDeleteConfirm(null)}
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                onClick={() => deleteBrownstone.mutate(deleteConfirm.id)}
                disabled={deleteBrownstone.isPending}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Permanently
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Review Report Modal */}
      {selectedReport && !selectedBrownstone && (
        <div
          onClick={() => setSelectedReport(null)}
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
              maxWidth: '600px',
              width: '90%',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3)'
            }}
          >
            <h2 style={{ color: '#4a2c1f', fontSize: '1.5rem', marginBottom: '20px' }}>
              Review Report
            </h2>
            <div style={{ marginBottom: '20px' }}>
              <p style={{ marginBottom: '10px' }}><strong>Reason:</strong> {selectedReport.reason}</p>
              <p style={{ marginBottom: '10px' }}><strong>Description:</strong> {selectedReport.description || 'N/A'}</p>
              <p style={{ marginBottom: '10px' }}><strong>Reporter:</strong> {selectedReport.reporter_email}</p>
            </div>
            <Textarea
              placeholder="Admin notes..."
              value={actionReason}
              onChange={(e) => setActionReason(e.target.value)}
              className="mb-4 min-h-24"
            />
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
              <Button
                onClick={() => {
                  updateReport.mutate({
                    reportId: selectedReport.id,
                    status: 'dismissed',
                    action: 'none',
                    notes: actionReason
                  });
                }}
                variant="outline"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Dismiss
              </Button>
              <Button
                onClick={() => {
                  updateReport.mutate({
                    reportId: selectedReport.id,
                    status: 'resolved',
                    action: 'content_removed',
                    notes: actionReason
                  });
                }}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Resolve
              </Button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '12px',
      padding: '20px',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
      borderLeft: `5px solid ${color}`
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <div style={{ color }}>{icon}</div>
        <div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#4a2c1f' }}>{value}</div>
          <div style={{ color: '#666', fontSize: '0.9rem' }}>{label}</div>
        </div>
      </div>
    </div>
  );
}