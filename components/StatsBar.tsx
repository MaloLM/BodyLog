import React, { useMemo } from 'react';
import { Eye } from 'lucide-react';
import { Marker } from '../types';
import { useTranslation } from '../i18n';

interface StatsBarProps {
  markers: Marker[];
  onReviewAll?: () => void;
}

export const StatsBar: React.FC<StatsBarProps> = ({ markers, onReviewAll }) => {
  const { t } = useTranslation();
  const stats = useMemo(() => {
    let totalEntries = 0;
    let totalImages = 0;
    let lastActivity = '';
    const statusCounts = { active: 0, monitoring: 0, resolved: 0 };

    for (const m of markers) {
      statusCounts[m.status || 'active']++;
      for (const e of m.entries) {
        totalEntries++;
        if (e.imageUrl) totalImages++;
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
          <span className="text-slate-400">{t.pointCount(markers.length)}</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">{t.entryCount(stats.totalEntries)}</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">{t.imageCount(stats.totalImages)}</span>
        </div>
        {onReviewAll && stats.totalEntries > 0 && (
          <button
            onClick={onReviewAll}
            className="text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors flex items-center gap-1"
          >
            <Eye size={14} />
            {t.reviewAll}
          </button>
        )}
      </div>

      <div className="flex items-center gap-2">
        {stats.statusCounts.active > 0 && (
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 font-medium">
            {t.activeCount(stats.statusCounts.active)}
          </span>
        )}
        {stats.statusCounts.monitoring > 0 && (
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium">
            {t.monitoringCount(stats.statusCounts.monitoring)}
          </span>
        )}
        {stats.statusCounts.resolved > 0 && (
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 font-medium">
            {t.resolvedCount(stats.statusCounts.resolved)}
          </span>
        )}
        {stats.lastActivity && (
          <span className="text-xs text-slate-500 ml-auto">
            {t.lastActivity} {stats.lastActivity}
          </span>
        )}
      </div>
    </div>
  );
};
