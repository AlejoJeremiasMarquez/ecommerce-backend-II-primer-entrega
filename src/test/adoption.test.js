import { expect } from 'chai';
import supertest from 'supertest';
import app from '../../app.js';

const requester = supertest(app);

describe('Testing Adoption Router', () => {
  let authToken;
  let adminToken;
  let userId;
  let productId;
  let cartId;

  // Setup: Login antes de las pruebas
  before(async function() {
    this.timeout(5000);

    // Login como usuario normal
    const userLogin = await requester
      .post('/api/sessions/login')
      .send({
        email: 'juan@example.com',
        password: 'user123'
      });

    if (userLogin.body.data && userLogin.body.data.token) {
      authToken = userLogin.body.data.token;
      userId = userLogin.body.data.user._id;
      cartId = userLogin.body.data.user.cart;
    }

    // Login como admin
    const adminLogin = await requester
      .post('/api/sessions/login')
      .send({
        email: 'admin@ecommerce.com',
        password: 'admin123'
      });

    if (adminLogin.body.data && adminLogin.body.data.token) {
      adminToken = adminLogin.body.data.token;
    }

    // Crear un producto de prueba para usar en adoption
    const productResponse = await requester
      .post('/api/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Producto Test Adoption',
        description: 'Producto para pruebas',
        code: 'TEST-ADOPT-001',
        price: 1000,
        stock: 10,
        category: 'Test'
      });

    if (productResponse.body.data) {
      productId = productResponse.body.data.product._id;
    }
  });

  // ========================================
  // TEST 1: GET /api/carts/:cid - Obtener carrito
  // ========================================
  describe('GET /api/carts/:cid', () => {
    it('Debe obtener el carrito del usuario autenticado', async () => {
      const response = await requester
        .get(`/api/carts/${cartId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('status', 'success');
      expect(response.body.data).to.have.property('cart');
    });

    it('Debe fallar sin autenticación', async () => {
      const response = await requester
        .get(`/api/carts/${cartId}`);

      expect(response.status).to.equal(401);
    });

    it('Debe fallar con carrito inexistente', async () => {
      const response = await requester
        .get('/api/carts/507f1f77bcf86cd799439011')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).to.be.oneOf([403, 404]);
    });
  });

  // ========================================
  // TEST 2: POST /api/carts/:cid/products/:pid - Agregar producto
  // ========================================
  describe('POST /api/carts/:cid/products/:pid', () => {
    it('Debe agregar un producto al carrito (solo user)', async () => {
      const response = await requester
        .post(`/api/carts/${cartId}/products/${productId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ quantity: 2 });

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('status', 'success');
      expect(response.body.data).to.have.property('cart');
    });

    it('Debe fallar si el admin intenta agregar al carrito', async () => {
      const response = await requester
        .post(`/api/carts/${cartId}/products/${productId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: 1 });

      expect(response.status).to.equal(403);
    });

    it('Debe fallar sin autenticación', async () => {
      const response = await requester
        .post(`/api/carts/${cartId}/products/${productId}`)
        .send({ quantity: 1 });

      expect(response.status).to.equal(401);
    });

    it('Debe fallar con producto inexistente', async () => {
      const response = await requester
        .post(`/api/carts/${cartId}/products/507f1f77bcf86cd799439011`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ quantity: 1 });

      expect(response.status).to.be.oneOf([404, 500]);
    });
  });

  // ========================================
  // TEST 3: DELETE /api/carts/:cid/products/:pid - Eliminar producto
  // ========================================
  describe('DELETE /api/carts/:cid/products/:pid', () => {
    it('Debe eliminar un producto del carrito', async () => {
      const response = await requester
        .delete(`/api/carts/${cartId}/products/${productId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('status', 'success');
    });

    it('Debe fallar sin autenticación', async () => {
      const response = await requester
        .delete(`/api/carts/${cartId}/products/${productId}`);

      expect(response.status).to.equal(401);
    });
  });

  // ========================================
  // TEST 4: DELETE /api/carts/:cid - Vaciar carrito
  // ========================================
  describe('DELETE /api/carts/:cid', () => {
    it('Debe vaciar el carrito completamente', async () => {
      const response = await requester
        .delete(`/api/carts/${cartId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('status', 'success');
      expect(response.body.data.cart.products).to.be.an('array').that.is.empty;
    });

    it('Debe fallar sin autenticación', async () => {
      const response = await requester
        .delete(`/api/carts/${cartId}`);

      expect(response.status).to.equal(401);
    });
  });

  // ========================================
  // TEST 5: POST /api/carts/:cid/purchase - Finalizar compra (ADOPTION)
  // ========================================
  describe('POST /api/carts/:cid/purchase - PROCESO DE ADOPCIÓN', () => {
    // Preparar carrito con productos
    before(async () => {
      await requester
        .post(`/api/carts/${cartId}/products/${productId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ quantity: 1 });
    });

    it('Debe finalizar la compra exitosamente', async () => {
      const response = await requester
        .post(`/api/carts/${cartId}/purchase`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('status', 'success');
      expect(response.body.data).to.have.property('ticket');
      expect(response.body.data.ticket).to.have.property('code');
      expect(response.body.data.ticket).to.have.property('amount');
      expect(response.body.data.ticket).to.have.property('purchaser');
    });

    it('Debe fallar si el carrito está vacío', async () => {
      const response = await requester
        .post(`/api/carts/${cartId}/purchase`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).to.be.oneOf([400, 404]);
    });

    it('Debe fallar sin autenticación', async () => {
      const response = await requester
        .post(`/api/carts/${cartId}/purchase`);

      expect(response.status).to.equal(401);
    });

    it('Debe fallar si un admin intenta comprar', async () => {
      const response = await requester
        .post(`/api/carts/${cartId}/purchase`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).to.equal(403);
    });
  });

  // ========================================
  // TEST 6: GET /api/tickets/my-tickets - Obtener tickets del usuario
  // ========================================
  describe('GET /api/tickets/my-tickets', () => {
    it('Debe obtener los tickets del usuario autenticado', async () => {
      const response = await requester
        .get('/api/tickets/my-tickets')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('status', 'success');
      expect(response.body.data).to.have.property('tickets');
      expect(response.body.data.tickets).to.be.an('array');
    });

    it('Debe fallar sin autenticación', async () => {
      const response = await requester
        .get('/api/tickets/my-tickets');

      expect(response.status).to.equal(401);
    });
  });

  // ========================================
  // TEST 7: Flujo completo de adopción (E2E)
  // ========================================
  describe('FLUJO COMPLETO DE ADOPCIÓN (E2E)', () => {
    it('Debe completar el flujo: agregar → ver carrito → comprar → verificar ticket', async function() {
      this.timeout(10000);

      // Paso 1: Agregar producto al carrito
      const addResponse = await requester
        .post(`/api/carts/${cartId}/products/${productId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ quantity: 3 });

      expect(addResponse.status).to.equal(200);

      // Paso 2: Verificar carrito
      const cartResponse = await requester
        .get(`/api/carts/${cartId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(cartResponse.status).to.equal(200);
      expect(cartResponse.body.data.cart.products).to.have.lengthOf.at.least(1);

      // Paso 3: Finalizar compra
      const purchaseResponse = await requester
        .post(`/api/carts/${cartId}/purchase`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(purchaseResponse.status).to.equal(200);
      expect(purchaseResponse.body.data).to.have.property('ticket');

      const ticketCode = purchaseResponse.body.data.ticket.code;

      // Paso 4: Verificar que el ticket aparece en mis tickets
      const ticketsResponse = await requester
        .get('/api/tickets/my-tickets')
        .set('Authorization', `Bearer ${authToken}`);

      expect(ticketsResponse.status).to.equal(200);
      const foundTicket = ticketsResponse.body.data.tickets.find(
        t => t.code === ticketCode
      );
      expect(foundTicket).to.exist;
    });
  });

  // Cleanup: Eliminar producto de prueba
  after(async () => {
    if (productId && adminToken) {
      await requester
        .delete(`/api/products/${productId}`)
        .set('Authorization', `Bearer ${adminToken}`);
    }
  });
});