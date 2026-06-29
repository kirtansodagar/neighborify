import xss from 'xss';

const xssOptions = {
  whiteList: {},
  stripIgnoreTag: true,
  stripIgnoreTagBody: ['script', 'style'],
  css: false,
};

export function sanitizeHtml(input) {
  if (typeof input !== 'string') return input;
  return xss(input, xssOptions);
}

export function sanitizeText(input, maxLength = 5000) {
  if (typeof input !== 'string') return '';
  const sanitized = xss(input, { whiteList: {}, stripIgnoreTag: true });
  return sanitized.trim().substring(0, maxLength);
}

export function sanitizeTitle(input) {
  return sanitizeText(input, 200);
}

export function sanitizeBody(input) {
  return sanitizeText(input, 5000);
}