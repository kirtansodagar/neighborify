import logger from './logger.js';

export function auditLog(action, userId, details = {}) {
  const logData = {
    type: 'audit',
    action,
    userId: userId ? String(userId) : 'anonymous',
    ...details,
    timestamp: new Date().toISOString()
  };
  logger.info(JSON.stringify(logData));
}

export function auditFailedLogin(phone, reason) {
  auditLog('LOGIN_FAILED', null, { phone: phone ? phone.substring(0, 6) + '****' : 'unknown', reason });
}

export function auditSuccessfulLogin(userId) {
  auditLog('LOGIN_SUCCESS', userId);
}

export function auditAdminAction(adminId, action, targetId, targetModel) {
  auditLog('ADMIN_ACTION', adminId, { adminAction: action, targetId: String(targetId), targetModel });
}

export function auditSensitiveAction(userId, action, details = {}) {
  auditLog(action, userId, details);
}
