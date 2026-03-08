import PageContainer from '@/components/layout/PageContainer';
import ReleaseForm from '@/components/forms/ReleaseForm';

export default function NewRelease() {
  return (
    <PageContainer
      title="New Release"
      description="Submit a new release for security scanning"
    >
      <div className="max-w-3xl">
        <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
          <ReleaseForm />
        </div>
      </div>
    </PageContainer>
  );
}
