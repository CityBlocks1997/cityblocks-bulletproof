import React from 'react';

export default function SiteStructureDocs() {
  return (
    <div style={{ fontFamily: 'monospace', padding: '40px', maxWidth: '1200px', margin: '0 auto', background: '#f5f5f5' }}>
      <h1>🏛️ CityBlocks Site Structure & Page Flow</h1>

      <section style={{ marginBottom: '40px', background: 'white', padding: '20px', borderRadius: '8px' }}>
        <h2>📁 FILE STRUCTURE</h2>
        <pre style={{ background: '#1e1e1e', color: '#d4d4d4', padding: '20px', borderRadius: '8px', overflow: 'auto' }}>
{`cityblocks/
├── entities/
│   ├── Brownstone.json          [Creator profile with 12 windows]
│   ├── HomepageConfig.json      [Homepage featured brownstones]
│   ├── Video.json               [Individual video metadata]
│   ├── Creator.json             [Creator info]
│   ├── Like.json                [User likes/favorites]
│   ├── CommunityClip.json       [Shared audio/video clips]
│   └── Report.json              [Content moderation reports]
│
├── pages/
│   ├── Home.js                  [Main landing page]
│   ├── UserBrownstone.js        [Individual creator page]
│   ├── Directory.js             [Browse all creators]
│   ├── Customize.js             [Create/edit brownstone]
│   ├── AdminDashboard.js        [Admin panel]
│   ├── CommunityLibrary.js      [Shared clips]
│   ├── BrownstonePlayers.js     [Legacy player - unused]
│   └── Terms.js                 [Terms of service]
│
└── components/
    ├── Header.js                [Navigation bar]
    ├── Footer.js                [Footer with trademarks]
    ├── LeftSidebar.js           [How It Works, Top Creators]
    ├── RightSidebar.js          [Category explorer]
    ├── VideoWindow.js           [Individual video player]
    ├── SequentialDimensionalGrid.js  [Grid layout calculator]
    ├── WindowContentSelector.js [Content upload/select]
    ├── AdobeStyleControls.js    [Facade color/image picker]
    ├── ReportButton.js          [Report content modal]
    ├── RotationQueueManager.js  [Admin featured rotation]
    ├── HomepageManager.js       [Admin homepage config]
    └── [Various Modals...]`}
        </pre>
      </section>

      <section style={{ marginBottom: '40px', background: 'white', padding: '20px', borderRadius: '8px' }}>
        <h2>🗺️ PAGE FLOW DIAGRAM</h2>
        <pre style={{ background: '#1e1e1e', color: '#4ade80', padding: '20px', borderRadius: '8px', overflow: 'auto', fontSize: '14px' }}>
{`┌─────────────────────────────────────────────────────────────┐
│              HEADER (all pages)                              │
│  [Home] [Directory] [Library] [Edit/Create] [Admin]        │
└─────────────────────────────────────────────────────────────┘
                        │
          ┌─────────────┴─────────────┐
          │                           │
  ┌───────▼────────┐          ┌──────▼───────┐
  │   HOME PAGE    │          │   DIRECTORY  │
  │  (Featured 12) │          │ (All Creators)│
  └───────┬────────┘          └──────┬───────┘
          │                           │
          │   Click Window/Card       │
          └───────────┬───────────────┘
                      │
          ┌───────────▼─────────────┐
          │   USER BROWNSTONE       │
          │  (@username's page)     │
          │  - 12 video windows     │
          │  - Playback controls    │
          │  - Like/Share/Report    │
          └───────────┬─────────────┘
                      │
          ┌───────────┴───────────┐
          │                       │
  ┌───────▼────────┐      ┌──────▼────────┐
  │   CUSTOMIZE    │      │  COMMUNITY    │
  │  (Create/Edit) │      │   LIBRARY     │
  └───────┬────────┘      └───────────────┘
          │
          │ [Admin Users Only]
          │
  ┌───────▼────────┐
  │ ADMIN DASHBOARD│
  │ - Moderation   │
  │ - Rotation     │
  └────────────────┘`}
        </pre>
      </section>

      <section style={{ marginBottom: '40px', background: 'white', padding: '20px', borderRadius: '8px' }}>
        <h2>📄 PAGE DETAILS</h2>
        
        <div style={{ marginBottom: '30px', padding: '15px', background: '#e8f5e9', borderRadius: '8px' }}>
          <h3 style={{ color: '#2e7d32' }}>✅ HOME PAGE (pages/Home.js)</h3>
          <p><strong>Purpose:</strong> Main landing page with 12 featured creators</p>
          <ul>
            <li>12-window brownstone (1 per category)</li>
            <li>Playback: Sequential, Random, Cacophony, Custom, Busker Mode™, Sequential Dimensional™</li>
            <li>Left sidebar: How It Works, Top Creators</li>
            <li>Right sidebar: Category explorer</li>
          </ul>
          <p><strong>Links to:</strong> UserBrownstone, Directory, CommunityLibrary, Customize, AdminDashboard</p>
        </div>

        <div style={{ marginBottom: '30px', padding: '15px', background: '#e8f5e9', borderRadius: '8px' }}>
          <h3 style={{ color: '#2e7d32' }}>✅ USER BROWNSTONE (pages/UserBrownstone.js)</h3>
          <p><strong>Purpose:</strong> Individual creator showcase</p>
          <p><strong>URL:</strong> /UserBrownstone?username=&lt;username&gt;</p>
          <ul>
            <li>Creator's 12-window brownstone</li>
            <li>All playback modes + Sequential Dimensional™ grid</li>
            <li>Like/Share/Report buttons</li>
            <li>Modals: About (door), Collaborate (left), For Hire (right)</li>
            <li>Busker character animation</li>
          </ul>
        </div>

        <div style={{ marginBottom: '30px', padding: '15px', background: '#e8f5e9', borderRadius: '8px' }}>
          <h3 style={{ color: '#2e7d32' }}>✅ DIRECTORY (pages/Directory.js)</h3>
          <p><strong>Purpose:</strong> Browse all creators</p>
          <ul>
            <li>Search by name/username</li>
            <li>Filter by 12 categories</li>
            <li>Grid view with likes</li>
            <li>Click to visit UserBrownstone</li>
          </ul>
        </div>

        <div style={{ marginBottom: '30px', padding: '15px', background: '#e8f5e9', borderRadius: '8px' }}>
          <h3 style={{ color: '#2e7d32' }}>✅ CUSTOMIZE (pages/Customize.js)</h3>
          <p><strong>Purpose:</strong> Create/edit brownstone</p>
          <ul>
            <li>Step 1: Basic Info (username, display name, category, bio)</li>
            <li>Step 2: Facade Design (color, opacity, image)</li>
            <li>Step 3: Windows & Modals (12 windows, custom text)</li>
            <li>Step 4: Preview & Publish</li>
          </ul>
        </div>

        <div style={{ marginBottom: '30px', padding: '15px', background: '#e8f5e9', borderRadius: '8px' }}>
          <h3 style={{ color: '#2e7d32' }}>✅ ADMIN DASHBOARD (pages/AdminDashboard.js)</h3>
          <p><strong>Purpose:</strong> Content moderation</p>
          <p><strong>Requires:</strong> Admin role</p>
          <ul>
            <li>Statistics overview</li>
            <li>Pending reports management</li>
            <li>Brownstone moderation (disable/enable)</li>
            <li>Rotation Queue Manager (auto-rotate featured)</li>
            <li>Homepage Manager (manually set featured 12)</li>
          </ul>
        </div>

        <div style={{ marginBottom: '30px', padding: '15px', background: '#fff3cd', borderRadius: '8px' }}>
          <h3 style={{ color: '#856404' }}>⚠️ COMMUNITY LIBRARY (pages/CommunityLibrary.js)</h3>
          <p><strong>Status:</strong> Functional but needs integration</p>
          <ul>
            <li>Browse/upload shared clips</li>
            <li>Filter by category</li>
            <li>Preview audio/video</li>
            <li><strong>Missing:</strong> Integration with Customize (use clips in windows)</li>
          </ul>
        </div>

        <div style={{ marginBottom: '30px', padding: '15px', background: '#f8d7da', borderRadius: '8px' }}>
          <h3 style={{ color: '#721c24' }}>🚧 TERMS (pages/Terms.js)</h3>
          <p><strong>Status:</strong> Basic structure, needs full legal content</p>
        </div>

        <div style={{ marginBottom: '30px', padding: '15px', background: '#f8d7da', borderRadius: '8px' }}>
          <h3 style={{ color: '#721c24' }}>🚧 BROWNSTONE PLAYERS (pages/BrownstonePlayers.js)</h3>
          <p><strong>Status:</strong> Legacy/deprecated - replaced by Home & UserBrownstone</p>
        </div>
      </section>

      <section style={{ marginBottom: '40px', background: 'white', padding: '20px', borderRadius: '8px' }}>
        <h2>🎮 USER FLOWS</h2>
        
        <div style={{ marginBottom: '20px', padding: '15px', background: '#e3f2fd', borderRadius: '8px' }}>
          <h3>New Creator Flow:</h3>
          <ol>
            <li>Visit Home → Click "Claim Your Brownstone" (Header)</li>
            <li>Customize Page → Fill 4 steps → Publish</li>
            <li>UserBrownstone (@username) → Now live in Directory</li>
          </ol>
        </div>

        <div style={{ marginBottom: '20px', padding: '15px', background: '#e3f2fd', borderRadius: '8px' }}>
          <h3>Visitor Flow:</h3>
          <ol>
            <li>Home → Play featured videos → Click window</li>
            <li>UserBrownstone → Watch creator's work → Like/Share</li>
            <li>Directory → Browse more creators → Repeat</li>
          </ol>
        </div>

        <div style={{ marginBottom: '20px', padding: '15px', background: '#ffebee', borderRadius: '8px' }}>
          <h3>Admin Flow:</h3>
          <ol>
            <li>Admin Dashboard → Review reports → Disable violations</li>
            <li>Rotation Queue Manager → Auto-rotate featured creators</li>
            <li>Homepage Manager → Manually curate featured 12</li>
          </ol>
        </div>
      </section>

      <section style={{ marginBottom: '40px', background: 'white', padding: '20px', borderRadius: '8px' }}>
        <h2>📊 COMPLETION STATUS</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#2e7d32', color: 'white' }}>
              <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Page/Feature</th>
              <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Status</th>
              <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Notes</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>Home</td>
              <td style={{ padding: '10px', border: '1px solid #ddd', background: '#e8f5e9' }}>✅ Complete</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>All playback modes working</td>
            </tr>
            <tr>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>UserBrownstone</td>
              <td style={{ padding: '10px', border: '1px solid #ddd', background: '#e8f5e9' }}>✅ Complete</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>Full video playback + modals</td>
            </tr>
            <tr>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>Directory</td>
              <td style={{ padding: '10px', border: '1px solid #ddd', background: '#e8f5e9' }}>✅ Complete</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>Search/filter working</td>
            </tr>
            <tr>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>Customize</td>
              <td style={{ padding: '10px', border: '1px solid #ddd', background: '#e8f5e9' }}>✅ Complete</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>4-step wizard functional</td>
            </tr>
            <tr>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>AdminDashboard</td>
              <td style={{ padding: '10px', border: '1px solid #ddd', background: '#e8f5e9' }}>✅ Complete</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>All moderation tools working</td>
            </tr>
            <tr>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>CommunityLibrary</td>
              <td style={{ padding: '10px', border: '1px solid #ddd', background: '#fff3cd' }}>⚠️ Partial</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>Needs Customize integration</td>
            </tr>
            <tr>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>Terms</td>
              <td style={{ padding: '10px', border: '1px solid #ddd', background: '#f8d7da' }}>🚧 Incomplete</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>Needs legal content</td>
            </tr>
            <tr>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>Creator Analytics</td>
              <td style={{ padding: '10px', border: '1px solid #ddd', background: '#f8d7da' }}>❌ Missing</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>No stats dashboard</td>
            </tr>
            <tr>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>Social Features</td>
              <td style={{ padding: '10px', border: '1px solid #ddd', background: '#f8d7da' }}>❌ Missing</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>No follow/comments</td>
            </tr>
            <tr>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>Monetization</td>
              <td style={{ padding: '10px', border: '1px solid #ddd', background: '#f8d7da' }}>❌ Missing</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>No payment system</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section style={{ background: '#e3f2fd', padding: '20px', borderRadius: '8px' }}>
        <h2>🎯 PROJECT COMPLETION: ~65-70%</h2>
        <p><strong>Core platform is functional, missing:</strong></p>
        <ul>
          <li>Creator analytics dashboard</li>
          <li>Social engagement features</li>
          <li>Monetization infrastructure</li>
          <li>Email notifications</li>
          <li>Advanced search/discovery</li>
          <li>Performance optimization</li>
        </ul>
      </section>
    </div>
  );
}