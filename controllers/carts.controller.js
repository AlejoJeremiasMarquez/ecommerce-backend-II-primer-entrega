import Cart from '../models/cart.js';
import Product from '../models/product.js';
import Ticket from '../models/ticket.js';
import { generateUniqueCode } from '../utils/codeGenerator.js';
import EmailService from '../services/email.service.js';

// Obtener carrito actual del usuario
export const getCurrentCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('products.product');
    res.json({
      status: 'success',
      data: { cart }
    });
  } catch (error) {
    next(error);
  }
};

// Agregar producto al carrito
export const addProductToCart = async (req, res, next) => {
  try {
    const { cartId, productId } = req.params;
    const { quantity = 1 } = req.body;

    const cart = await Cart.findById(cartId);
    if (!cart) {
      return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
    }

    // Verificar stock
    if (product.stock < quantity) {
      return res.status(400).json({ status: 'error', message: 'Stock insuficiente' });
    }

    // Buscar si el producto ya está en el carrito
    const productIndex = cart.products.findIndex(p => p.product.toString() === productId);

    if (productIndex === -1) {
      cart.products.push({ product: productId, quantity });
    } else {
      cart.products[productIndex].quantity += quantity;
    }

    await cart.save();
    await cart.populate('products.product');

    res.json({
      status: 'success',
      message: 'Producto agregado al carrito',
      data: { cart }
    });
  } catch (error) {
    next(error);
  }
};

// Actualizar cantidad de un producto
export const updateProductQuantity = async (req, res, next) => {
  try {
    const { cartId, productId } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findById(cartId);
    if (!cart) {
      return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
    }

    const productIndex = cart.products.findIndex(p => p.product.toString() === productId);
    if (productIndex === -1) {
      return res.status(404).json({ status: 'error', message: 'Producto no encontrado en el carrito' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
    }

    // Verificar stock
    if (product.stock < quantity) {
      return res.status(400).json({ status: 'error', message: 'Stock insuficiente' });
    }

    cart.products[productIndex].quantity = quantity;
    await cart.save();
    await cart.populate('products.product');

    res.json({
      status: 'success',
      message: 'Cantidad actualizada',
      data: { cart }
    });
  } catch (error) {
    next(error);
  }
};

// Eliminar producto del carrito
export const removeProductFromCart = async (req, res, next) => {
  try {
    const { cartId, productId } = req.params;

    const cart = await Cart.findById(cartId);
    if (!cart) {
      return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
    }

    cart.products = cart.products.filter(p => p.product.toString() !== productId);
    await cart.save();
    await cart.populate('products.product');

    res.json({
      status: 'success',
      message: 'Producto eliminado del carrito',
      data: { cart }
    });
  } catch (error) {
    next(error);
  }
};

// Vaciar carrito
export const clearCart = async (req, res, next) => {
  try {
    const { cartId } = req.params;

    const cart = await Cart.findById(cartId);
    if (!cart) {
      return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
    }

    cart.products = [];
    await cart.save();

    res.json({
      status: 'success',
      message: 'Carrito vaciado',
      data: { cart }
    });
  } catch (error) {
    next(error);
  }
};

// Procesar compra
export const purchaseCart = async (req, res, next) => {
  try {
    const { cartId } = req.params;

    const cart = await Cart.findById(cartId).populate('products.product');
    if (!cart) {
      return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
    }

    if (cart.products.length === 0) {
      return res.status(400).json({ status: 'error', message: 'El carrito está vacío' });
    }

    // Verificar stock y calcular total
    let total = 0;
    const productsToUpdate = [];
    const failedProducts = [];

    for (const item of cart.products) {
      const product = item.product;
      if (product.stock >= item.quantity) {
        total += product.price * item.quantity;
        productsToUpdate.push({
          updateOne: {
            filter: { _id: product._id },
            update: { $inc: { stock: -item.quantity } }
          }
        });
      } else {
        failedProducts.push(product._id);
      }
    }

    if (failedProducts.length > 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Algunos productos no tienen stock suficiente',
        failedProducts
      });
    }

    // Crear ticket
    const ticket = await Ticket.create({
      code: generateUniqueCode(),
      amount: total,
      purchaser: req.user.email
    });

    // Actualizar stock de productos
    await Product.bulkWrite(productsToUpdate);

    // Vaciar carrito
    cart.products = [];
    await cart.save();

    // Enviar email de confirmación
    await EmailService.sendPurchaseConfirmation(req.user.email, ticket);

    res.json({
      status: 'success',
      message: 'Compra procesada exitosamente',
      data: { ticket }
    });
  } catch (error) {
    next(error);
  }
};
