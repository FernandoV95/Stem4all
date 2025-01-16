import argon2 from "argon2"

// Hashear la contraseña
export const hashPassword = async (password: string) => {
    try {
        const hashedPassword = await argon2.hash(password);
        return hashedPassword;
    } catch (err) {
        console.error("Error al hashear la contraseña:", err);
        throw new Error("Error al hashear la contraseña");
    }
}

// Verificar la contraseña
export const verifyPassword = async (enteredPassword: string, storedHash: string) => {
    try {
        return await argon2.verify(storedHash, enteredPassword);
    } catch (err) {
        console.error("Error al verificar la contraseña:", err);
        throw new Error("Error al verificar la contraseña");
    }
}
