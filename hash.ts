// hash.ts
import bcrypt from "bcrypt";

(async () => {
  const hash = await bcrypt.hash("1997", 10);
  console.log(hash);
})();