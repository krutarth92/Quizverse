import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import { createServer as createViteServer } from 'vite';
import crypto from 'crypto';

// Load environment variables
dotenv.config();

import { dbFallback, DEFAULT_TRACKS, DEFAULT_BADGES } from './src/db/dbFallback';
import { Question, Track, User, QuizSession, Progress, UserPreferences } from './src/types';

const app = express();
const PORT = 3000;

// Dynamic keys generation in production if not set, preventing hardcoded secrets exploit
const isProduction = process.env.NODE_ENV === 'production';
const JWT_SECRET = process.env.JWT_SECRET || (
  isProduction 
    ? crypto.randomBytes(64).toString('hex') 
    : 'quizverse_super_secret_jwt_key_2026'
);
const REFRESH_SECRET = process.env.REFRESH_SECRET || (
  isProduction 
    ? crypto.randomBytes(64).toString('hex') 
    : 'quizverse_super_secret_refresh_key_2026'
);

app.use(express.json());
app.use(cookieParser());

// CORS & Iframe friendly cookie helper
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,      // Required for SameSite=None
  sameSite: 'none' as const,  // Required for cross-origin iframe preview
  maxAge: 15 * 60 * 1000 // 15 minutes for access token
};

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: 'none' as const,
  maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days for refresh token
};

// JWT Generation helper
function generateTokens(user: User) {
  const accessToken = jwt.sign({ userId: user._id, role: user.role || 'user' }, JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ userId: user._id }, REFRESH_SECRET, { expiresIn: '30d' });
  return { accessToken, refreshToken };
}

// Auth Middleware
interface AuthRequest extends express.Request {
  user?: User;
}

const authenticateToken = (req: AuthRequest, res: express.Response, next: express.NextFunction): void => {
  const authHeader = req.headers['authorization'];
  let token = authHeader && authHeader.split(' ')[1];

  // Fallback to cookie
  if (!token && req.cookies && req.cookies.access_token) {
    token = req.cookies.access_token;
  }

  if (!token) {
    res.status(401).json({ error: 'Access token required' });
    return;
  }

  jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
    if (err) {
      res.status(403).json({ error: 'Invalid or expired access token' });
      return;
    }
    const user = dbFallback.getUser(decoded.userId);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    req.user = user;
    next();
  });
};

// Admin Protection Middleware
const requireAdmin = (req: AuthRequest, res: express.Response, next: express.NextFunction): void => {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json({ error: 'Admin access required' });
    return;
  }
  next();
};

// --- AUTHENTICATION API ROUTES ---

// Get current user profile
app.get('/api/auth/me', authenticateToken, (req: AuthRequest, res) => {
  res.json({ user: req.user });
});

// Update current user preferences
app.post('/api/auth/preferences', authenticateToken, (req: AuthRequest, res) => {
  const { theme, notifications } = req.body;
  if (!req.user) return;

  const updated = dbFallback.updateUser(req.user._id, {
    preferences: {
      theme: theme === 'light' ? 'light' : 'dark',
      notifications: !!notifications
    }
  });
  res.json({ user: updated });
});

// Rotate tokens using refresh token cookie
app.post('/api/auth/refresh', (req, res) => {
  const refreshToken = req.cookies.refresh_token;
  if (!refreshToken) {
    res.status(401).json({ error: 'Refresh token required' });
    return;
  }

  jwt.verify(refreshToken, REFRESH_SECRET, (err: any, decoded: any) => {
    if (err) {
      res.status(403).json({ error: 'Invalid or expired refresh token' });
      return;
    }

    const user = dbFallback.getUser(decoded.userId);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Optional token rotation: verify the stored hash matches
    if (user.refreshTokenHash && user.refreshTokenHash !== refreshToken) {
      // Token reuse detected - invalidate all sessions for safety
      dbFallback.updateUser(user._id, { refreshTokenHash: undefined });
      res.status(403).json({ error: 'Refresh token reuse detected' });
      return;
    }

    const tokens = generateTokens(user);

    // Save rotated refresh token
    dbFallback.updateUser(user._id, { refreshTokenHash: tokens.refreshToken });

    res.cookie('access_token', tokens.accessToken, COOKIE_OPTIONS);
    res.cookie('refresh_token', tokens.refreshToken, REFRESH_COOKIE_OPTIONS);

    res.json({
      accessToken: tokens.accessToken,
      user
    });
  });
});

// Dev/Sandbox fast-track login (Instant guest session)
app.post('/api/auth/sandbox', (req, res) => {
  const { guestName } = req.body;
  const name = guestName || `NexusExplorer_${Math.floor(Math.random() * 9000 + 1000)}`;
  const email = `${name.toLowerCase()}@quizverse.io`;

  let user = dbFallback.getUserByEmail(email);
  if (!user) {
    // Determine random neon themed avatar
    const avatars = [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=150&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=150&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1618005198143-e5283b519a7f?w=150&auto=format&fit=crop&q=60'
    ];
    const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];

    // Strictly check environment to prevent privilege escalation to admin role in production
    const isSandboxAdminAllowed = !isProduction && name.toLowerCase().includes('admin');
    user = dbFallback.createUser({
      email,
      name,
      avatarUrl: randomAvatar,
      role: isSandboxAdminAllowed ? 'admin' : 'user'
    });
  } else {
    // Update login timestamp & check streak
    const todayStr = new Date().toISOString().split('T')[0];
    let streak = user.streak || 1;
    if (user.lastActiveDate) {
      const lastActive = new Date(user.lastActiveDate);
      const diffTime = Math.abs(new Date(todayStr).getTime() - lastActive.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        streak += 1;
      } else if (diffDays > 1) {
        streak = 1; // reset streak
      }
    }
    user = dbFallback.updateUser(user._id, {
      lastLoginAt: new Date().toISOString(),
      lastActiveDate: todayStr,
      streak
    })!;
  }

  const tokens = generateTokens(user);
  dbFallback.updateUser(user._id, { refreshTokenHash: tokens.refreshToken });

  res.cookie('access_token', tokens.accessToken, COOKIE_OPTIONS);
  res.cookie('refresh_token', tokens.refreshToken, REFRESH_COOKIE_OPTIONS);

  res.json({
    accessToken: tokens.accessToken,
    user
  });
});

// Logout endpoint
app.post('/api/auth/logout', authenticateToken, (req: AuthRequest, res) => {
  if (req.user) {
    dbFallback.updateUser(req.user._id, { refreshTokenHash: undefined });
  }
  res.clearCookie('access_token', COOKIE_OPTIONS);
  res.clearCookie('refresh_token', REFRESH_COOKIE_OPTIONS);
  res.json({ success: true, message: 'Logged out successfully' });
});

// Google OAuth Authorization Request URL
app.get('/api/auth/google/url', (req, res) => {
  const clientId = process.env.OAUTH_CLIENT_ID || process.env.GOOGLE_CLIENT_ID;
  const redirectUri = `${process.env.APP_URL || 'https://' + req.headers.host}/auth/callback`;

  // If there is no real Google Client ID configured, we gracefully bypass Google's servers
  // and directly hit our own callback with a sandbox_code. This ensures that the user's
  // authentication flow is smooth and working even without manual client ID registration!
  if (!clientId || clientId === 'dummy_google_client_id_for_preview') {
    if (isProduction) {
      res.status(500).json({ error: 'Google OAuth is not configured in production. Please set OAUTH_CLIENT_ID and OAUTH_CLIENT_SECRET environment variables.' });
      return;
    }
    console.warn('OAUTH_CLIENT_ID is missing or dummy. Redirecting directly to sandbox callback.');
    const sandboxUrl = `${redirectUri}?code=sandbox_bypass_code`;
    res.json({ url: sandboxUrl });
    return;
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
    access_type: 'offline',
    prompt: 'consent'
  });

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  res.json({ url: authUrl });
});

// Google OAuth callback endpoint
app.get(['/auth/callback', '/auth/callback/'], async (req, res) => {
  const { code, error } = req.query;

  if (error) {
    res.send(`
      <html>
        <body>
          <script>
            alert("OAuth Error: ${error}");
            window.close();
          </script>
          <p>OAuth failed: ${error}</p>
        </body>
      </html>
    `);
    return;
  }

  if (!code) {
    res.status(400).send('OAuth authorization code missing');
    return;
  }

  try {
    const clientId = process.env.OAUTH_CLIENT_ID || process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.OAUTH_CLIENT_SECRET || process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = `${process.env.APP_URL || 'https://' + req.headers.host}/auth/callback`;

    const isBypassRequest = !clientId || !clientSecret || code === 'sandbox_bypass_code';

    if (isBypassRequest) {
      if (isProduction) {
        res.status(403).send('Sandbox bypass is strictly prohibited in production mode. Please configure real Google OAuth keys.');
        return;
      }
      // Standard Sandbox Bypass during dev if vars not set yet
      // To keep UX smooth, we will dynamically create a test Google user!
      console.warn('OAUTH_CLIENT_ID or OAUTH_CLIENT_SECRET is missing. Falling back to sandbox user.');
      const testEmail = 'reviewer@google.com';
      let user = dbFallback.getUserByEmail(testEmail);
      if (!user) {
        user = dbFallback.createUser({
          googleId: 'g_1234567890',
          email: testEmail,
          name: 'Google Reviewer',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=60',
          role: 'admin'
        });
      }

      const tokens = generateTokens(user);
      dbFallback.updateUser(user._id, { refreshTokenHash: tokens.refreshToken });

      res.cookie('access_token', tokens.accessToken, COOKIE_OPTIONS);
      res.cookie('refresh_token', tokens.refreshToken, REFRESH_COOKIE_OPTIONS);

      res.send(`
        <html>
          <body>
            <script>
              if (window.opener) {
                window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS' }, '*');
                window.close();
              } else {
                window.location.href = '/';
              }
            </script>
            <p>OAuth simulated successfully! Closing...</p>
          </body>
        </html>
      `);
      return;
    }

    // Real OAuth exchange
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code: code as string,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code'
      })
    });

    const tokenData = await tokenResponse.json();
    if (!tokenResponse.ok) {
      throw new Error(tokenData.error_description || 'Token exchange failed');
    }

    const { access_token } = tokenData;

    // Fetch user info from Google
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` }
    });

    const userData = await userResponse.json();
    if (!userResponse.ok) {
      throw new Error('Failed to retrieve user profile from Google');
    }

    let user = dbFallback.getUserByGoogleId(userData.sub);
    if (!user) {
      user = dbFallback.createUser({
        googleId: userData.sub,
        email: userData.email,
        name: userData.name || userData.given_name || 'Explorer',
        avatarUrl: userData.picture || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=60'
      });
    } else {
      user = dbFallback.updateUser(user._id, {
        lastLoginAt: new Date().toISOString()
      })!;
    }

    const tokens = generateTokens(user);
    dbFallback.updateUser(user._id, { refreshTokenHash: tokens.refreshToken });

    res.cookie('access_token', tokens.accessToken, COOKIE_OPTIONS);
    res.cookie('refresh_token', tokens.refreshToken, REFRESH_COOKIE_OPTIONS);

    res.send(`
      <html>
        <body>
          <script>
            if (window.opener) {
              window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS' }, '*');
              window.close();
            } else {
              window.location.href = '/';
            }
          </script>
          <p>Authentication successful. This window should close automatically.</p>
        </body>
      </html>
    `);

  } catch (err: any) {
    console.error('OAuth processing error:', err);
    res.status(500).send(`OAuth callback failed: ${err.message || err}`);
  }
});

// --- CORE QUIZ API ENDPOINTS ---

// List Tracks
app.get('/api/tracks', (req, res) => {
  res.json({ tracks: DEFAULT_TRACKS });
});

// Start Quiz Session
app.post('/api/quiz/start', authenticateToken, (req: AuthRequest, res) => {
  const { trackId, level } = req.body;
  if (!req.user) return;

  const user = req.user;

  // Rate Limiting (Redis Emulator) -> Max 3 quiz starts per 5 minutes to prevent retake-farming
  const rateLimitKey = `rate_limit_quiz_start:${user._id}`;
  const isLimited = dbFallback.isRateLimited(rateLimitKey, 3, 5 * 60 * 1000);
  if (isLimited) {
    res.status(429).json({ error: 'Farming detected! Please complete active quizzes or wait a couple of minutes before spawning another challenge.' });
    return;
  }

  // Get matching active questions
  const matchedQuestions = dbFallback.getQuestionsForQuiz(trackId, level);
  if (matchedQuestions.length === 0) {
    res.status(404).json({ error: 'No active questions found for the selected track and skill level.' });
    return;
  }

  // Smart Randomizer: Try to avoid repeating questions from user's last 3 submitted quiz sessions
  const userSessions = Object.values((dbFallback as any).memoryDB.sessions as Record<string, QuizSession>)
    .filter(s => s.userId === user._id && s.trackId === trackId && s.level === level)
    .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())
    .slice(0, 3);

  const recentlySeenIds = new Set<string>();
  userSessions.forEach(sess => {
    sess.questionIds.forEach(id => recentlySeenIds.add(id));
  });

  // Filter pool to find unseen, fallback to total pool if we run low
  let pool = matchedQuestions.filter(q => !recentlySeenIds.has(q._id));
  if (pool.length < Math.min(20, matchedQuestions.length)) {
    pool = matchedQuestions;
  }

  // Shuffle pool and select up to 20 questions
  const shuffledPool = [...pool].sort(() => Math.random() - 0.5);
  const selectedQuestions = shuffledPool.slice(0, 20);

  // Expiration: 1.5 minutes per question + 5 second buffer
  const expiresAt = new Date(Date.now() + selectedQuestions.length * 90 * 1000 + 5000);

  // Generate safe questions to send to client (No correctOptionIds or explanation!)
  const clientQuestions = selectedQuestions.map(q => {
    // Shuffle options dynamically so layout is fully anti-cheat
    const shuffledOptions = q.options ? [...q.options].sort(() => Math.random() - 0.5) : undefined;
    return {
      _id: q._id,
      trackId: q.trackId,
      level: q.level,
      topicTags: q.topicTags,
      type: q.type,
      prompt: q.prompt,
      options: shuffledOptions,
      difficulty: q.difficulty,
      version: q.version
    };
  });

  // Store Session on server
  const session = dbFallback.createSession({
    userId: user._id,
    trackId,
    level,
    questionIds: selectedQuestions.map(q => q._id),
    startedAt: new Date().toISOString(),
    expiresAt: expiresAt.toISOString(),
    answers: [],
    status: 'in-progress'
  });

  res.json({
    session: {
      ...session,
      questions: clientQuestions
    }
  });
});

// Submit Quiz Session (Includes server deadline check, scoring, progress update, badge verification, and dynamic recommendations)
app.post('/api/quiz/:sessionId/submit', authenticateToken, (req: AuthRequest, res) => {
  const { sessionId } = req.params;
  const { answers } = req.body as { answers: { questionId: string; selectedOptionIds: string[] }[] };
  if (!req.user) return;

  const user = req.user;
  const session = dbFallback.getSession(sessionId);

  if (!session) {
    res.status(404).json({ error: 'Quiz session not found.' });
    return;
  }

  if (session.status !== 'in-progress') {
    res.status(400).json({ error: 'This quiz session has already been submitted or completed.' });
    return;
  }

  // Server-side Deadline check
  const now = new Date();
  const expiresAt = new Date(session.expiresAt);
  const isTimedOut = now > expiresAt;

  const finalStatus = isTimedOut ? 'timed-out' : 'completed';
  const submittedAt = now.toISOString();
  const timeTakenSec = Math.floor((now.getTime() - new Date(session.startedAt).getTime()) / 1000);

  // Score answers
  let score = 0;
  let maxScore = 0;
  const scoredAnswers = session.questionIds.map(qId => {
    const question = dbFallback.getQuestion(qId);
    const userAnswer = answers.find(a => a.questionId === qId);
    const userSelection = userAnswer ? userAnswer.selectedOptionIds : [];

    let isCorrect = false;
    if (question && question.active) {
      maxScore += question.difficulty;

      if (question.type === 'fill-blank') {
        const submissionText = (userSelection[0] || '').trim().toLowerCase();
        const acceptableAnswers = question.correctOptionIds.map(ans => ans.trim().toLowerCase());
        isCorrect = acceptableAnswers.includes(submissionText);
      } else {
        // MCQ or Multi-select
        const correctSet = new Set(question.correctOptionIds);
        const userSet = new Set(userSelection);
        if (correctSet.size === userSet.size && [...correctSet].every(item => userSet.has(item))) {
          isCorrect = true;
        }
      }

      if (isCorrect) {
        score += question.difficulty;
      }
    }

    return {
      questionId: qId,
      selectedOptionIds: userSelection,
      isCorrect
    };
  });

  // Calculate detailed performance percentages
  const pct = maxScore > 0 ? (score / maxScore) * 100 : 0;

  // Track tag performance to aggregate weak / strong topics
  const topicsTracker: Record<string, { correct: number; total: number }> = {};
  session.questionIds.forEach((qId, idx) => {
    const question = dbFallback.getQuestion(qId);
    if (question) {
      const isCorrect = scoredAnswers[idx].isCorrect;
      question.topicTags.forEach(tag => {
        if (!topicsTracker[tag]) topicsTracker[tag] = { correct: 0, total: 0 };
        topicsTracker[tag].total++;
        if (isCorrect) topicsTracker[tag].correct++;
      });
    }
  });

  // Calculate Weak/Strong Topics (Weak: <50% correctness, Strong: >=80% correctness)
  const weakTopics: string[] = [];
  const strongTopics: string[] = [];
  Object.entries(topicsTracker).forEach(([tag, stats]) => {
    const tagPct = (stats.correct / stats.total) * 100;
    if (tagPct < 50) {
      weakTopics.push(tag);
    } else if (tagPct >= 80) {
      strongTopics.push(tag);
    }
  });

  // Generate recommendation string
  let recommendation = '';
  const weakTagsString = weakTopics.length > 0 ? weakTopics.join(', ') : 'any challenging elements';
  if (pct < 60) {
    recommendation = `This quiz was **not cleared**. The minimum required score is 60%, and you achieved **${Math.round(pct)}%**. We suggest taking another run on this level with extra focus on **${weakTagsString}**. Practice makes perfect — review the explanations below, you've got this!`;
  } else if (pct <= 80) {
    recommendation = `Splendid job! You've **cleared** this quiz with **${Math.round(pct)}%** accuracy! You've grasped most of the core logic, though reviewing **${weakTagsString}** will solidify your absolute mastery. Try one more time to push for a perfect 100%!`;
  } else {
    // Determine next recommended level
    const track = DEFAULT_TRACKS.find(t => t.slug === session.trackId);
    let nextLevelStr = '';
    if (track) {
      const currentIdx = track.levels.indexOf(session.level);
      if (currentIdx >= 0 && currentIdx < track.levels.length - 1) {
        nextLevelStr = `the **${track.levels[currentIdx + 1]}** tier`;
      } else {
        const otherTrack = DEFAULT_TRACKS.find(t => t.slug !== session.trackId);
        nextLevelStr = otherTrack ? `the **${otherTrack.name}** track` : 'advanced developer architectures';
      }
    }
    recommendation = `Sensational achievement! You've **cleared** this quiz with **${Math.round(pct)}%** accuracy and displayed absolute mastery. We highly recommend scaling up to ${nextLevelStr} to test your limits!`;
  }

  // Retrieve existing user stats to handle streaks
  const previousProgress = dbFallback.getProgress(user._id, session.trackId, session.level);
  const attempts = (previousProgress?.attempts || 0) + 1;
  const bestScore = Math.max(previousProgress?.bestScore || 0, score);

  // Update progress
  dbFallback.saveProgress({
    userId: user._id,
    trackId: session.trackId,
    level: session.level,
    attempts,
    bestScore,
    lastScore: score,
    completionPct: Math.round((bestScore / maxScore) * 100),
    weakTopics,
    strongTopics,
    updatedAt: new Date().toISOString()
  });

  // Verification & Awarding of Badges
  const newlyAwardedBadges: any[] = [];
  const checkAward = (code: string) => {
    const badge = dbFallback.awardBadge(user._id, code);
    if (badge) newlyAwardedBadges.push(badge);
  };

  // 1. First quiz badge
  checkAward('FIRST_QUIZ');

  // 2. Perfect score badge
  if (pct === 100) {
    checkAward('PERFECT_SCORE');
  }

  // 3. Track masteries
  if (session.trackId === 'python' && ['advanced', 'api', 'django'].includes(session.level) && pct >= 80) {
    checkAward('PYTHON_GURU');
  }
  if (session.trackId === 'ai-ml' && session.level === 'advanced' && pct >= 80) {
    checkAward('AI_SAGE');
  }
  if (session.trackId === 'cloud' && session.level === 'advanced' && pct >= 80) {
    checkAward('CLOUD_ARCHITECT');
  }

  // 4. Streak badges
  const userStreak = user.streak || 1;
  if (userStreak >= 3) checkAward('STREAK_3');
  if (userStreak >= 7) checkAward('STREAK_7');

  // Add Score to Redis Leaderboard
  // 10 points per difficulty point earned on weekly/all-time leaderboards
  const pointsEarned = score * 10;
  dbFallback.addLeaderboardScore(user._id, session.trackId, 'weekly', pointsEarned);
  dbFallback.addLeaderboardScore(user._id, session.trackId, 'alltime', pointsEarned);

  // Save submitted session details on server
  const updatedSession = dbFallback.updateSession(sessionId, {
    status: finalStatus,
    submittedAt,
    timeTakenSec,
    answers: scoredAnswers,
    score,
    maxScore,
    recommendation
  })!;

  // Retrieve complete questions with correct options & explanations to display in review screen
  const questionReviews = session.questionIds.map(qId => {
    const q = dbFallback.getQuestion(qId)!;
    return {
      _id: q._id,
      prompt: q.prompt,
      options: q.options,
      type: q.type,
      correctOptionIds: q.correctOptionIds,
      explanation: q.explanation,
      difficulty: q.difficulty,
      topicTags: q.topicTags
    };
  });

  res.json({
    results: {
      sessionId,
      score,
      maxScore,
      percentage: pct,
      status: finalStatus,
      timeTakenSec,
      recommendation,
      answers: scoredAnswers,
      questions: questionReviews,
      newBadges: newlyAwardedBadges
    }
  });
});

// --- DASHBOARD AND PROGRESS API ---

// Aggregated User Stats
app.get('/api/dashboard/me', authenticateToken, (req: AuthRequest, res) => {
  if (!req.user) return;
  const user = req.user;

  const progressList = dbFallback.getProgressForUser(user._id);
  const earnedBadges = dbFallback.getUserBadges(user._id);

  // Calculate high-level aggregated items
  const totalQuizzesTaken = progressList.reduce((acc, p) => acc + p.attempts, 0);

  // Track completion states
  const trackCompletion: Record<string, number> = { python: 0, 'ai-ml': 0, cloud: 0 };
  const scoreTrends: any[] = [];

  // Group by tracks
  DEFAULT_TRACKS.forEach(track => {
    const trackProgress = progressList.filter(p => p.trackId === track.slug);
    const maxLevels = track.levels.length;
    if (maxLevels > 0) {
      const totalPct = trackProgress.reduce((acc, p) => acc + p.completionPct, 0);
      trackCompletion[track.slug] = Math.round(totalPct / maxLevels);
    }
  });

  // Aggregate global list of weak/strong tags
  const weakTagsSet = new Set<string>();
  const strongTagsSet = new Set<string>();
  progressList.forEach(p => {
    p.weakTopics.forEach(tag => weakTagsSet.add(tag));
    p.strongTopics.forEach(tag => strongTagsSet.add(tag));
  });

  // Ensure tags aren't in both (strong overrides weak)
  const weakTopics = Array.from(weakTagsSet).filter(tag => !strongTagsSet.has(tag));
  const strongTopics = Array.from(strongTagsSet);

  // Score trend mapping (simulate historical scores using completed sessions)
  const userFinishedSessions = Object.values((dbFallback as any).memoryDB.sessions as Record<string, QuizSession>)
    .filter(s => s.userId === user._id && s.status !== 'in-progress')
    .sort((a, b) => new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime());

  const scoreTrend = userFinishedSessions.map((s, index) => ({
    name: `Quiz #${index + 1}`,
    score: s.score || 0,
    maxScore: s.maxScore || 10,
    pct: s.maxScore ? Math.round(((s.score || 0) / s.maxScore) * 100) : 0,
    track: DEFAULT_TRACKS.find(t => t.slug === s.trackId)?.name || s.trackId,
    date: new Date(s.startedAt).toLocaleDateString()
  }));

  // Badge detail compilation
  const badgeCollection = DEFAULT_BADGES.map(b => {
    const earned = earnedBadges.find(ub => ub.badgeId === b._id);
    return {
      ...b,
      earned: !!earned,
      earnedAt: earned ? earned.earnedAt : null
    };
  });

  res.json({
    stats: {
      totalQuizzesTaken,
      streak: user.streak || 1,
      trackCompletion,
      weakTopics,
      strongTopics,
      scoreTrend,
      badges: badgeCollection,
      progressList
    }
  });
});

// --- LEADERBOARD API ---
app.get('/api/leaderboard', (req, res) => {
  const track = (req.query.track as string) || 'all';
  const period = (req.query.period as 'weekly' | 'alltime') || 'alltime';

  const list = dbFallback.getLeaderboard(track, period);
  res.json({ leaderboard: list });
});

// --- EARNED BADGES ONLY API ---
app.get('/api/badges/me', authenticateToken, (req: AuthRequest, res) => {
  if (!req.user) return;
  const list = dbFallback.getUserBadges(req.user._id);
  res.json({ badges: list });
});

// --- ADMIN / CONTENT MANAGEMENT (CRUD PROTECTED ENDPOINTS) ---

// Get all questions
app.get('/api/admin/questions', authenticateToken, requireAdmin, (req, res) => {
  res.json({ questions: dbFallback.getQuestions() });
});

// Create Question
app.post('/api/admin/questions', authenticateToken, requireAdmin, (req, res) => {
  const { trackId, level, topicTags, type, prompt, options, correctOptionIds, difficulty, explanation } = req.body;

  // Validation
  if (!trackId || !level || !type || !prompt || !correctOptionIds || !difficulty) {
    res.status(400).json({ error: 'Missing required question properties.' });
    return;
  }

  const q = dbFallback.createQuestion({
    trackId,
    level,
    topicTags: topicTags || [],
    type,
    prompt,
    options,
    correctOptionIds,
    difficulty: Number(difficulty) || 1,
    explanation: explanation || '',
    active: true,
    createdBy: 'admin'
  });

  res.json({ question: q });
});

// Update Question (includes dynamic Question Versioning to avoid corrupting previous attempt logs)
app.put('/api/admin/questions/:id', authenticateToken, requireAdmin, (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const updated = dbFallback.updateQuestion(id, updates);
  if (!updated) {
    res.status(404).json({ error: 'Question not found.' });
    return;
  }

  res.json({ question: updated });
});

// Delete (Deactivate) Question
app.delete('/api/admin/questions/:id', authenticateToken, requireAdmin, (req, res) => {
  const { id } = req.params;
  const success = dbFallback.deleteQuestion(id);
  if (!success) {
    res.status(404).json({ error: 'Question not found.' });
    return;
  }
  res.json({ success: true });
});

// GET all users in the system
app.get('/api/admin/users', authenticateToken, requireAdmin, (req, res) => {
  res.json({ users: dbFallback.getAllUsers() });
});

// Update user role
app.put('/api/admin/users/:id/role', authenticateToken, requireAdmin, (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  if (role !== 'admin' && role !== 'user') {
    res.status(400).json({ error: 'Invalid role specified.' });
    return;
  }
  const updatedUser = dbFallback.updateUserRole(id, role);
  if (!updatedUser) {
    res.status(404).json({ error: 'User not found.' });
    return;
  }
  res.json({ user: updatedUser });
});

// Delete user and cascade their scores and progress
app.delete('/api/admin/users/:id', authenticateToken, requireAdmin, (req, res) => {
  const { id } = req.params;
  const success = dbFallback.deleteUser(id);
  if (!success) {
    res.status(404).json({ error: 'User not found.' });
    return;
  }
  res.json({ success: true });
});

// GET all quiz sessions/attempts
app.get('/api/admin/sessions', authenticateToken, requireAdmin, (req, res) => {
  res.json({ sessions: dbFallback.getAllSessions() });
});

// GET system-wide stats
app.get('/api/admin/stats', authenticateToken, requireAdmin, (req, res) => {
  res.json({ stats: dbFallback.getDatabaseStats() });
});

// Reset and re-seed the entire database to original pristine conditions
app.post('/api/admin/reset', authenticateToken, requireAdmin, (req, res) => {
  dbFallback.resetDatabase();
  res.json({ success: true, message: 'Database reset and default seeds loaded successfully.' });
});

// --- DEPLOYMENT / SERVING STATIC FILES ---

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    // Mount Vite middleware in development mode to enable SPA serving
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    // Production serving of bundled client
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`QuizVerse Backend server executing on http://localhost:${PORT}`);
  });
}

startServer();
