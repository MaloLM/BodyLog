import React, { useMemo } from 'react';
import { Marker } from '../types';

interface StatsBarProps {
  markers: Marker[];
}

export const StatsBar: React.FC<StatsBarProps> = ({ markers }) => {
  const stats = useMemo(() => {
    const totalEntries = markers.reduce((sum, m) => sum + m.entries.length, 0);
    const totalImages = markers.reduce(
      (sum, m) => sum + m.entries.filter((e) => e.imageUrl).length,
      0
    );

    const statusCounts = { active: 0, monitoring: 0, resolved: 0 };
    for (const m of markers) {
      const s = m.status || 'active';
      statusCounts[s]++;
    }

    // Find most recent entry date
    let lastActivity = '';
    for (const m of markers) {
      for (const e of m.entries) {
        if (!lastActivity || e.date > lastActivity) lastActivity = e.date;
      }
    }

    return { totalEntries, totalImages, statusCounts, lastActivity };
  }, [markers]);

  if (markers.length === 0) return null;

  return (
    <div className="mx-4 mt-3 mb-1 bg-slate-800/40 rounded-xl p-3.5 border border-slate-700/30 space-y-2.5">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-3">
          <span className="text-slate-400">
            <span className="text-white font-bold">{markers.length}</span> point{markers.length > 1 ? 's' : ''}
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">
            <span className="text-white font-bold">{stats.totalEntries}</span> entrée{stats.totalEntries > 1 ? 's' : ''}
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">
            <span className="text-white font-bold">{stats.totalImages}</span> image{stats.totalImages > 1 ? 's' : ''}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {stats.statusCounts.active > 0 && (
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 font-medium">
            {stats.statusCounts.active} actif{stats.statusCounts.active > 1 ? 's' : ''}
          </span>
        )}
        {stats.statusCounts.monitoring > 0 && (
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium">
            {stats.statusCounts.monitoring} en observation
          </span>
        )}
        {stats.statusCounts.resolved > 0 && (
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 font-medium">
            {stats.statusCounts.resolved} résolu{stats.statusCounts.resolved > 1 ? 's' : ''}
          </span>
        )}
        {stats.lastActivity && (
          <span className="text-xs text-slate-500 ml-auto">
            Dernière activité : {stats.lastActivity}
          </span>
        )}
      </div>
    </div>
  );
};
