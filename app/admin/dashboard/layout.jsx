import ProtectedRoute from '@/components/layout/ProtectedRoute';


export default function ProfileLayout({ children }) {
  return (
    
      <ProtectedRoute checkRoute={'admin'}>       
      <div>{children}</div>
      </ProtectedRoute>
 
  );
}
