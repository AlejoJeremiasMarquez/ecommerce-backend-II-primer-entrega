// ========================================
// MIDDLEWARE PARA VERIFICAR ROL DE ADMIN
// ========================================
export const isAdmin = (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'No autenticado'
      });
    }
  
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Acceso denegado. Se requieren permisos de administrador'
      });
    }
  
    next();
  };
  
  // ========================================
  // MIDDLEWARE PARA VERIFICAR ROL DE USER
  // ========================================
  export const isUser = (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'No autenticado'
      });
    }
  
    if (req.user.role !== 'user') {
      return res.status(403).json({
        status: 'error',
        message: 'Solo los usuarios pueden realizar esta acción'
      });
    }
  
    next();
  };
  
  // ========================================
  // MIDDLEWARE PARA VERIFICAR PROPIEDAD DEL RECURSO
  // ========================================
  export const isOwnerOrAdmin = (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'No autenticado'
      });
    }
  
    const userId = req.params.id;
    const isOwner = req.user._id.toString() === userId;
    const isAdmin = req.user.role === 'admin';
  
    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        status: 'error',
        message: 'No tienes permisos para realizar esta acción'
      });
    }
  
    next();
  };
  
  // ========================================
  // MIDDLEWARE PARA VERIFICAR PROPIEDAD DEL CARRITO
  // ========================================
  export const isCartOwner = async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'No autenticado'
      });
    }
  
    const cartId = req.params.cid;
    
    // Verificar que el carrito pertenezca al usuario
    if (req.user.cart && req.user.cart.toString() === cartId) {
      return next();
    }
  
    // Los admins pueden acceder a cualquier carrito
    if (req.user.role === 'admin') {
      return next();
    }
  
    return res.status(403).json({
      status: 'error',
      message: 'No tienes acceso a este carrito'
    });
  };