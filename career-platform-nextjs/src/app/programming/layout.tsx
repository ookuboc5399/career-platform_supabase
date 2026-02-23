import { ProgrammingChatWidget } from '@/components/programming/ProgrammingChatWidget';

export default function ProgrammingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <ProgrammingChatWidget />
    </>
  );
}
