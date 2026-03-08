import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { CreateScanJobPayload, ScanTool, ScanType } from '@/types/scanJob';
import { useProducts } from '@/hooks/useProducts';
import { useVersions } from '@/hooks/useVersions';
import Button from '@/components/ui/Button';

interface ScanJobFormProps {
  defaultProductId?: string;
  defaultVersionId?: string;
  onSubmit: (data: CreateScanJobPayload) => void;
  onCancel: () => void;
  loading?: boolean;
}

const inputClass =
  'w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500';
const labelClass = 'mb-1 block text-xs font-medium text-gray-400';
const errorClass = 'mt-1 text-xs text-red-400';

const SCAN_TOOLS: ScanTool[] = ['VERACODE', 'FOSSA', 'JFROG', 'TRIVY', 'SNYK'];
const SCAN_TYPES: ScanType[] = ['SAST', 'DAST', 'SCA', 'CONTAINER', 'SECRET'];

export default function ScanJobForm({
  defaultProductId = '',
  defaultVersionId = '',
  onSubmit,
  onCancel,
  loading,
}: ScanJobFormProps) {
  const { data: products } = useProducts();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateScanJobPayload>({
    defaultValues: {
      productId: defaultProductId,
      versionId: defaultVersionId,
      tool: 'TRIVY',
      scanType: 'CONTAINER',
    },
  });

  const productId = watch('productId');
  const { data: versions } = useVersions(productId);

  useEffect(() => {
    setValue('versionId', '');
  }, [productId, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className={labelClass}>Product *</label>
        <select {...register('productId', { required: 'Product is required' })} className={inputClass}>
          <option value="">Select a product...</option>
          {products?.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
        {errors.productId && <p className={errorClass}>{errors.productId.message}</p>}
      </div>
      <div>
        <label className={labelClass}>Version *</label>
        <select
          {...register('versionId', { required: 'Version is required' })}
          className={inputClass}
          disabled={!productId || !versions?.length}
        >
          <option value="">Select a version...</option>
          {versions?.map((v) => (
            <option key={v.id} value={v.id}>{v.version}</option>
          ))}
        </select>
        {errors.versionId && <p className={errorClass}>{errors.versionId.message}</p>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Scan Tool *</label>
          <select {...register('tool', { required: true })} className={inputClass}>
            {SCAN_TOOLS.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>Scan Type *</label>
          <select {...register('scanType', { required: true })} className={inputClass}>
            {SCAN_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className={labelClass}>Artifact URL (optional)</label>
        <input
          {...register('artifactUrl')}
          className={inputClass}
          placeholder="https://artifacts.acme.io/app.jar"
        />
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <Button variant="secondary" type="button" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          Submit Scan Job
        </Button>
      </div>
    </form>
  );
}
