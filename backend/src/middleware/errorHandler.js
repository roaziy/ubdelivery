// Global error handler middleware
export function errorHandler(err, req, res, next) {
  console.error('Error:', err);

  // Multer errors
  if (err.name === 'MulterError') {
    return res.status(400).json({
      success: false,
      message: getMulterErrorMessage(err.code)
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Токен буруу байна'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Токены хугацаа дууссан'
    });
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }

  // Default error
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Серверийн алдаа гарлаа';

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
}

function getMulterErrorMessage(code) {
  const messages = {
    LIMIT_FILE_SIZE: 'Файлын хэмжээ хэт их байна',
    LIMIT_FILE_COUNT: 'Хэт олон файл оруулсан байна',
    LIMIT_UNEXPECTED_FILE: 'Буруу талбар дээр файл оруулсан',
    LIMIT_PART_COUNT: 'Хэт олон хэсэг байна',
    LIMIT_FIELD_KEY: 'Талбарын нэр хэт урт байна',
    LIMIT_FIELD_VALUE: 'Талбарын утга хэт урт байна',
    LIMIT_FIELD_COUNT: 'Хэт олон талбар байна'
  };
  return messages[code] || 'Файл оруулахад алдаа гарлаа';
}

// Not found handler
export function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    message: 'Хайсан зам олдсонгүй'
  });
}

// Async handler wrapper
export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
