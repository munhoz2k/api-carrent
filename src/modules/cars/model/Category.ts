import { randomUUID } from "crypto";

class Category {
  id?: string;
  name: string;
  description: string;
  created_at: Date;

  constructor(props: Omit<Category, "id">, id?: string) {
    Object.assign(this, props);

    if (!id) {
      this.id = randomUUID();
    }
  }
}

export { Category };
