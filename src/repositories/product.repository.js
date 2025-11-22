import Product from '../models/product.js';

class ProductRepository {
  async getAll(limit = 10, page = 1, sort = '', query = {}) {
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: sort ? { price: sort === 'asc' ? 1 : -1 } : undefined
    };

    return await Product.paginate(query, options);
  }

  async getById(id) {
    return await Product.findById(id);
  }

  async create(productData) {
    return await Product.create(productData);
  }

  async update(id, productData) {
    return await Product.findByIdAndUpdate(id, productData, { new: true });
  }

  async delete(id) {
    return await Product.findByIdAndDelete(id);
  }

  async getByCategory(category) {
    return await Product.find({ category });
  }
}

const productRepository = new ProductRepository();
export default productRepository;
