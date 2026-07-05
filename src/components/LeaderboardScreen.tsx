import { useEffect, useState } from 'react';
import { useQuizStore } from '../store/quizStore';
import { Trophy, Award, Calendar, RefreshCw, Zap, Medal } from 'lucide-react';
import { motion } from 'motion/react';

export default function LeaderboardScreen() {
  const { leaderboard, leaderboardTrack, leaderboardPeriod, fetchLeaderboard, tracks, fetchTracks } = useQuizStore();
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchLeaderboard();
    fetchTracks();
  }, [fetchLeaderboard, fetchTracks]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchLeaderboard(leaderboardTrack, leaderboardPeriod);
    setIsRefreshing(false);
  };

  const handleTrackChange = (track: string) => {
    fetchLeaderboard(track, leaderboardPeriod);
  };

  const handlePeriodChange = (period: 'weekly' | 'alltime') => {
    fetchLeaderboard(leaderboardTrack, period);
  };

  // Top 3 Podium Extraction
  const podium = leaderboard.slice(0, 3);
  const remainder = leaderboard.slice(3);

  // Position styles for podium cards
  const podiumOrder = [
    { rank: 2, data: podium[1], border: 'border-[#00F0FF]', medal: '🥈', height: 'h-36' },
    { rank: 1, data: podium[0], border: 'border-[#FFE600]', medal: '👑', height: 'h-44' },
    { rank: 3, data: podium[2], border: 'border-[#FF0055]', medal: '🥉', height: 'h-32' }
  ].filter(p => p.data !== undefined); // filter out empty podiums if list is short

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8" id="leaderboard-container">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#111111] border-2 border-[#222222] p-6 rounded-none shadow-xs" id="leaderboard-header">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-2 uppercase tracking-tight">
            <Trophy className="w-6 h-6 text-[#FFE600]" />
            <span>Competitive Standings</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-mono uppercase tracking-wider">
            Global point standings calculated from accurate, timed quiz session results
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-4 py-2.5 text-xs font-black uppercase tracking-wider bg-[#050505] border-2 border-[#222222] hover:border-[#00F0FF] text-[#00F0FF] transition-all cursor-pointer disabled:opacity-50 rounded-none"
          id="refresh-leaderboard-btn"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Sync Scores</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 bg-[#111111] border-2 border-[#222222] p-3 rounded-none" id="leaderboard-filters-toolbar">
        {/* Track Filters */}
        <div className="flex flex-wrap gap-1.5" id="leaderboard-tracks-filters">
          <button
            onClick={() => handleTrackChange('all')}
            className={`px-3 py-1.5 text-xs font-black uppercase tracking-widest border transition-all cursor-pointer rounded-none ${
              leaderboardTrack === 'all'
                ? 'bg-[#FFE600] text-black border-white'
                : 'text-gray-400 border-[#222222] hover:border-gray-600 hover:text-white'
            }`}
          >
            All Tracks
          </button>
          {tracks.map(t => (
            <button
              key={t._id}
              onClick={() => handleTrackChange(t.slug)}
              className={`px-3 py-1.5 text-xs font-black uppercase tracking-widest border transition-all cursor-pointer rounded-none ${
                leaderboardTrack === t.slug
                  ? 'bg-[#00F0FF] text-black border-white'
                  : 'text-gray-400 border-[#222222] hover:border-gray-600 hover:text-white'
              }`}
            >
              {t.name.split(' ')[0]}
            </button>
          ))}
        </div>

        {/* Time Period Filters */}
        <div className="flex gap-1.5 bg-[#050505] p-1 border border-[#222222] rounded-none w-fit font-mono" id="leaderboard-time-filters">
          <button
            onClick={() => handlePeriodChange('weekly')}
            className={`px-3 py-1 text-xs font-black uppercase tracking-widest transition-all cursor-pointer rounded-none ${
              leaderboardPeriod === 'weekly'
                ? 'bg-[#FF0055] text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => handlePeriodChange('alltime')}
            className={`px-3 py-1 text-xs font-black uppercase tracking-widest transition-all cursor-pointer rounded-none ${
              leaderboardPeriod === 'alltime'
                ? 'bg-[#FF0055] text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All-Time
          </button>
        </div>
      </div>

      {/* Top 3 Podium Displays */}
      {podium.length > 0 && (
        <div className="grid grid-cols-3 gap-4 items-end max-w-2xl mx-auto pt-6" id="leaderboard-podium">
          {podiumOrder.map(item => (
            <div key={item.rank} className="flex flex-col items-center">
              {/* Profile image with crown/medal marker */}
              <div className="relative mb-2">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-2xl z-10 filter drop-shadow-md">
                  {item.medal}
                </div>
                <img
                  src={item.data.userAvatar}
                  alt={item.data.userName}
                  className="w-12 h-12 rounded-none object-cover border-2 border-white shadow-md"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Podium Column Block */}
              <div className={`w-full bg-[#111111] border-2 ${item.border} rounded-none flex flex-col justify-center items-center text-center p-3 sm:p-4 shadow-sm ${item.height}`} id={`podium-col-${item.rank}`}>
                <div className="text-2xl font-black text-white font-mono">
                  #{item.rank}
                </div>
                <div className="text-xs font-black uppercase tracking-wider text-slate-300 truncate max-w-full mt-1">
                  {item.data.userName.split('_')[0]}
                </div>
                <div className="text-xs font-mono font-black text-[#FFE600] mt-2">
                  {item.data.score}
                </div>
                <div className="text-[8px] uppercase tracking-wider text-slate-500 font-bold mt-0.5 font-mono">
                  pts
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Remaining Users List */}
      <div className="bg-[#111111] border-2 border-[#222222] rounded-none overflow-hidden shadow-xs" id="leaderboard-rest-list">
        {leaderboard.length === 0 ? (
          <div className="p-12 text-center text-slate-500" id="empty-leaderboard-view font-mono">
            <Medal className="w-12 h-12 text-[#FFE600] mx-auto mb-3 animate-pulse" />
            <p className="text-sm font-black uppercase tracking-wider">No standings logged for this interval yet.</p>
            <p className="text-xs mt-1 uppercase">Be the first to secure a spot on the podium!</p>
          </div>
        ) : (
          <div className="divide-y divide-[#222222]" id="leaderboard-rows">
            {leaderboard.map((entry, idx) => {
              const actualRank = entry.rank || (idx + 1);
              // Skip podium rankings since we display them on podium
              const isPodium = actualRank <= 3;

              return (
                <div
                  key={`${entry.userId}_${entry.score}_${idx}`}
                  className={`flex items-center justify-between p-4 px-6 transition-colors hover:bg-slate-950/20 ${
                    isPodium ? 'bg-[#FFE600]/5' : ''
                  }`}
                  id={`leaderboard-row-${idx}`}
                >
                  <div className="flex items-center gap-4">
                    {/* Rank indicator */}
                    <div className="w-6 text-center font-mono text-sm font-black text-[#FFE600]">
                      {isPodium ? (actualRank === 1 ? '👑' : actualRank === 2 ? '🥈' : '🥉') : `#${actualRank}`}
                    </div>

                    {/* Profile avatar */}
                    <img
                      src={entry.userAvatar}
                      alt={entry.userName}
                      className="w-9 h-9 rounded-none object-cover border border-[#222222] shadow-xs"
                      referrerPolicy="no-referrer"
                    />

                    {/* Name */}
                    <div>
                      <div className="text-sm font-black text-white">
                        {entry.userName}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono capitalize">
                        {entry.trackId === 'all' ? 'All Subjects' : entry.trackId} Track
                      </div>
                    </div>
                  </div>

                  {/* Score */}
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-sm font-black font-mono text-[#00F0FF]">
                        {entry.score}
                      </div>
                      <div className="text-[9px] uppercase tracking-wider font-bold text-slate-500 font-mono">
                        pts
                      </div>
                    </div>

                    <div className="p-1 border border-[#00F0FF]/30 text-[#00F0FF]">
                      <Zap className="w-3.5 h-3.5 fill-[#00F0FF]" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
