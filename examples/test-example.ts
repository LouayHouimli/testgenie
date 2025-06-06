import { readFile } from "fs-extra";
import { resolve } from "path";

export interface User {
  id: number;
  name: string;
}

export class UserService {
  async getUser(id: number): Promise<User> {
    const data = await readFile(`users/${id}.json`, "utf-8");
    return JSON.parse(data.toString());
  }

  validateUser(user: User): boolean {
    return user.id > 0 && user.name.length > 0;
  }
}

const formatUserName = (user: User): string => {
  return user.name.toUpperCase();
};

export { formatUserName };
export default UserService;
