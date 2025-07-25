import { JwtPayload, sign, verify } from 'jsonwebtoken'

export function signAccessTokenFor(userId: string) {
    return sign(
        { sub: userId },
        process.env.JWT_SECRET!,
        { expiresIn: '3d' }
    )
}

export function validateAccessToken(token: string) {
    try {
        const { sub } = verify(token, process.env.JWT_SECRET!) as JwtPayload;
        return sub ?? null;
    } catch (error) {
        console.error("[ERROR] validateAccessToken:", error);
        return null;
    }
}