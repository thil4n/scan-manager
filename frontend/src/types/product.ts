export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  owner: string;
  bu: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductPayload {
  name: string;
  slug: string;
  description: string;
  owner: string;
  bu: string;
}

export interface UpdateProductPayload extends Partial<CreateProductPayload> {
  id: string;
}
