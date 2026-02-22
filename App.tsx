
import React, { useState, useEffect } from 'react';
import { AppState, UserProfile, Question, QuizResult, Attempt, PointRecord } from './types';
import { QUESTIONS_PER_ROUND, SCORE_PER_QUESTION } from './constants';
import { generateQuiz, calculatePoints } from './services/quizService';
import Layout from './components/Layout';
import Home from './components/Home';
import Quiz from './components/Quiz';
import Result from './components/Result';
import History from './components/History';
import Login from './components/Login';
import Profile from './components/Profile';
import ProfileSetup from './components/ProfileSetup';
import Leaderboard from './components/Leaderboard';
import Rules from './components/Rules';
import ErrorBook from './components/ErrorBook';
import RewardsStore from './components/RewardsStore';
import RedemptionHistory from './components/RedemptionHistory';
import BottomNav from './components/BottomNav';

import { dbService } from './services/dbService';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('login');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [leaderboardUsers, setLeaderboardUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load persistence on mount
  useEffect(() => {
    const initApp = async () => {
      setIsLoading(true);
      try {
        const users = await dbService.fetchAllUsers();
        setAllUsers(users);

        const savedUsername = localStorage.getItem('wordChallenge_currentUser');
        if (savedUsername) {
          // If we have a saved user, try to log them in automatically
          const user = await dbService.loginOrRegister(savedUsername);

          // Merge localStorage extras but NEVER let them overwrite Supabase-owned fields
          const extended = dbService.getExtendedProfile(user.id || '');
          const { totalPoints, highScore, history, pointRecords, ...safeExtended } = extended as any;
          const fullUser = { ...user, ...safeExtended };
          setCurrentUser(fullUser);

          if (!fullUser.schoolId) {
            setAppState('profile-setup');
          } else {
            setAppState('home');
          }
        }
      } catch (error) {
        console.error('Failed to initialize app:', error);
      } finally {
        setIsLoading(false);
      }
    };
    initApp();
  }, []);

  const [currentQuiz, setCurrentQuiz] = useState<Question[]>([]);
  const [lastResult, setLastResult] = useState<QuizResult | null>(null);

  const handleLogin = async (username: string) => {
    setIsLoading(true);
    try {
      const user = await dbService.loginOrRegister(username);

      // Merge localStorage extras but NEVER let them overwrite Supabase-owned fields
      const extended = dbService.getExtendedProfile(user.id || '');
      const { totalPoints, highScore, history, pointRecords, ...safeExtended } = extended as any;
      const fullUser = { ...user, ...safeExtended };

      setCurrentUser(fullUser);
      localStorage.setItem('wordChallenge_currentUser', username);

      // Refresh user list
      const users = await dbService.fetchAllUsers();
      setAllUsers(users);

      // Redirect logic
      if (!fullUser.schoolId) {
        setAppState('profile-setup');
      } else {
        setAppState('home');
      }
    } catch (error: any) {
      console.error('Login failed:', error);
      alert(error.message || '登录失败，请检查网络或配置');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileComplete = async (redirectHome = true) => {
    if (currentUser) {
      // Re-fetch to get updated data
      const user = await dbService.loginOrRegister(currentUser.name);
      const extended = dbService.getExtendedProfile(user.id || '');
      const { totalPoints, highScore, history, pointRecords, ...safeExtended } = extended as any;
      const fullUser = { ...user, ...safeExtended };
      setCurrentUser(fullUser);
      // Also update logic for leaderboard
      setAllUsers(prev => prev.map(u => u.id === fullUser.id ? fullUser : u));

      if (redirectHome) {
        setAppState('home');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('wordChallenge_currentUser');
    setCurrentUser(null);
    setAppState('login');
  };

  const startNewChallenge = (level: 'primary' | 'junior' | 'senior', grade?: number) => {
    const quiz = generateQuiz(level, grade);
    setCurrentQuiz(quiz);
    setAppState('quiz');
  };

  const handleQuizComplete = async (correctCount: number, timeSpent: number, attempts: Attempt[]) => {
    if (!currentUser || !currentUser.id) return;

    const score = correctCount * SCORE_PER_QUESTION;
    const totalPossibleScore = currentQuiz.length * SCORE_PER_QUESTION;
    const percentage = totalPossibleScore > 0 ? (score / totalPossibleScore) * 100 : 0;
    const points = calculatePoints(percentage);

    const result: QuizResult = {
      score,
      totalQuestions: currentQuiz.length,
      correctCount,
      timeSpent,
      pointsEarned: points,
      attempts,
      timestamp: Date.now()
    };

    try {
      await dbService.saveQuizResult(currentUser.id, result);

      const newRecords: PointRecord[] = points > 0 ? [
        ...currentUser.pointRecords,
        { amount: points, reason: `挑战成绩: ${score}分`, timestamp: Date.now() }
      ] : currentUser.pointRecords;

      setLastResult(result);
      setCurrentUser({
        ...currentUser,
        totalPoints: currentUser.totalPoints + points,
        highScore: Math.max(currentUser.highScore, score),
        history: [result, ...currentUser.history],
        pointRecords: newRecords
      });
      setAppState('result');
    } catch (error) {
      console.error('Failed to save result:', error);
      alert('保存成绩失败');
    }
  };

  // Helper to determine if bottom nav should be shown
  const showBottomNav = ['home', 'leaderboard', 'profile'].includes(appState);

  const handleCheckIn = () => {
    if (!currentUser) return;
    const today = new Date().toISOString().slice(0, 10);
    if (currentUser.lastCheckIn === today) return; // Already checked in

    // Calculate streak
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    const newStreak = (currentUser.lastCheckIn === yesterday) ? (currentUser.checkInStreak || 0) + 1 : 1;

    // Points: 20 daily + 100 bonus if streak hits 7
    let pts = 20;
    let reason = '每日签到';
    if (newStreak === 7) {
      pts += 100;
      reason = '每日签到 + 连续7天奖励';
    }

    const record = { amount: pts, reason, timestamp: Date.now() };
    const updated = {
      ...currentUser,
      lastCheckIn: today,
      checkInStreak: newStreak >= 7 ? 0 : newStreak, // Reset after 7
      totalPoints: currentUser.totalPoints + pts,
      pointRecords: [...currentUser.pointRecords, record],
    };
    setCurrentUser(updated);
    if (currentUser.id) {
      dbService.updateProfile(currentUser.id, {
        totalPoints: updated.totalPoints,
        lastCheckIn: updated.lastCheckIn,
        checkInStreak: updated.checkInStreak,
      }).catch(console.error);

      // Persist the point record
      dbService.savePointRecord(currentUser.id, pts, reason).catch(console.error);
    }
    alert(newStreak === 7 ? `🎉 签到成功！连续7天奖励，共获得 ${pts} 积分！` : `✅ 签到成功！+${pts} 积分`);
  };

  const handleDeductPoints = (amount: number, reason: string) => {
    if (!currentUser) return;
    const newPoints = currentUser.totalPoints - amount;
    const record: PointRecord = { amount: -amount, reason, timestamp: Date.now() };
    setCurrentUser({ ...currentUser, totalPoints: newPoints, pointRecords: [...currentUser.pointRecords, record] });
    if (currentUser.id) {
      // Save updated total AND the point record (negative) to Supabase
      dbService.updateProfile(currentUser.id, { totalPoints: newPoints }).catch(console.error);
      dbService.savePointRecord(currentUser.id, -amount, reason).catch(console.error);
    }
  };

  return (
    <Layout
      footer={showBottomNav ? (
        <BottomNav
          currentTab={appState as any}
          onTabChange={(tab) => {
            if (tab === 'leaderboard') {
              // Pre-fetch if needed
              setIsLoading(true);
              dbService.fetchLeaderboard().then(rankings => {
                setLeaderboardUsers(rankings as any);
                setAppState(tab);
              }).catch(err => console.error(err)).finally(() => setIsLoading(false));
            } else {
              setAppState(tab);
            }
          }}
        />
      ) : null}
    >
      {appState === 'login' && (
        <Login onLogin={handleLogin} />
      )}

      {appState === 'profile-setup' && currentUser && (
        <ProfileSetup
          user={currentUser}
          onComplete={handleProfileComplete}
        />
      )}

      {/* All Views */}
      <div className="flex-1 flex flex-col min-h-0">
        {appState === 'home' && currentUser && (
          <Home
            user={currentUser}
            onStart={startNewChallenge}
            onViewHistory={() => setAppState('history')}
            onViewRules={() => setAppState('rules')}
            onViewErrorBook={() => setAppState('error-book')}
            onCheckIn={handleCheckIn}
          />
        )}

        {appState === 'leaderboard' && currentUser && (
          <Leaderboard
            users={leaderboardUsers}
            currentUserName={currentUser.name}
          />
        )}

        {appState === 'profile' && currentUser && (
          <Profile
            user={currentUser}
            onLogout={handleLogout}
            onUpdate={handleProfileComplete}
            onViewHistory={() => setAppState('history')}
            onViewErrorBook={() => setAppState('error-book')}
            onViewRewards={() => setAppState('rewards')}
            onViewRedemptionHistory={() => setAppState('redemption-history')}
          />
        )}

        {appState === 'quiz' && currentUser && (
          <Quiz
            questions={currentQuiz}
            onComplete={handleQuizComplete}
            onCancel={() => setAppState('home')}
            userPoints={currentUser.totalPoints}
            onDeductPoints={handleDeductPoints}
          />
        )}

        {appState === 'result' && lastResult && (
          <Result
            result={lastResult}
            onRestart={() => setAppState('home')}
            onGoHome={() => setAppState('home')}
          />
        )}

        {appState === 'history' && currentUser && (
          <History
            history={currentUser.history}
            onBack={() => setAppState('profile')}
          />
        )}

        {appState === 'error-book' && currentUser && (
          <ErrorBook
            user={currentUser}
            onBack={() => setAppState('profile')}
          />
        )}

        {appState === 'rules' && (
          <Rules onBack={() => setAppState('home')} />
        )}

        {appState === 'rewards' && currentUser && (
          <RewardsStore
            user={currentUser}
            onBack={() => setAppState('profile')}
            onDeductPoints={handleDeductPoints}
            onViewRedemptionHistory={() => setAppState('redemption-history')}
          />
        )}

        {appState === 'redemption-history' && currentUser && (
          <RedemptionHistory
            pointRecords={currentUser.pointRecords}
            currentPoints={currentUser.totalPoints}
            onBack={() => setAppState('profile')}
          />
        )}
      </div>

      {isLoading && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-white/70 font-medium text-sm">加载中...</p>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default App;
