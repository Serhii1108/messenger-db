import bcrypt from 'bcrypt';

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = process.env.CRYPT_SALT ?? 10;

  const salt = await bcrypt.genSalt(+saltRounds);
  const hashedPass = await bcrypt.hash(password, salt);

  return hashedPass;
}
