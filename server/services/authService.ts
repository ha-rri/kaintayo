import jwt from "jsonwebtoken";

export const authService = {
  /**
   * Generate JWT Token
   */
  generateToken(id: string) {
    return jwt.sign({ id }, process.env.JWT_SECRET as string, {
      expiresIn: "30d",
    });
  },
};
