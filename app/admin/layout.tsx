import { Toaster } from 'react-hot-toast'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Toaster position="top-center" toastOptions={{
        style: { background: '#0d0d1a', color: '#f2f2ff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px' },
      }} />
      {children}
    </>
  )
}
