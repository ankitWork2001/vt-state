import ProtectedRoute from '@/components/layout/ProtectedRoute';


export default function ProfileLayout({ children }) {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <ProtectedRoute checkRoute={'user'}>
       
      <div className="mt-6">{children}</div>
      </ProtectedRoute>
    </div>
  );
}
