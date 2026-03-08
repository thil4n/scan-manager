export type VersionStatus = 'ACTIVE' | 'DEPRECATED' | 'DRAFT';

export interface Version {
  id: string;
  productId: string;
  productName?: string;
  version: string;
  description?: string;
  status: VersionStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVersionPayload {
  productId: string;
  version: string;
  description?: string;
  status?: VersionStatus;
}

export interface UpdateVersionPayload extends Partial<Omit<CreateVersionPayload, 'productId'>> {
  id: string;
}
