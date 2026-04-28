/**
 * Site Acquisition Tracker — v0.2.0
 * Internal two-user web application for tracking live property acquisition targets.
 * Node.js / Express / SQLite3
 */

const path = require('path');
const express = require('express');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 3000;

// ---------------------------------------------------------------------------
// Database — absolute paths for systemd stability on Ubuntu NUC
// ---------------------------------------------------------------------------
const DB_PATH = path.join(__dirname, 'tracker.db');
const SESSION_DB_DIR = __dirname;

const db = new sqlite3.Database(DB_PATH);

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  store: new SQLiteStore({ dir: SESSION_DB_DIR, db: 'sessions.db' }),
  secret: 'aminvest-nuc-tracker-v02',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 } // 7 days
}));

// ---------------------------------------------------------------------------
// Users — hardcoded for v0.2 (two named internal users only)
// ---------------------------------------------------------------------------
const USERS = {
  terence: { password: 'nuc13-secure', role: 'admin' },
  allana:  { password: 'scotland-2026', role: 'standard' }
};

// ---------------------------------------------------------------------------
// Valid controlled values
// ---------------------------------------------------------------------------
const VALID_STAGES = [
  'Review', 'Progress', 'Planning Thesis Ready', 'Ownership Checked',
  'Ready for Contact', 'Contacted', 'Active Dialogue', 'Dead', 'Acquired'
];

const VALID_SITE_TYPES = [
  'Side plot', 'Corner plot', 'Large garden', 'Infill', 'Backland', 'Other'
];

const VALID_OWNERSHIP_TRACEABILITY = ['Unknown', 'Partial', 'Confirmed'];

const VALID_OWNER_CONTACTED = ['No', 'Yes'];

const VALID_EXTERNAL_SHARE_STATUS = [
  'Not shared', 'Shared externally', 'Updated since sharing'
];

// Stages that require a planning thesis of at least 10 characters (Rule 17)
const THESIS_REQUIRED_STAGES = [
  'Planning Thesis Ready', 'Ownership Checked', 'Ready for Contact',
  'Contacted', 'Active Dialogue'
];

// ---------------------------------------------------------------------------
// Auth routes
// ---------------------------------------------------------------------------
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = USERS[username];
  if (user && user.password === password) {
    req.session.user = { username, role: user.role };
    return res.redirect('/');
  }
  return res.status(401).send(`<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Login Failed</title>
<link href="https://fonts.googleapis.com/css2?family=Ubuntu:wght@400;500;700&display=swap" rel="stylesheet">
<style>body{font-family:'Ubuntu',sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#f5f5f5;}
.card{background:#fff;padding:2rem;border-radius:16px;box-shadow:0 2px 8px rgba(0,0,0,.12);text-align:center;max-width:360px;width:100%;}
h2{color:#ba1a1a;margin-bottom:.5rem;}a{color:#006a6a;}</style></head>
<body><div class="card"><h2>Login failed</h2><p>Invalid username or password.</p><p><a href="/">Try again</a></p></div></body></html>`);
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/'));
});

// ---------------------------------------------------------------------------
// Auth gate — no static files unless authenticated
// ---------------------------------------------------------------------------
app.get('/', (req, res, next) => {
  if (!req.session.user) {
    return res.send(`<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Site Acquisition Tracker — Login</title>
<link href="https://fonts.googleapis.com/css2?family=Ubuntu:wght@400;500;700&display=swap" rel="stylesheet">
<style>body{font-family:'Ubuntu',sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#f5f5f5;}
.card{background:#fff;padding:2.5rem;border-radius:16px;box-shadow:0 2px 8px rgba(0,0,0,.12);max-width:360px;width:100%;}
h1{font-size:1.25rem;margin:0 0 .25rem;color:#1c1b1f;}p.sub{color:#49454f;font-size:.875rem;margin:0 0 1.5rem;}
label{display:block;font-size:.875rem;font-weight:500;color:#49454f;margin-bottom:.25rem;}
input{width:100%;padding:.75rem;border:1px solid #79747e;border-radius:8px;font-family:inherit;font-size:.875rem;margin-bottom:1rem;box-sizing:border-box;}
input:focus{outline:2px solid #006a6a;border-color:#006a6a;}
button{width:100%;padding:.75rem;background:#006a6a;color:#fff;border:none;border-radius:24px;font-family:inherit;font-size:.875rem;font-weight:500;cursor:pointer;}
button:hover{background:#005252;}</style></head>
<body><div class="card">
<h1>Site Acquisition Tracker</h1>
<p class="sub">Internal access only</p>
<form method="POST" action="/login">
<label for="username">Username</label><input id="username" name="username" required autocomplete="username">
<label for="password">Password</label><input id="password" name="password" type="password" required autocomplete="current-password">
<button type="submit">Sign in</button>
</form></div></body></html>`);
  }
  next();
});

// Auth middleware for all routes below
function requireAuth(req, res, next) {
  if (!req.session.user) return res.status(401).json({ error: 'Not authenticated' });
  next();
}

// Block unauthenticated access to static files
app.use((req, res, next) => {
  if (!req.session.user) return res.status(401).json({ error: 'Not authenticated' });
  next();
});

// Static files served AFTER auth check
app.use(express.static(path.join(__dirname, 'public')));

// ---------------------------------------------------------------------------
// API: current user
// ---------------------------------------------------------------------------
app.get('/api/me', requireAuth, (req, res) => {
  res.json(req.session.user);
});

// ---------------------------------------------------------------------------
// Database schema
// ---------------------------------------------------------------------------
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS sites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    address TEXT,
    postcode TEXT,
    authority TEXT,
    site_type TEXT,
    current_use TEXT,
    why_use_weakening TEXT,
    physical_positives TEXT,
    physical_risks TEXT,
    location_tier TEXT,
    planning_thesis TEXT,
    planning_notes TEXT,
    ownership_type TEXT,
    ownership_traceability TEXT DEFAULT 'Unknown',
    owner_contacted TEXT DEFAULT 'No',
    next_step TEXT,
    last_action_date TEXT,
    maps_link TEXT,
    source_link TEXT,
    external_share_status TEXT DEFAULT 'Not shared',
    shared_with TEXT,
    shared_date TEXT,
    external_summary TEXT,
    notes TEXT,
    stage TEXT DEFAULT 'Review',
    owner TEXT,
    created_by TEXT,
    updated_by TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS activity_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    site_id INTEGER NOT NULL,
    action TEXT NOT NULL,
    performed_by TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (site_id) REFERENCES sites(id)
  )`);
});

// ---------------------------------------------------------------------------
// Thesis Gate — Rule 17
// ---------------------------------------------------------------------------
function validateThesisGate(stage, planningThesis) {
  if (THESIS_REQUIRED_STAGES.includes(stage)) {
    if (!planningThesis || planningThesis.trim().length < 10) {
      return 'Rule 17: A site cannot move to "' + stage +
        '" unless the planning thesis contains at least 10 characters.';
    }
  }
  return null;
}

// ---------------------------------------------------------------------------
// API: Sites CRUD
// ---------------------------------------------------------------------------

// List all sites
app.get('/api/sites', requireAuth, (req, res) => {
  db.all('SELECT * FROM sites ORDER BY updated_at DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Get single site
app.get('/api/sites/:id', requireAuth, (req, res) => {
  db.get('SELECT * FROM sites WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Site not found' });
    res.json(row);
  });
});

// Get activity log for a site
app.get('/api/sites/:id/activity', requireAuth, (req, res) => {
  db.all('SELECT * FROM activity_log WHERE site_id = ? ORDER BY created_at DESC',
    [req.params.id], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });
});

// Create site
app.post('/api/sites', requireAuth, (req, res) => {
  const b = req.body;
  const stage = b.stage || 'Review';

  // Only allow creation at Review or Progress
  if (!['Review', 'Progress'].includes(stage)) {
    return res.status(400).json({ error: 'New sites may only be created at Review or Progress stage.' });
  }

  const thesisError = validateThesisGate(stage, b.planning_thesis);
  if (thesisError) return res.status(400).json({ error: thesisError });

  if (b.site_type && !VALID_SITE_TYPES.includes(b.site_type)) {
    return res.status(400).json({ error: 'Invalid site type.' });
  }

  const user = req.session.user.username;

  db.run(`INSERT INTO sites (
    name, address, postcode, authority, site_type, current_use,
    why_use_weakening, physical_positives, physical_risks,
    location_tier, planning_thesis, planning_notes,
    ownership_type, ownership_traceability, owner_contacted,
    next_step, last_action_date, maps_link, source_link,
    external_share_status, shared_with, shared_date, external_summary,
    notes, stage, owner, created_by, updated_by
  ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
  [
    b.name, b.address, b.postcode, b.authority, b.site_type, b.current_use,
    b.why_use_weakening, b.physical_positives, b.physical_risks,
    b.location_tier, b.planning_thesis, b.planning_notes,
    b.ownership_type, b.ownership_traceability || 'Unknown',
    b.owner_contacted || 'No',
    b.next_step, b.last_action_date, b.maps_link, b.source_link,
    b.external_share_status || 'Not shared', b.shared_with, b.shared_date,
    b.external_summary, b.notes, stage, b.owner || user,
    user, user
  ], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    const siteId = this.lastID;
    db.run('INSERT INTO activity_log (site_id, action, performed_by) VALUES (?,?,?)',
      [siteId, 'Site created at ' + stage, user]);
    res.status(201).json({ id: siteId });
  });
});

// Update site
app.put('/api/sites/:id', requireAuth, (req, res) => {
  const b = req.body;
  const user = req.session.user.username;

  // First fetch current record to detect stage change
  db.get('SELECT * FROM sites WHERE id = ?', [req.params.id], (err, existing) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!existing) return res.status(404).json({ error: 'Site not found' });

    const newStage = b.stage || existing.stage;
    const newThesis = b.planning_thesis !== undefined ? b.planning_thesis : existing.planning_thesis;

    const thesisError = validateThesisGate(newStage, newThesis);
    if (thesisError) return res.status(400).json({ error: thesisError });

    if (b.site_type && !VALID_SITE_TYPES.includes(b.site_type)) {
      return res.status(400).json({ error: 'Invalid site type.' });
    }

    db.run(`UPDATE sites SET
      name=?, address=?, postcode=?, authority=?, site_type=?, current_use=?,
      why_use_weakening=?, physical_positives=?, physical_risks=?,
      location_tier=?, planning_thesis=?, planning_notes=?,
      ownership_type=?, ownership_traceability=?, owner_contacted=?,
      next_step=?, last_action_date=?, maps_link=?, source_link=?,
      external_share_status=?, shared_with=?, shared_date=?, external_summary=?,
      notes=?, stage=?, owner=?, updated_by=?, updated_at=datetime('now')
      WHERE id=?`,
    [
      b.name ?? existing.name,
      b.address ?? existing.address,
      b.postcode ?? existing.postcode,
      b.authority ?? existing.authority,
      b.site_type ?? existing.site_type,
      b.current_use ?? existing.current_use,
      b.why_use_weakening ?? existing.why_use_weakening,
      b.physical_positives ?? existing.physical_positives,
      b.physical_risks ?? existing.physical_risks,
      b.location_tier ?? existing.location_tier,
      newThesis,
      b.planning_notes ?? existing.planning_notes,
      b.ownership_type ?? existing.ownership_type,
      b.ownership_traceability ?? existing.ownership_traceability,
      b.owner_contacted ?? existing.owner_contacted,
      b.next_step ?? existing.next_step,
      b.last_action_date ?? existing.last_action_date,
      b.maps_link ?? existing.maps_link,
      b.source_link ?? existing.source_link,
      b.external_share_status ?? existing.external_share_status,
      b.shared_with ?? existing.shared_with,
      b.shared_date ?? existing.shared_date,
      b.external_summary ?? existing.external_summary,
      b.notes ?? existing.notes,
      newStage,
      b.owner ?? existing.owner,
      user,
      req.params.id
    ], function(err) {
      if (err) return res.status(500).json({ error: err.message });

      // Log stage change
      if (newStage !== existing.stage) {
        db.run('INSERT INTO activity_log (site_id, action, performed_by) VALUES (?,?,?)',
          [req.params.id, 'Stage changed from ' + existing.stage + ' to ' + newStage, user]);
      }

      res.json({ updated: this.changes });
    });
  });
});

// Update stage only (for drag-and-drop)
app.post('/api/sites/:id/stage', requireAuth, (req, res) => {
  const { stage } = req.body;
  const user = req.session.user.username;

  if (!VALID_STAGES.includes(stage)) {
    return res.status(400).json({ error: 'Invalid stage.' });
  }

  db.get('SELECT * FROM sites WHERE id = ?', [req.params.id], (err, existing) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!existing) return res.status(404).json({ error: 'Site not found' });

    const thesisError = validateThesisGate(stage, existing.planning_thesis);
    if (thesisError) return res.status(400).json({ error: thesisError });

    db.run('UPDATE sites SET stage=?, updated_by=?, updated_at=datetime(\'now\') WHERE id=?',
      [stage, user, req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        db.run('INSERT INTO activity_log (site_id, action, performed_by) VALUES (?,?,?)',
          [req.params.id, 'Stage changed from ' + existing.stage + ' to ' + stage, user]);
        res.json({ updated: this.changes });
      });
  });
});

// Delete site
app.delete('/api/sites/:id', requireAuth, (req, res) => {
  db.run('DELETE FROM sites WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    db.run('DELETE FROM activity_log WHERE site_id = ?', [req.params.id]);
    res.json({ deleted: this.changes });
  });
});

// Export sites as JSON (for CSV generation client-side)
app.get('/api/export', requireAuth, (req, res) => {
  const ids = req.query.ids;
  let query = 'SELECT * FROM sites';
  let params = [];
  if (ids) {
    const idArr = ids.split(',').map(Number);
    query += ' WHERE id IN (' + idArr.map(() => '?').join(',') + ')';
    params = idArr;
  }
  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------
app.listen(PORT, () => {
  console.log('Site Acquisition Tracker v0.2 running on http://localhost:' + PORT);
});
