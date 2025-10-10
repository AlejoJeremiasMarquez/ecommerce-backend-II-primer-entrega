import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: [true, 'El nombre es requerido'],
    trim: true
  },
  last_name: {
    type: String,
    required: [true, 'El apellido es requerido'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'El email es requerido'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Por favor ingrese un email válido']
  },
  age: {
    type: Number,
    required: [true, 'La edad es requerida'],
    min: [18, 'Debe ser mayor de 18 años']
  },
  password: {
    type: String,
    required: [true, 'La contraseña es requerida']
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cart'
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  resetPasswordToken: {
    type: String
  },
  resetPasswordExpires: {
    type: Date
  }
}, {
  timestamps: true,
  versionKey: false
});

// Método para ocultar la contraseña en las respuestas JSON
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

// Verificar si el modelo ya existe antes de compilarlo
const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;