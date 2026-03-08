import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createRelease } from '@/services/releaseService';
import type { CreateReleasePayload } from '@/types/release';
import type { ScanType } from '@/types/scan';

const scanOptions: { value: ScanType; label: string; description: string }[] = [
  { value: 'VERACODE', label: 'Veracode', description: 'Static Application Security Testing (SAST)' },
  { value: 'FOSSA', label: 'FOSSA', description: 'Software Composition Analysis (SCA)' },
  { value: 'JFROG', label: 'JFrog Xray', description: 'Artifact & Container Scanning' },
];

export default function ReleaseForm() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [productName, setProductName] = useState('');
  const [version, setVersion] = useState('');
  const [branch, setBranch] = useState('');
  const [jiraTicket, setJiraTicket] = useState('');
  const [artifactType, setArtifactType] = useState<'file' | 'docker'>('file');
  const [artifactName, setArtifactName] = useState('');
  const [dockerImage, setDockerImage] = useState('');
  const [dockerTag, setDockerTag] = useState('');
  const [selectedScans, setSelectedScans] = useState<ScanType[]>([]);

  const mutation = useMutation({
    mutationFn: createRelease,
    onSuccess: (release) => {
      queryClient.invalidateQueries({ queryKey: ['releases'] });
      navigate(`/releases/${release.id}`);
    },
  });

  const toggleScan = (type: ScanType) => {
    setSelectedScans((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName || !version || selectedScans.length === 0) return;

    const payload: CreateReleasePayload = {
      productName,
      version,
      branch: branch || undefined,
      jiraTicket: jiraTicket || undefined,
      artifactType,
      artifactName: artifactType === 'file' ? artifactName : undefined,
      dockerImage: artifactType === 'docker' ? dockerImage : undefined,
      dockerTag: artifactType === 'docker' ? dockerTag : undefined,
      scanTypes: selectedScans,
    };

    mutation.mutate(payload);
  };

  const inputClass =
    'w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500';

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Info */}
      <section>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">
          Basic Information
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs text-gray-400">Product Name *</label>
            <input
              className={inputClass}
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="e.g. Identity Server"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-gray-400">Version *</label>
            <input
              className={inputClass}
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              placeholder="e.g. 7.1.0"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-gray-400">Branch</label>
            <input
              className={inputClass}
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              placeholder="e.g. release/7.1.0"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-gray-400">Jira Ticket</label>
            <input
              className={inputClass}
              value={jiraTicket}
              onChange={(e) => setJiraTicket(e.target.value)}
              placeholder="e.g. IS-4521"
            />
          </div>
        </div>
      </section>

      {/* Artifact */}
      <section>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">
          Artifact
        </h3>
        <div className="mb-4 flex gap-4">
          <label className="flex items-center gap-2 text-sm text-gray-300">
            <input
              type="radio"
              name="artifactType"
              checked={artifactType === 'file'}
              onChange={() => setArtifactType('file')}
              className="accent-blue-500"
            />
            File Upload
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-300">
            <input
              type="radio"
              name="artifactType"
              checked={artifactType === 'docker'}
              onChange={() => setArtifactType('docker')}
              className="accent-blue-500"
            />
            Docker Image
          </label>
        </div>

        {artifactType === 'file' ? (
          <div>
            <label className="mb-1 block text-xs text-gray-400">Artifact File</label>
            <input
              className={inputClass}
              value={artifactName}
              onChange={(e) => setArtifactName(e.target.value)}
              placeholder="e.g. my-app-7.1.0.war"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs text-gray-400">Image Name</label>
              <input
                className={inputClass}
                value={dockerImage}
                onChange={(e) => setDockerImage(e.target.value)}
                placeholder="e.g. acme/identity-server"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-400">Tag</label>
              <input
                className={inputClass}
                value={dockerTag}
                onChange={(e) => setDockerTag(e.target.value)}
                placeholder="e.g. 7.1.0"
              />
            </div>
          </div>
        )}
      </section>

      {/* Scan Selection */}
      <section>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">
          Scan Selection *
        </h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {scanOptions.map((opt) => (
            <label
              key={opt.value}
              className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors ${
                selectedScans.includes(opt.value)
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-gray-700 bg-gray-800 hover:border-gray-600'
              }`}
            >
              <input
                type="checkbox"
                checked={selectedScans.includes(opt.value)}
                onChange={() => toggleScan(opt.value)}
                className="mt-0.5 accent-blue-500"
              />
              <div>
                <div className="text-sm font-medium text-white">{opt.label}</div>
                <div className="text-xs text-gray-500">{opt.description}</div>
              </div>
            </label>
          ))}
        </div>
      </section>

      {/* Submit */}
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={mutation.isPending || !productName || !version || selectedScans.length === 0}
          className="rounded-md bg-blue-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {mutation.isPending ? 'Submitting…' : 'Submit Release'}
        </button>
        {mutation.isError && (
          <span className="text-sm text-red-500">Failed to create release. Try again.</span>
        )}
      </div>
    </form>
  );
}
