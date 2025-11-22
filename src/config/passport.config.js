    import passport from 'passport';
    import { Strategy as LocalStrategy } from 'passport-local';
    import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
    import bcrypt from 'bcrypt';
    import User from '../models/user.js';

    // Configuración de variables de entorno
    const JWT_SECRET = process.env.JWT_SECRET || 'tu_clave_secreta_super_segura';

    // ========================================
    // ESTRATEGIA LOCAL PARA REGISTER
    // ========================================
    passport.use('register', new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
    async (req, email, password, done) => {
        try {
        const { first_name, last_name, age, role } = req.body;

        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return done(null, false, { message: 'El email ya está registrado' });
        }

        // Validaciones básicas
        if (!first_name || !last_name || !age) {
            return done(null, false, { message: 'Todos los campos son requeridos' });
        }

        // Hashear la contraseña con bcrypt
        const hashedPassword = bcrypt.hashSync(password, 10);

        // Crear nuevo usuario
        const newUser = await User.create({
            first_name,
            last_name,
            email,
            age,
            password: hashedPassword,
            role: role || 'user'
        });

        return done(null, newUser);
        } catch (error) {
        return done(error);
        }
    }
    ));

    // ========================================
    // ESTRATEGIA LOCAL PARA LOGIN
    // ========================================
    passport.use('login', new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password'
    },
    async (email, password, done) => {
        try {
        // Buscar usuario por email
        const user = await User.findOne({ email });
        if (!user) {
            return done(null, false, { message: 'Credenciales inválidas' });
        }

        // Verificar la contraseña
        const isValidPassword = bcrypt.compareSync(password, user.password);
        if (!isValidPassword) {
            return done(null, false, { message: 'Credenciales inválidas' });
        }

        return done(null, user);
        } catch (error) {
        return done(error);
        }
    }
    ));

    // ========================================
    // ESTRATEGIA JWT PARA CURRENT (Autorización)
    // ========================================
    const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['token'];
    }
    return token;
    };

    passport.use('current', new JwtStrategy(
    {
        jwtFromRequest: ExtractJwt.fromExtractors([
        cookieExtractor,
        ExtractJwt.fromAuthHeaderAsBearerToken()
        ]),
        secretOrKey: JWT_SECRET
    },
    async (jwtPayload, done) => {
        try {
        // Buscar usuario por ID del payload
        const user = await User.findById(jwtPayload.id).populate('cart');
        
        if (!user) {
            return done(null, false, { message: 'Usuario no encontrado' });
        }

        return done(null, user);
        } catch (error) {
        return done(error, false);
        }
    }
    ));

    export default passport;