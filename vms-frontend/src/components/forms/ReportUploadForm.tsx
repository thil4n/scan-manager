import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ArrowUpTrayIcon, DocumentIcon } from '@heroicons/react/24/outline';
import { useProducts } from '@/hooks/useProducts';
import { useVersions } from '@/hooks/useVersions';
import Button from '@/components/ui/Button';

interface ReportUploadFormData {
  productId: string;
  versionId: string;
}

interface ReportUploadFormProps {
  onSubmit: (productId: string, versionId: string, file: File) => void;
  onCancel: () => void;
  loading?: boolean;
}

const inputClass =
  'w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500';
const labelClass = 'mb-1 block text-xs font-medium text-gray-400';
const errorClass = 'mt-1 text-xs text-red-400';

export default function ReportUploadForm({ onSubmit, onCancel, loading }: ReportUploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { data: products } = useProducts();

  const { register, watch, handleSubmit, formState: { errors } } = useForm<ReportUploadFormData>();
  const productId = watch('productId');
  const { data: versions } = useVersions(productId);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const ext = f.name.split('.').pop()?.toLowerCase();
    if (!['csv', 'xlsx', 'xls'].includes(ext ?? '')) {
      setFileError('Only CSV, XLSX, and XLS files are supported.');
      setFile(null);
      return;
    }
    setFileError('');
    setFile(f);
  };

  const handleFormSubmit = (data: ReportUploadFormData) => {
    if (!file) {
      setFileError('Please select a file.');
      return;
    }
    onSubmit(data.productId, data.versionId, file);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
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
      {/* File drop zone */}
      <div>
        <label className={labelClass}>Report File * (CSV / XLSX)</label>
        <div
          className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed py-8 transition-colors ${
            file ? 'border-blue-600 bg-blue-950/20' : 'border-gray-700 hover:border-gray-500'
          }`}
          onClick={() => inputRef.current?.click()}
        >
          {file ? (
            <>
              <DocumentIcon className="h-8 w-8 text-blue-400" />
              <p className="text-sm font-medium text-white">{file.name}</p>
              <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
            </>
          ) : (
            <>
              <ArrowUpTrayIcon className="h-8 w-8 text-gray-500" />
              <p className="text-sm text-gray-400">Click to upload or drag & drop</p>
              <p className="text-xs text-gray-600">CSV, XLSX, XLS up to 10MB</p>
            </>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept=".csv,.xlsx,.xls"
          className="hidden"
          onChange={handleFileChange}
        />
        {fileError && <p className={errorClass}>{fileError}</p>}
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <Button variant="secondary" type="button" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          Upload Report
        </Button>
      </div>
    </form>
  );
}
