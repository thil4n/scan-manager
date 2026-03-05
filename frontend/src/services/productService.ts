import type { Product, CreateProductPayload, UpdateProductPayload } from '@/types/product';
import { generateId } from '@/utils/format';

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const mockProducts: Product[] = [
  {
    id: 'prod-001',
    name: 'Identity Server',
    slug: 'identity-server',
    description: 'Enterprise identity and access management platform.',
    owner: 'alice@acme.io',
    bu: 'IAM Engineering',
    createdAt: '2025-06-15T08:00:00Z',
    updatedAt: '2026-02-20T10:30:00Z',
  },
  {
    id: 'prod-002',
    name: 'API Manager',
    slug: 'api-manager',
    description: 'Full lifecycle API management and gateway.',
    owner: 'bob@acme.io',
    bu: 'Integration',
    createdAt: '2025-07-01T09:00:00Z',
    updatedAt: '2026-03-01T14:00:00Z',
  },
  {
    id: 'prod-003',
    name: 'Choreo Connect',
    slug: 'choreo-connect',
    description: 'Cloud-native API microgateway built on Envoy.',
    owner: 'carol@acme.io',
    bu: 'Cloud Platform',
    createdAt: '2025-09-10T11:00:00Z',
    updatedAt: '2026-03-04T09:15:00Z',
  },
  {
    id: 'prod-004',
    name: 'Asgardeo',
    slug: 'asgardeo',
    description: 'IDaaS platform for customer identity management.',
    owner: 'dave@acme.io',
    bu: 'CIAM',
    createdAt: '2025-04-20T10:00:00Z',
    updatedAt: '2026-02-20T16:45:00Z',
  },
  {
    id: 'prod-005',
    name: 'Ballerina Runtime',
    slug: 'ballerina-runtime',
    description: 'Cloud-native programming language runtime.',
    owner: 'eve@acme.io',
    bu: 'Languages',
    createdAt: '2025-03-01T07:00:00Z',
    updatedAt: '2026-02-15T11:00:00Z',
  },
];

// ---------------------------------------------------------------------------
// Simulated delay
// ---------------------------------------------------------------------------

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ---------------------------------------------------------------------------
// Service functions
// ---------------------------------------------------------------------------

export async function fetchProducts(): Promise<Product[]> {
  await delay(500);
  return [...mockProducts];
}

export async function fetchProductById(id: string): Promise<Product> {
  await delay(300);
  const product = mockProducts.find((p) => p.id === id);
  if (!product) {
    throw new Error(`Product ${id} not found`);
  }
  return { ...product };
}

export async function createProduct(payload: CreateProductPayload): Promise<Product> {
  await delay(400);
  const newProduct: Product = {
    id: `prod-${generateId()}`,
    name: payload.name,
    slug: payload.slug,
    description: payload.description,
    owner: payload.owner,
    bu: payload.bu,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  mockProducts.unshift(newProduct);
  return newProduct;
}

export async function updateProduct(payload: UpdateProductPayload): Promise<Product> {
  await delay(400);
  const index = mockProducts.findIndex((p) => p.id === payload.id);
  if (index === -1) {
    throw new Error(`Product ${payload.id} not found`);
  }
  const updated: Product = {
    ...mockProducts[index],
    ...payload,
    updatedAt: new Date().toISOString(),
  };
  mockProducts[index] = updated;
  return { ...updated };
}

export async function deleteProduct(id: string): Promise<void> {
  await delay(300);
  const index = mockProducts.findIndex((p) => p.id === id);
  if (index === -1) {
    throw new Error(`Product ${id} not found`);
  }
  mockProducts.splice(index, 1);
}
