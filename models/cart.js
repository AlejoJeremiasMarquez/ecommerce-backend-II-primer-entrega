import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
  products: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    quantity: {
      type: Number,
      default: 1,
      min: [1, 'La cantidad debe ser al menos 1']
    }
  }],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  versionKey: false
});

// Verificar si el modelo ya existe antes de compilarlo
const Cart = mongoose.models.Cart || mongoose.model('Cart', cartSchema);

export default Cart;