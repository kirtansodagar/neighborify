export function success(res, message, data = null, statusCode = 200, pagination = null) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    pagination
  });
}

export function error(res, message, statusCode = 500, err = null) {
  return res.status(statusCode).json({
    success: false,
    message,
    error: process.env.NODE_ENV === 'development' ? err?.message || null : null
  });
}

export function paginate(page, limit, total) {
  const normalizedPage = Number(page);
  const normalizedLimit = Number(limit);

  return {
    page: normalizedPage,
    limit: normalizedLimit,
    total,
    hasMore: normalizedPage * normalizedLimit < total
  };
}
