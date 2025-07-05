import ProfileHeader from '@/components/profile/ProfileHeader';

export default function ProfileLayout({ children }) {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <ProfileHeader />
      <div className="mt-6">{children}</div>
    </div>
  );
}
