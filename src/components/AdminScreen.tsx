import React, { useEffect, useState } from 'react';
import { useQuizStore } from '../store/quizStore';
import { 
  Terminal, 
  Shield, 
  Plus, 
  Trash2, 
  Eye, 
  ShieldCheck, 
  Database, 
  Save, 
  AlertTriangle, 
  FileText, 
  RefreshCw, 
  Users, 
  History, 
  Settings, 
  Edit3, 
  UserX, 
  UserCheck, 
  BarChart2, 
  CheckCircle, 
  Clock 
} from 'lucide-react';
import { motion } from 'motion/react';
import { Question, TrackSlug, SkillLevel, QuestionType, QuizSession } from '../types';
import { THEME_COLORS } from '../themeConfig';

export default function AdminScreen() {
  const { user, tracks, fetchTracks } = useQuizStore();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Active Main Tab
  const [activeTab, setActiveTab] = useState<'questions' | 'users' | 'sessions' | 'system'>('questions');

  // Sub-tab for Questions CMS
  const [activeFormTab, setActiveFormTab] = useState<'create' | 'list'>('list');

  // Editing state
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);

  // Form Fields
  const [trackId, setTrackId] = useState<TrackSlug>('python');
  const [level, setLevel] = useState<SkillLevel>('beginner');
  const [topicTagsString, setTopicTagsString] = useState('');
  const [type, setType] = useState<QuestionType>('mcq');
  const [prompt, setPrompt] = useState('');
  const [options, setOptions] = useState([
    { id: 'a', text: '' },
    { id: 'b', text: '' },
    { id: 'c', text: '' },
    { id: 'd', text: '' }
  ]);
  const [correctOptionIdsString, setCorrectOptionIdsString] = useState('a');
  const [difficulty, setDifficulty] = useState(1);
  const [explanation, setExplanation] = useState('');

  // Users Panel state
  const [users, setUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Sessions Panel state
  const [sessions, setSessions] = useState<any[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(false);

  // Stats / Control panel state
  const [stats, setStats] = useState<any>(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [resettingDb, setResettingDb] = useState(false);
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/questions');
      if (res.ok) {
        const data = await res.json();
        setQuestions(data.questions);
        setError(null);
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to retrieve questions.');
      }
    } catch (err) {
      setError('Network failure on fetching questions.');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users);
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchSessions = async () => {
    setLoadingSessions(true);
    try {
      const res = await fetch('/api/admin/sessions');
      if (res.ok) {
        const data = await res.json();
        // Sort sessions descending by startedAt
        const sorted = data.sessions.sort((a: any, b: any) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());
        setSessions(sorted);
      }
    } catch (err) {
      console.error('Failed to fetch sessions:', err);
    } finally {
      setLoadingSessions(false);
    }
  };

  const fetchStats = async () => {
    setLoadingStats(true);
    try {
      const res = await fetch('/api/admin/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    fetchTracks();
    if (user?.role === 'admin') {
      if (activeTab === 'questions') {
        fetchQuestions();
      } else if (activeTab === 'users') {
        fetchUsers();
      } else if (activeTab === 'sessions') {
        fetchSessions();
      } else if (activeTab === 'system') {
        fetchStats();
      }
    }
  }, [user, fetchTracks, activeTab]);

  const handleMakeAdmin = async () => {
    try {
      await useQuizStore.getState().guestLogin('Root_Admin');
      // elevates standard user immediately in sandbox
    } catch (err) {
      console.error('Bypass admin elevation error:', err);
    }
  };

  const handleCreateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Format topic tags and correctOptionIds
    const topicTags = topicTagsString.split(',').map(tag => tag.trim().toLowerCase()).filter(tag => tag.length > 0);
    const correctOptionIds = correctOptionIdsString.split(',').map(id => id.trim().toLowerCase()).filter(id => id.length > 0);

    const questionBody: any = {
      trackId,
      level,
      topicTags,
      type,
      prompt,
      difficulty,
      explanation,
      correctOptionIds
    };

    if (type !== 'fill-blank') {
      questionBody.options = options.filter(opt => opt.text.trim().length > 0);
    }

    try {
      const url = editingQuestionId 
        ? `/api/admin/questions/${editingQuestionId}` 
        : '/api/admin/questions';
      const method = editingQuestionId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(questionBody)
      });

      if (res.ok) {
        // Clear forms
        setPrompt('');
        setTopicTagsString('');
        setExplanation('');
        setOptions([
          { id: 'a', text: '' },
          { id: 'b', text: '' },
          { id: 'c', text: '' },
          { id: 'd', text: '' }
        ]);
        setCorrectOptionIdsString('a');
        setEditingQuestionId(null);
        setActiveFormTab('list');
        fetchQuestions();
        fetchStats();
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to compile question.');
      }
    } catch (err) {
      setError('Network error during compilation.');
    }
  };

  const handleEditClick = (q: Question) => {
    setEditingQuestionId(q._id);
    setTrackId(q.trackId);
    setLevel(q.level);
    setType(q.type);
    setPrompt(q.prompt);
    setDifficulty(q.difficulty);
    setExplanation(q.explanation || '');
    setTopicTagsString(q.topicTags.join(', '));
    setCorrectOptionIdsString(q.correctOptionIds.join(', '));
    if (q.options) {
      const paddedOpts = [
        { id: 'a', text: '' },
        { id: 'b', text: '' },
        { id: 'c', text: '' },
        { id: 'd', text: '' }
      ];
      q.options.forEach(opt => {
        const idx = paddedOpts.findIndex(p => p.id === opt.id);
        if (idx !== -1) {
          paddedOpts[idx].text = opt.text;
        }
      });
      setOptions(paddedOpts);
    } else {
      setOptions([
        { id: 'a', text: '' },
        { id: 'b', text: '' },
        { id: 'c', text: '' },
        { id: 'd', text: '' }
      ]);
    }
    setActiveFormTab('create');
  };

  const handleDeleteQuestion = async (id: string) => {
    if (!confirm('Are you sure you want to deactivate (soft-delete) this question? Previous results will remain intact.')) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/questions/${id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        fetchQuestions();
        fetchStats();
      } else {
        const data = await res.json();
        setError(data.error || 'Deactivation failed.');
      }
    } catch (err) {
      setError('Network failure on deactivating question.');
    }
  };

  const handleToggleUserRole = async (userId: string, currentRole: string) => {
    const nextRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: nextRole })
      });
      if (res.ok) {
        fetchUsers();
        fetchStats();
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to change role.');
      }
    } catch (err) {
      setError('Network error changing user role.');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to completely delete this user? This will also purge their sessions, achievements, and statistics.')) {
      return;
    }
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchUsers();
        fetchStats();
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to delete user.');
      }
    } catch (err) {
      setError('Network failure on user deletion.');
    }
  };

  const handleResetDatabase = async () => {
    if (!confirm('CRITICAL WARNING: This will purge all active sessions, custom questions, achievements, and user profiles. It will restore the platform to the initial default high-quality question catalog. Proceed?')) {
      return;
    }
    setResettingDb(true);
    setResetMessage(null);
    try {
      const res = await fetch('/api/admin/reset', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setResetMessage(data.message);
        // Refresh everything
        fetchQuestions();
        fetchUsers();
        fetchSessions();
        fetchStats();
      } else {
        setError('Failed to perform system restore.');
      }
    } catch (err) {
      setError('Network error during database flush.');
    } finally {
      setResettingDb(false);
    }
  };

  // If NOT admin, show friendly elevation bypass guide
  if (user?.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto px-4 py-12 text-center space-y-6" id="admin-unauthorized">
        <div 
          className="w-16 h-16 rounded-none flex items-center justify-center mx-auto shadow-md border-2"
          style={{ backgroundColor: `${THEME_COLORS.danger}15`, color: THEME_COLORS.danger, borderColor: THEME_COLORS.danger }}
        >
          <Shield className="w-8 h-8 animate-pulse" />
        </div>

        <h2 className="text-2xl font-black text-white tracking-tight uppercase">
          Admin Credential Guard
        </h2>
        <p className="text-xs text-slate-400 leading-relaxed font-mono uppercase tracking-wider">
          The Admin Question CMS Dashboard is role-protected to prevent unauthorized question tampering or database exposure.
        </p>

        <div className="p-5 bg-[#111111] border-2 border-[#222222] rounded-none text-left space-y-3" id="admin-bypass-card">
          <div className="flex gap-2 items-center" style={{ color: THEME_COLORS.success }}>
            <ShieldCheck className="w-4 h-4 flex-shrink-0" />
            <span className="text-xs font-black font-mono uppercase tracking-widest">DEVELOPER OVERRIDE BYPASS</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed font-mono uppercase tracking-wide">
            In development sandbox previews, you can bypass role restriction with a single click to test CRUD operations, bulk question-seeding, and question version tracking!
          </p>

          <button
            onClick={handleMakeAdmin}
            className="w-full h-11 flex items-center justify-center gap-2 rounded-none text-black font-black uppercase tracking-wider text-xs border-2 border-black transition-all cursor-pointer hover:bg-white active:translate-x-0.5 active:translate-y-0.5"
            style={{ backgroundColor: THEME_COLORS.success }}
            id="admin-override-trigger"
          >
            <Database className="w-4 h-4" />
            <span>Elevate Sandbox to Root Admin</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8" id="admin-cms-dashboard">
      {/* Header Bar */}
      <div className="bg-[#111111] border-2 border-[#222222] p-6 rounded-none shadow-xl text-white relative overflow-hidden" id="admin-cms-header">
        <div className="absolute top-0 left-0 right-0 h-1" style={{ background: `linear-gradient(to right, ${THEME_COLORS.success}, ${THEME_COLORS.info}, ${THEME_COLORS.danger})` }}></div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h2 className="text-2xl font-black flex items-center gap-2 uppercase tracking-tight">
              <Terminal className="w-6 h-6 animate-pulse" style={{ color: THEME_COLORS.success }} />
              <span>Platform Administration (CMS)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1 font-mono uppercase tracking-wider">
              System database CRUD, real-time user management, and core evaluation seeds
            </p>
          </div>

          {/* Core Sidebar/Horizontal Tabs */}
          <div className="flex flex-wrap gap-2 bg-[#050505] p-1 border border-[#222222] rounded-none" id="cms-main-tabs">
            <button
              onClick={() => setActiveTab('questions')}
              className="px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-widest transition-all cursor-pointer flex items-center gap-1.5"
              style={{
                backgroundColor: activeTab === 'questions' ? THEME_COLORS.success : 'transparent',
                color: activeTab === 'questions' ? '#000000' : '#888888',
                borderColor: activeTab === 'questions' ? '#000000' : 'transparent',
                borderWidth: '1px'
              }}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Questions</span>
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className="px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-widest transition-all cursor-pointer flex items-center gap-1.5"
              style={{
                backgroundColor: activeTab === 'users' ? THEME_COLORS.info : 'transparent',
                color: activeTab === 'users' ? '#000000' : '#888888',
                borderColor: activeTab === 'users' ? '#000000' : 'transparent',
                borderWidth: '1px'
              }}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Users</span>
            </button>
            <button
              onClick={() => setActiveTab('sessions')}
              className="px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-widest transition-all cursor-pointer flex items-center gap-1.5"
              style={{
                backgroundColor: activeTab === 'sessions' ? '#a855f7' : 'transparent',
                color: activeTab === 'sessions' ? '#ffffff' : '#888888',
                borderColor: activeTab === 'sessions' ? '#000000' : 'transparent',
                borderWidth: '1px'
              }}
            >
              <History className="w-3.5 h-3.5" />
              <span>Attempts</span>
            </button>
            <button
              onClick={() => setActiveTab('system')}
              className="px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-widest transition-all cursor-pointer flex items-center gap-1.5"
              style={{
                backgroundColor: activeTab === 'system' ? THEME_COLORS.danger : 'transparent',
                color: activeTab === 'system' ? '#ffffff' : '#888888',
                borderColor: activeTab === 'system' ? '#000000' : 'transparent',
                borderWidth: '1px'
              }}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>System</span>
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-[#FF0055]/10 border-2 rounded-none text-xs font-mono uppercase tracking-wider flex items-center gap-3" style={{ borderColor: THEME_COLORS.danger, color: THEME_COLORS.danger }}>
          <AlertTriangle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {/* TABS CONTAINER */}

      {/* 1. QUESTIONS TAB */}
      {activeTab === 'questions' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-[#111111] p-3 border border-[#222222]">
            <span className="text-xs font-mono uppercase font-black tracking-widest text-slate-400 pl-2">Question Catalog Options</span>
            <div className="flex gap-2 bg-[#050505] p-0.5 border border-[#222222]">
              <button
                onClick={() => {
                  setActiveFormTab('list');
                  setEditingQuestionId(null);
                }}
                className="px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-wider"
                style={{
                  backgroundColor: activeFormTab === 'list' ? THEME_COLORS.success : 'transparent',
                  color: activeFormTab === 'list' ? '#000000' : '#888888',
                }}
              >
                Catalog list
              </button>
              <button
                onClick={() => setActiveFormTab('create')}
                className="px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-wider"
                style={{
                  backgroundColor: activeFormTab === 'create' ? THEME_COLORS.success : 'transparent',
                  color: activeFormTab === 'create' ? '#000000' : '#888888',
                }}
              >
                {editingQuestionId ? 'Update Item' : 'Create Item'}
              </button>
            </div>
          </div>

          {activeFormTab === 'create' ? (
            <div className="bg-[#111111] border-2 border-[#222222] rounded-none p-6 sm:p-8 shadow-md">
              <h3 className="text-lg font-black text-white mb-6 uppercase tracking-tight">
                {editingQuestionId ? 'Modify Assessment Question' : 'Build New Assessment Item'}
              </h3>

              <form onSubmit={handleCreateQuestion} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Track Selection */}
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 font-mono">Subject Track</label>
                    <select
                      value={trackId}
                      onChange={(e) => setTrackId(e.target.value as TrackSlug)}
                      className="w-full h-11 px-3 rounded-none bg-[#050505] border-2 border-[#222222] focus:border-[#FFE600] text-sm font-semibold text-white outline-hidden font-mono"
                    >
                      <option value="python">Python Development</option>
                      <option value="ai-ml">AI & Machine Learning</option>
                      <option value="cloud">Cloud Computing</option>
                    </select>
                  </div>

                  {/* Skill Levels Selection */}
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 font-mono">Skill Tier</label>
                    <select
                      value={level}
                      onChange={(e) => setLevel(e.target.value as SkillLevel)}
                      className="w-full h-11 px-3 rounded-none bg-[#050505] border-2 border-[#222222] focus:border-[#FFE600] text-sm font-semibold text-white outline-hidden font-mono"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                      <option value="api">FastAPI / Web API</option>
                      <option value="django">Django Web Framework</option>
                    </select>
                  </div>

                  {/* Question Type Selection */}
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 font-mono">Question Type</label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value as QuestionType)}
                      className="w-full h-11 px-3 rounded-none bg-[#050505] border-2 border-[#222222] focus:border-[#FFE600] text-sm font-semibold text-white outline-hidden font-mono"
                    >
                      <option value="mcq">Single-Select MCQ</option>
                      <option value="multi">Multi-Select</option>
                      <option value="code-output">Code Block output</option>
                      <option value="fill-blank">Fill-In-The-Blank</option>
                    </select>
                  </div>
                </div>

                {/* Prompt */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 font-mono">Assessment Prompt</label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    required
                    rows={4}
                    placeholder="Type your question prompt, code snippets, or parameters here..."
                    className="w-full p-4 rounded-none bg-[#050505] border-2 border-[#222222] focus:border-[#FFE600] text-sm font-mono tracking-wide text-white outline-hidden"
                  />
                </div>

                {/* Options Forms (for non-fill-blank) */}
                {type !== 'fill-blank' && (
                  <div className="space-y-3">
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 font-mono">Response Options</label>
                    {options.map((opt, idx) => (
                      <div key={opt.id} className="flex gap-3 items-center">
                        <span className="w-8 text-center font-mono font-black text-sm uppercase" style={{ color: THEME_COLORS.success }}>{opt.id}</span>
                        <input
                          type="text"
                          placeholder={`Option ${opt.id.toUpperCase()} text...`}
                          value={opt.text}
                          required={idx < 2} // At least 2 options required
                          onChange={(e) => {
                            const nextOpts = [...options];
                            nextOpts[idx].text = e.target.value;
                            setOptions(nextOpts);
                          }}
                          className="w-full h-11 px-4 rounded-none bg-[#050505] border-2 border-[#222222] focus:border-[#FFE600] text-sm font-mono tracking-wide text-white outline-hidden"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Config: Correct Answer, tags, Difficulty */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 font-mono">
                      {type === 'fill-blank' ? 'Correct String Solution' : 'Correct Option ID(s)'}
                    </label>
                    <input
                      type="text"
                      required
                      value={correctOptionIdsString}
                      onChange={(e) => setCorrectOptionIdsString(e.target.value)}
                      placeholder={type === 'fill-blank' ? 'e.g. print, output' : 'e.g. a, c'}
                      className="w-full h-11 px-4 rounded-none bg-[#050505] border-2 border-[#222222] focus:border-[#FFE600] text-sm font-mono tracking-wide text-white outline-hidden"
                    />
                    <span className="text-[10px] text-slate-500 font-mono block mt-1.5 uppercase tracking-wider">
                      Comma-separated for multi-select / alternatives.
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 font-mono">Topic Tags</label>
                    <input
                      type="text"
                      value={topicTagsString}
                      onChange={(e) => setTopicTagsString(e.target.value)}
                      placeholder="e.g. syntax, orm, aws"
                      className="w-full h-11 px-4 rounded-none bg-[#050505] border-2 border-[#222222] focus:border-[#FFE600] text-sm font-mono tracking-wide text-white outline-hidden"
                    />
                    <span className="text-[10px] text-slate-500 font-mono block mt-1.5 uppercase tracking-wider">
                      Comma-separated topic tags.
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 font-mono">Difficulty Tier</label>
                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(Number(e.target.value))}
                      className="w-full h-11 px-3 rounded-none bg-[#050505] border-2 border-[#222222] focus:border-[#FFE600] text-sm font-semibold text-white outline-hidden font-mono"
                    >
                      <option value={1}>★ Tier 1 (Fundamental)</option>
                      <option value={2}>★★ Tier 2 (Application)</option>
                      <option value={3}>★★★ Tier 3 (Intermediate)</option>
                      <option value={4}>★★★★ Tier 4 (Advanced)</option>
                      <option value={5}>★★★★★ Tier 5 (Core Masters)</option>
                    </select>
                  </div>
                </div>

                {/* Explanation text */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 font-mono">Conceptual Solution Explanation</label>
                  <textarea
                    value={explanation}
                    onChange={(e) => setExplanation(e.target.value)}
                    rows={3}
                    placeholder="Provide details about why this is the correct answer..."
                    className="w-full p-4 rounded-none bg-[#050505] border-2 border-[#222222] focus:border-[#FFE600] text-sm font-mono tracking-wide text-white outline-hidden"
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="h-12 px-8 flex items-center justify-center gap-2 rounded-none text-black font-black uppercase tracking-wider text-sm transition-all cursor-pointer border-2 border-black hover:bg-white active:translate-x-0.5"
                    style={{ backgroundColor: THEME_COLORS.success }}
                  >
                    <Save className="w-4 h-4" />
                    <span>{editingQuestionId ? 'Commit Updates (v+1)' : 'Compile Question'}</span>
                  </button>
                  {editingQuestionId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingQuestionId(null);
                        setPrompt('');
                        setExplanation('');
                        setTopicTagsString('');
                        setCorrectOptionIdsString('a');
                        setActiveFormTab('list');
                      }}
                      className="h-12 px-6 flex items-center justify-center gap-2 rounded-none bg-[#222222] border-2 border-[#333333] hover:bg-[#333333] text-white font-black uppercase tracking-wider text-xs cursor-pointer"
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>
              </form>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center px-2">
                <h3 className="font-black text-base text-white uppercase tracking-tight">Active Evaluation Pool ({questions.length})</h3>
                <span className="text-[10px] uppercase font-mono font-black tracking-widest text-slate-500">Auto-version tracking enabled</span>
              </div>

              {loading ? (
                <div className="text-center py-12 text-slate-500">
                  <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2" style={{ color: THEME_COLORS.success }} />
                  <p className="text-xs font-mono uppercase tracking-widest">Syncing question records...</p>
                </div>
              ) : questions.length === 0 ? (
                <div className="text-center p-12 border-2 border-[#222222] rounded-none bg-[#111111]">
                  <FileText className="w-12 h-12 mx-auto mb-2" style={{ color: THEME_COLORS.success }} />
                  <h4 className="font-black text-white text-sm uppercase tracking-wider">No questions found</h4>
                  <p className="text-xs text-slate-500 mt-1 uppercase font-mono tracking-wide">Purge database under the System controls tab to re-seed.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {questions.map((q) => {
                    const trackColor = q.trackId === 'python' ? THEME_COLORS.python : q.trackId === 'ai-ml' ? THEME_COLORS.aiMl : THEME_COLORS.cloud;
                    return (
                      <div
                        key={q._id}
                        className="bg-[#111111] border-2 border-[#222222] p-5 rounded-none shadow-xs space-y-3 relative group"
                        id={`cms-question-item-${q._id}`}
                      >
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex flex-wrap gap-2 items-center">
                            <span className="text-sm font-black uppercase font-mono tracking-wider" style={{ color: trackColor }}>{q.trackId}</span>
                            <span className="text-slate-700">|</span>
                            <span className="text-xs font-black text-slate-300 uppercase font-mono tracking-wider">{q.level}</span>
                            <span className="text-slate-700">|</span>
                            <span className="text-[10px] font-mono px-2 py-0.5 bg-[#050505] border border-[#222222]" style={{ color: THEME_COLORS.success }}>
                              v{q.version}
                            </span>
                          </div>

                          <div className="flex gap-2 opacity-40 group-hover:opacity-100 transition-all">
                            <button
                              onClick={() => handleEditClick(q)}
                              className="p-2 rounded-none border-2 border-[#222222] hover:border-white bg-[#050505] text-slate-400 hover:text-white cursor-pointer transition-all"
                              title="Edit / Update question parameters"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteQuestion(q._id)}
                              className="p-2 rounded-none border-2 border-[#222222] hover:border-[#FF0055] bg-[#050505] text-[#FF0055] cursor-pointer transition-all"
                              title="Deactivate question"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <p className="text-sm font-bold text-white leading-relaxed whitespace-pre-wrap uppercase tracking-wide">{q.prompt}</p>

                        <div className="flex flex-wrap gap-1">
                          {q.topicTags.map(tag => (
                            <span key={tag} className="px-2 py-0.5 text-[9px] font-black font-mono text-slate-400 bg-[#050505] border border-[#222222] rounded-none uppercase">
                              {tag}
                            </span>
                          ))}
                        </div>

                        {q.options && q.options.length > 0 && (
                          <div className="pt-2 text-xs text-slate-400 space-y-1 font-mono uppercase tracking-wide">
                            {q.options.map(opt => {
                              const isCorrect = q.correctOptionIds.includes(opt.id);
                              return (
                                <div key={opt.id} className="flex gap-2">
                                  <span className="font-mono font-bold" style={{ color: isCorrect ? THEME_COLORS.success : '#666666' }}>
                                    [{opt.id.toUpperCase()}]
                                  </span>
                                  <span className={isCorrect ? 'text-white font-black' : ''}>
                                    {opt.text}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {q.type === 'fill-blank' && (
                          <div className="pt-2 text-xs text-slate-400 font-mono uppercase tracking-wide">
                            <span className="font-mono text-slate-500 font-bold">[FILL BLANK SOLUTION] </span>
                            <span className="font-black font-mono" style={{ color: THEME_COLORS.success }}>{q.correctOptionIds.join(' or ')}</span>
                          </div>
                        )}

                        <div className="p-3 bg-[#050505] border border-[#222222] text-[11px] text-slate-300 rounded-none leading-relaxed font-mono uppercase tracking-wide">
                          <strong>Explanation:</strong> {q.explanation}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 2. USERS TAB */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center px-2">
            <h3 className="font-black text-base text-white uppercase tracking-tight">Active User Directory ({users.length})</h3>
            <span className="text-[10px] uppercase font-mono font-black tracking-widest text-slate-500">Live credential status</span>
          </div>

          {loadingUsers ? (
            <div className="text-center py-12 text-slate-500">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2" style={{ color: THEME_COLORS.info }} />
              <p className="text-xs font-mono uppercase tracking-widest">Querying identity lists...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center p-12 border-2 border-[#222222] rounded-none bg-[#111111]">
              <Users className="w-12 h-12 mx-auto mb-2 text-slate-600" />
              <h4 className="font-black text-white text-sm uppercase tracking-wider">No registered users</h4>
              <p className="text-xs text-slate-500 mt-1 uppercase font-mono tracking-wide">Users will populate once standard credentials or guests log in.</p>
            </div>
          ) : (
            <div className="bg-[#111111] border-2 border-[#222222] rounded-none overflow-x-auto">
              <table className="w-full text-left text-xs font-mono uppercase">
                <thead>
                  <tr className="border-b-2 border-[#222222] bg-[#050505] text-slate-400 font-bold">
                    <th className="p-4">Avatar & Name</th>
                    <th className="p-4">Email Address</th>
                    <th className="p-4">System Role</th>
                    <th className="p-4">Streak (Days)</th>
                    <th className="p-4">Last Login At</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#222222] text-slate-300">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-[#1a1a1a]/50">
                      <td className="p-4 flex items-center gap-3">
                        <img 
                          src={u.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=60'} 
                          alt="Avatar" 
                          className="w-8 h-8 rounded-none border border-[#222222]"
                          referrerPolicy="no-referrer"
                        />
                        <span className="font-black text-white">{u.name}</span>
                      </td>
                      <td className="p-4 truncate max-w-xs">{u.email}</td>
                      <td className="p-4">
                        <span 
                          className="px-2 py-1 text-[9px] font-black border uppercase tracking-widest"
                          style={{
                            backgroundColor: u.role === 'admin' ? `${THEME_COLORS.danger}20` : 'transparent',
                            color: u.role === 'admin' ? THEME_COLORS.danger : '#888888',
                            borderColor: u.role === 'admin' ? THEME_COLORS.danger : '#333333'
                          }}
                        >
                          {u.role || 'user'}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-white">🔥 {u.streak || 0}</td>
                      <td className="p-4 text-[10px] text-slate-500">{new Date(u.lastLoginAt || u.createdAt).toLocaleDateString()}</td>
                      <td className="p-4 text-center">
                        <div className="flex justify-center items-center gap-2">
                          <button
                            onClick={() => handleToggleUserRole(u._id, u.role)}
                            className="p-1.5 border border-[#333333] hover:border-white text-slate-400 hover:text-white cursor-pointer"
                            title={u.role === 'admin' ? "Demote user to normal role" : "Promote user to administrator"}
                          >
                            <UserCheck className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(u._id)}
                            className="p-1.5 border border-[#333333] hover:border-[#FF0055] text-slate-400 hover:text-[#FF0055] cursor-pointer"
                            title="Completely delete user history"
                          >
                            <UserX className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* 3. ATTEMPTS TAB */}
      {activeTab === 'sessions' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center px-2">
            <h3 className="font-black text-base text-white uppercase tracking-tight">System Quiz Attempts history ({sessions.length})</h3>
            <span className="text-[10px] uppercase font-mono font-black tracking-widest text-slate-500">Live proctor records</span>
          </div>

          {loadingSessions ? (
            <div className="text-center py-12 text-slate-500">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-purple-400" />
              <p className="text-xs font-mono uppercase tracking-widest">Compiling historical runs...</p>
            </div>
          ) : sessions.length === 0 ? (
            <div className="text-center p-12 border-2 border-[#222222] rounded-none bg-[#111111]">
              <History className="w-12 h-12 mx-auto mb-2 text-slate-600" />
              <h4 className="font-black text-white text-sm uppercase tracking-wider">No attempts recorded</h4>
              <p className="text-xs text-slate-500 mt-1 uppercase font-mono tracking-wide">Sessions history will log once user submission files are processed.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sessions.map((s) => {
                const isPassing = s.score !== undefined && s.maxScore && (s.score / s.maxScore >= 0.6);
                const trackColor = s.trackId === 'python' ? THEME_COLORS.python : s.trackId === 'ai-ml' ? THEME_COLORS.aiMl : THEME_COLORS.cloud;
                return (
                  <div key={s._id} className="bg-[#111111] border-2 border-[#222222] p-5 rounded-none flex flex-col md:flex-row justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-2 items-center">
                        <span className="text-xs font-black uppercase font-mono" style={{ color: trackColor }}>{s.trackId}</span>
                        <span className="text-slate-700">|</span>
                        <span className="text-[10px] font-bold text-slate-300 uppercase font-mono">{s.level}</span>
                        <span className="text-slate-700">|</span>
                        <span className="text-[10px] font-mono text-slate-500">{new Date(s.startedAt).toLocaleString()}</span>
                      </div>

                      <div className="text-sm font-bold text-white flex items-center gap-2 font-mono">
                        <span>User Session ID:</span>
                        <span className="text-indigo-400 text-xs">{s.userId}</span>
                      </div>

                      {s.recommendation && (
                        <p className="text-xs text-slate-400 max-w-2xl leading-relaxed italic border-l-2 border-[#333333] pl-3 font-mono">
                          "{s.recommendation}"
                        </p>
                      )}
                    </div>

                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 border-[#222222] pt-3 md:pt-0 gap-2 min-w-[150px]">
                      <div className="text-right">
                        <span className="text-[10px] uppercase font-mono font-bold text-slate-500 block">SCORE RESULT</span>
                        <span className="text-xl font-black font-mono text-white">
                          {s.score !== undefined ? `${s.score} / ${s.maxScore}` : 'IN PROGRESS'}
                        </span>
                      </div>

                      {s.score !== undefined ? (
                        <span 
                          className="px-2 py-0.5 text-[9px] font-black uppercase tracking-widest border"
                          style={{
                            backgroundColor: isPassing ? `${THEME_COLORS.success}10` : `${THEME_COLORS.danger}10`,
                            color: isPassing ? THEME_COLORS.success : THEME_COLORS.danger,
                            borderColor: isPassing ? THEME_COLORS.success : THEME_COLORS.danger,
                          }}
                        >
                          {isPassing ? 'CLEARED' : 'FAILED'}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-widest border border-slate-700 text-slate-500">
                          PENDING
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 4. SYSTEM TAB */}
      {activeTab === 'system' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-[#111111] border-2 border-[#222222] p-4 text-center font-mono uppercase">
              <span className="text-[10px] text-slate-500 block font-bold">DIRECTORY USERS</span>
              <span className="text-3xl font-black text-white mt-1 block">{stats ? stats.usersCount : '...'}</span>
            </div>
            <div className="bg-[#111111] border-2 border-[#222222] p-4 text-center font-mono uppercase">
              <span className="text-[10px] text-slate-500 block font-bold">CATALOG Qs</span>
              <span className="text-3xl font-black text-white mt-1 block" style={{ color: THEME_COLORS.success }}>{stats ? stats.questionsCount : '...'}</span>
            </div>
            <div className="bg-[#111111] border-2 border-[#222222] p-4 text-center font-mono uppercase">
              <span className="text-[10px] text-slate-500 block font-bold">TOTAL ATTEMPTS</span>
              <span className="text-3xl font-black text-white mt-1 block" style={{ color: THEME_COLORS.info }}>{stats ? stats.sessionsCount : '...'}</span>
            </div>
            <div className="bg-[#111111] border-2 border-[#222222] p-4 text-center font-mono uppercase">
              <span className="text-[10px] text-slate-500 block font-bold">METRIC TRACKS</span>
              <span className="text-3xl font-black text-white mt-1 block" style={{ color: '#a855f7' }}>{stats ? stats.progressCount : '...'}</span>
            </div>
            <div className="bg-[#111111] border-2 border-[#222222] p-4 text-center font-mono uppercase">
              <span className="text-[10px] text-slate-500 block font-bold">EARNED BADGES</span>
              <span className="text-3xl font-black text-white mt-1 block" style={{ color: THEME_COLORS.success }}>{stats ? stats.badgesEarnedCount : '...'}</span>
            </div>
            <div className="bg-[#111111] border-2 border-[#222222] p-4 text-center font-mono uppercase">
              <span className="text-[10px] text-slate-500 block font-bold">LEADER BOARD</span>
              <span className="text-3xl font-black text-white mt-1 block" style={{ color: THEME_COLORS.info }}>{stats ? stats.leaderboardEntries : '...'}</span>
            </div>
          </div>

          <div className="bg-[#111111] border-2 border-[#222222] p-6 sm:p-8 rounded-none space-y-6">
            <div>
              <h3 className="text-lg font-black text-white uppercase tracking-tight">System Purge & Re-Seeding panel</h3>
              <p className="text-xs text-slate-400 mt-1 font-mono uppercase tracking-wider">
                Restore the entire web app state back to default seeded conditions.
              </p>
            </div>

            {resetMessage && (
              <div className="p-4 bg-[#FFE600]/10 border border-[#FFE600] text-xs font-mono text-[#FFE600] uppercase tracking-wide">
                <span>✓ {resetMessage}</span>
              </div>
            )}

            <div className="p-4 bg-red-950/20 border-2 rounded-none space-y-4" style={{ borderColor: THEME_COLORS.danger }}>
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 flex-shrink-0" style={{ color: THEME_COLORS.danger }} />
                <div>
                  <h4 className="font-black text-white text-xs uppercase tracking-widest">CRITICAL ADMINISTRATIVE RESTORE</h4>
                  <p className="text-[10px] text-rose-300 font-mono uppercase tracking-wider mt-0.5">
                    Irreversible action. Performs file db purge and flushes all logged activities.
                  </p>
                </div>
              </div>

              <button
                onClick={handleResetDatabase}
                disabled={resettingDb}
                className="px-6 h-11 text-xs font-black uppercase tracking-widest text-white hover:text-black border-2 transition-all cursor-pointer rounded-none disabled:opacity-50"
                style={{ 
                  backgroundColor: THEME_COLORS.danger,
                  borderColor: THEME_COLORS.danger
                }}
              >
                {resettingDb ? 'RESETTING...' : 'Hard Reset & Re-Seed Database'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
