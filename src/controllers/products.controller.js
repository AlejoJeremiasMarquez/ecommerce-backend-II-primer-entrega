import ProductRepository from '../repositories/product.repository.js';

// ========================================
// OBTENER TODOS LOS PRODUCTOS
// ========================================
export const getAllProducts = async (req, res, next) => {
  try {
    const products = await ProductRepository.getAllProducts();
    
    res.json({
      status: 'success',
      results: products.length,
      data: {
        products
      }
    });
  } catch (error) {
    next(error);
  }
};

// ========================================
// OBTENER PRODUCTO POR ID
// ========================================
export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await ProductRepository.getProductById(id);

    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Producto no encontrado'
      });
    }

    res.json({
      status: 'success',
      data: {
        product
      }
    });
  } catch (error) {
    next(error);
  }
};

// ========================================
// CREAR PRODUCTO (Solo Admin)
// ========================================
export const createProduct = async (req, res, next) => {
  try {
    const productData = {
      ...req.body,
      owner: req.user._id
    };

    const product = await ProductRepository.createProduct(productData);

    res.status(201).json({
      status: 'success',
      message: 'Producto creado exitosamente',
      data: {
        product
      }
    });
  } catch (error) {
    next(error);
  }
};

// ========================================
// ACTUALIZAR PRODUCTO (Solo Admin)
// ========================================
export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await ProductRepository.updateProduct(id, req.body);

    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Producto no encontrado'
      });
    }

    res.json({
      status: 'success',
      message: 'Producto actualizado exitosamente',
      data: {
        product
      }
    });
  } catch (error) {
    next(error);
  }
};

// ========================================
// ELIMINAR PRODUCTO (Solo Admin)
// ========================================
export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await ProductRepository.deleteProduct(id);

    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Producto no encontrado'
      });
    }

    res.json({
      status: 'success',
      message: 'Producto eliminado exitosamente',
      data: null
    });
  } catch (error) {
    next(error);
  }
};