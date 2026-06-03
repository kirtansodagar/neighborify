export function formatINR(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(Number(amount || 0));
}

export function timeAgo(date) {
  const seconds = Math.max(0, Math.floor((Date.now() - new Date(date).getTime()) / 1000));

  if (seconds < 60) return 'just now';

  const units = [
    ['year', 365 * 24 * 60 * 60],
    ['month', 30 * 24 * 60 * 60],
    ['day', 24 * 60 * 60],
    ['hour', 60 * 60],
    ['minute', 60]
  ];

  for (const [unit, size] of units) {
    const value = Math.floor(seconds / size);
    if (value >= 1) {
      return `${value} ${unit}${value === 1 ? '' : 's'} ago`;
    }
  }

  return 'just now';
}

export function truncate(str, maxLength) {
  const value = String(str || '');

  if (value.length <= maxLength) {
    return value;
  }

  const trimmed = value.slice(0, Math.max(0, maxLength - 3));
  const boundary = trimmed.lastIndexOf(' ');
  const output = boundary > 0 ? trimmed.slice(0, boundary) : trimmed;

  return `${output}...`;
}

export function slugify(str) {
  return String(str || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function maskPhone(phone) {
  const value = String(phone || '');
  const match = value.match(/^(\+91)([6-9]\d{4})\d{4}(\d)$/);

  if (!match) {
    return value;
  }

  return `${match[1]} ${match[2]} ****`;
}
