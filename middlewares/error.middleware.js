// ========================================
// MANEJADOR DE ERRORES DE PASSPORT
// ========================================
export const passportErrorHandler = (err, req, res, next) => {
    if (err.name === 'AuthenticationError') {
    return res.status(401).json({
        status: 'error',
        message: err.message || 'Error de autenticación'
    });
    }
    next(err);
};

// ========================================
// MANEJADOR GLOBAL DE ERRORES
// ========================================
export const globalErrorHandler = (err, req, res, next) => {
    console.error('Error:', err);

    // Error de validación de Mongoose
    if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
        status: 'error',
        message: 'Error de validación',
        errors
    });
    }

    // Error de duplicado (email único)
    if (err.code === 11000) {
    return res.status(400).json({
        status: 'error',
        message: 'El email ya está registrado'
    });
    }

    // Error de JWT
    if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
        status: 'error',
        message: 'Token inválido'
    });
    }

    if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
        status: 'error',
        message: 'Token expirado'
    });
    }

    // Error genérico
    res.status(err.statusCode || 500).json({
    status: 'error',
    message: err.message || 'Error interno del servidor'
    });
};