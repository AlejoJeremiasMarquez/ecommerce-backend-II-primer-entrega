import TicketDAO from '../dao/Ticket.dao.js';
import ProductDAO from '../dao/Product.dao.js';
import CartDAO from '../dao/Cart.dao.js';

class TicketRepository {
  async createTicket(ticketData) {
    return await TicketDAO.create(ticketData);
  }

  async getTicketById(id) {
    return await TicketDAO.findById(id);
  }

  async getTicketsByUser(email) {
    return await TicketDAO.findByPurchaser(email);
  }

  async getAllTickets() {
    return await TicketDAO.findAll();
  }

  async processPurchase(cartId, purchaserEmail) {
    const cart = await CartDAO.findById(cartId);
    
    if (!cart || cart.products.length === 0) {
      throw new Error('El carrito está vacío');
    }

    const productsToProcess = [];
    const productsWithoutStock = [];
    let totalAmount = 0;

    // Verificar stock de cada producto
    for (const item of cart.products) {
      const product = await ProductDAO.findById(item.product._id);
      
      if (!product) {
        productsWithoutStock.push(item.product._id);
        continue;
      }

      if (product.stock >= item.quantity) {
        // Hay stock suficiente
        productsToProcess.push({
          product: product._id,
          quantity: item.quantity,
          price: product.price
        });
        totalAmount += product.price * item.quantity;
        
        // Descontar stock
        await ProductDAO.updateStock(product._id, item.quantity);
      } else {
        // No hay stock suficiente
        productsWithoutStock.push(item.product._id);
      }
    }

    // Si no hay productos procesables, lanzar error
    if (productsToProcess.length === 0) {
      return {
        success: false,
        message: 'Ningún producto pudo ser procesado por falta de stock',
        productsWithoutStock
      };
    }

    // Crear ticket
    const ticket = await this.createTicket({
      amount: totalAmount,
      purchaser: purchaserEmail,
      products: productsToProcess
    });

    // Actualizar carrito: dejar solo productos sin stock
    if (productsWithoutStock.length > 0) {
      const remainingProducts = cart.products.filter(item =>
        productsWithoutStock.includes(item.product._id.toString())
      );
      await CartDAO.update(cartId, { products: remainingProducts });
    } else {
      await CartDAO.clearCart(cartId);
    }

    return {
      success: true,
      ticket,
      productsWithoutStock
    };
  }
}

export default new TicketRepository();