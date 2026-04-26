// Setup page does not use the dashboard layout (no sidebar, no header)
export default function SetupLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
