// ========================================
// USER DTO - Data Transfer Object
// Evita enviar información sensible
// ========================================

export class UserDTO {
    constructor(user) {
        this.id = user._id;
        this.first_name = user.first_name;
        this.last_name = user.last_name;
        this.email = user.email;
        this.age = user.age;
        this.role = user.role;
        this.cart = user.cart;
        this.full_name = `${user.first_name} ${user.last_name}`;
    }
}

export class UserPublicDTO {
    constructor(user) {
        this.id = user._id;
        this.full_name = `${user.first_name} ${user.last_name}`;
        this.email = user.email;
        this.role = user.role;
    }
}

export class UserCurrentDTO {
    constructor(user) {
        this.id = user._id;
        this.first_name = user.first_name;
        this.last_name = user.last_name;
        this.email = user.email;
        this.role = user.role;
        this.cart = user.cart;
    }
}