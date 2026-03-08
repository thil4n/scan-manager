import api from './api';
import type { Product, CreateProductPayload, UpdateProductPayload } from '@/types/product';

export async function fetchProducts(): Promise<Product[]> {
  const { data } = await api.get<Product[]>('/products');
  return data;
}

export async function fetchProductById(id: string): Promise<Product> {
  const { data } = await api.get<Product>(`/products/${id}`);
  return data;
}

export async function createProduct(payload: CreateProductPayload): Promise<Product> {
  const { data } = await api.post<Product>('/products', payload);
  return data;
}

export async function updateProduct(payload: UpdateProductPayload): Promise<Product> {
  const { id, ...rest } = payload;
  const { data } = await api.put<Product>(`/products/${id}`, rest);
  return data;
}

export async function deleteProduct(id: string): Promise<void> {
  await api.delete(`/products/${id}`);
}
