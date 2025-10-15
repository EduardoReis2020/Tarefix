import { createUser, findUserById, findUserByEmail, updateUser as repoUpdateUser, deleteUser as repoDeleteUser} from "../repositories/userRepository";
import * as jose from "jose";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET || 'chave_super_secreta';
const JWT_EXPIRES_IN = "1h"; // Token expira em 1 hora

// Busca usuário pelo ID
export async function getUserById(userId: string) {
    if (!userId) {
        throw new Error("ID do usuário é obrigatório.");
    }

    return findUserById(userId);
}

// Busca usuário pelo email
export async function getUserByEmail(email: string) {
    if (!email) {
        throw new Error("Email é obrigatório.");
    }

    return findUserByEmail(email);
}

// Registro de usuário
export async function registerUser(data: { name: string; email: string; password: string }) {
    const { name, email, password } = data;

    if (!name || !email || !password) {
        throw new Error("Nome, email e senha são obrigatórios.");
    }

    // Verifica se já existe usuário com o mesmo email
    const existingUser = await findUserByEmail(email);
    if (existingUser) throw new Error("Email já cadastrado.");

    // Criptografa senha
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await createUser({ name, email, password: hashedPassword });

    return user;
}

// Login de usuário
export async function loginUser(email: string, password: string) {
    if (!email || !password) throw new Error("Email e senha são obrigatórios.");

    const user = await findUserByEmail(email);
    if (!user) throw new Error("Usuário não encontrado.");

    // Verifica senha
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new Error("Senha incorreta.");

    // Cria token JWT
    const token = await new jose.SignJWT({ userId: user.id, email: user.email })
        .setProtectedHeader({ alg: "HS256", typ: "JWT" })
        .setIssuedAt()
        .setExpirationTime(JWT_EXPIRES_IN)
        .sign(new TextEncoder().encode(JWT_SECRET));

    return { user: { id: user.id, name: user.name, email: user.email }, token };
}

// Atualiza usuário
export async function updateUser(userId: string, data: { name?: string; password?: string }) {
    if (!userId) throw new Error("ID do usuário é obrigatório.");

    // Se tiver senha, precisa criptografar
    if (data.password) {
        data.password = await bcrypt.hash(data.password, 10);
    }

    return repoUpdateUser(userId, data);
}

// Deleta usuário
export async function deleteUser(userId: string) {
    if (!userId) throw new Error("ID do usuário é obrigatório.");

    return repoDeleteUser(userId);
}

// Verifica token JWT
export async function verifyToken(token: string) {
    try {
        const { payload } = await jose.jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
        return payload as { userId: string; email: string };
    } catch (error) {
        console.error("Erro ao verificar o token:", error);
        throw new Error("Token inválido ou expirado.");
    }
}