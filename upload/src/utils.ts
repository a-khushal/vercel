const DEFAULT_LENGTH = 5;
const CHARSET = "123456789qwertyuiopasdfghjklzxcvbnm";

export function generate(length = DEFAULT_LENGTH): string {
  if (!Number.isInteger(length) || length <= 0) {
    throw new Error("length must be a positive integer");
  }

  let result = "";
  for (let i = 0; i < length; i++) {
    const index = Math.floor(Math.random() * CHARSET.length);
    result += CHARSET[index];
  }

  return result;
}
