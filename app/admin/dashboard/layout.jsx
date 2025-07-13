import ProtectedRoute from '@/components/layout/ProtectedRoute';


export default function ProfileLayout({ children }) {
  return (
    
      <ProtectedRoute checkRoute={'admin'}>
       
      <div className="mt-6">{children}</div>
      </ProtectedRoute>
 
  );
}
