// Small formatting + timer helpers used across AgriTrack screens.

export const formatCurrency = (n) => {
  const v = Number(n ?? 0);
  return '₹' + v.toLocaleString('en-IN', { maximumFractionDigits: 2 });
};

export const formatDate = (d) => {
  if (!d) return '-';
  try {
    const date = new Date(d);
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch { return String(d); }
};

export const formatDateTime = (d) => {
  if (!d) return '-';
  try {
    const date = new Date(d);
    return date.toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
  } catch { return String(d); }
};

// seconds -> HH:MM:SS
export const formatDuration = (totalSeconds) => {
  const s = Math.max(0, Math.floor(totalSeconds || 0));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const pad = (x) => String(x).padStart(2, '0');
  return `${pad(h)}:${pad(m)}:${pad(sec)}`;
};

export const minutesToLabel = (mins) => {
  const m = Number(mins ?? 0);
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  const r = m % 60;
  return r ? `${h}h ${r}m` : `${h}h`;
};

// status -> AppBadge variant
export const statusVariant = (status) => {
  const s = String(status || '').toUpperCase();
  if (['COMPLETED', 'SUCCESS', 'PAID', 'ACCEPTED', 'AVAILABLE'].includes(s)) return 'success';
  if (['PENDING', 'RUNNING', 'UNPAID', 'PARTIAL'].includes(s)) return 'warning';
  if (['REJECTED', 'FAILED', 'CANCELLED'].includes(s)) return 'error';
  if (['PAUSED', 'BUSY', 'MAINTENANCE'].includes(s)) return 'info';
  return 'neutral';
};
