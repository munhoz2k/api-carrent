import { randomUUID } from "crypto";

export class Specification {
  id?: string;
  name: string;
  description: string;
  created_at: Date;

  constructor(props: Omit<Specification, "id">, id?: string) {
    Object.assign(this, props);

    if (!id) {
      this.id = randomUUID();
    }
  }
}
