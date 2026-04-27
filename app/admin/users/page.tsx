'use client'
import { useEffect, useState } from 'react'
import AdminShell from '@/components/layout/AdminShell'
import { Plus, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

type User = { _id: string; username: string; role: string; createdAt: string }

export default function UsersAdmin() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ username: '', password: '', role: 'editor' })

  const load = () => fetch('/api/users').then(r => r.json()).then(setUsers).finally(() => setLoading(false))
  useEffect(() => { load() }, [])

  const create = async () => {
    if (!form.username || !form.password) return toast.error('Username and password required')
    const res = await fetch('/api/users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    if (res.ok) { toast.success('User created'); setShowForm(false); setForm({ username: '', password: '', role: 'editor' }); load() }
    else { const { error } = await res.json(); toast.error(error || 'Failed') }
  }

  const del = async (id: string, username: string) => {
    if (!confirm(`Delete user "${username}"?`)) return
    await fetch(`/api/users/${id}`, { method: 'DELETE' })
    toast.success('User deleted'); load()
  }

  const inp = { width: '100%', background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: '8px', padding: '9px 12px', fontSize: '13px', color: 'var(--text)', outline: 'none', boxSizing: 'border-box' as const, fontFamily: 'var(--font-body)' }
  const lbl = { fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-3)', textTransform: 'uppercase' as const, letterSpacing: '0.1em', display: 'block', marginBottom: '6px' }

  return (
    <AdminShell>
      <div style={{ padding: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.03em' }}>Users</h1>
            <p style={{ fontSize: '13px', color: 'var(--text-3)', marginTop: '4px' }}>Manage admin panel access</p>
          </div>
          <button onClick={() => setShowForm(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', borderRadius: '10px', border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg, #4f6ef7, #9b6dff)', color: '#fff', fontSize: '13px', fontWeight: 700, fontFamily: 'var(--font-display)' }}>
            <Plus size={15} /> Add User
          </button>
        </div>

        {showForm && (
          <div style={{ background: 'var(--bg-2)', border: '1px solid rgba(79,110,247,0.3)', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 700, color: 'var(--text)', marginBottom: '16px' }}>New User</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px', marginBottom: '16px' }}>
              <div><label style={lbl}>Username</label><input value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} placeholder="john.doe" style={inp} /></div>
              <div><label style={lbl}>Password</label><input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="••••••••" style={inp} /></div>
              <div><label style={lbl}>Role</label>
                <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} style={inp}>
                  <option value="editor">Editor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={create} style={{ padding: '8px 18px', borderRadius: '8px', border: 'none', background: 'var(--blue)', color: '#fff', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-display)' }}>Create</button>
              <button onClick={() => setShowForm(false)} style={{ padding: '8px 18px', borderRadius: '8px', border: '1px solid var(--border)', background: 'none', color: 'var(--text-3)', fontSize: '13px', cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        )}

        <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden' }}>
          {loading ? <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-3)' }}>Loading…</div> : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Username', 'Role', 'Created', ''].map(h => <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 500 }}>{h}</th>)}
              </tr></thead>
              <tbody>
                {users.map((user, i) => (
                  <tr key={user._id} style={{ borderBottom: i < users.length - 1 ? '1px solid var(--border)' : 'none' }} className="hover:bg-[var(--bg-3)]">
                    <td style={{ padding: '14px 16px', fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>{user.username}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', padding: '3px 10px', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.08em', background: user.role === 'admin' ? 'rgba(79,110,247,0.12)' : 'rgba(255,255,255,0.05)', border: user.role === 'admin' ? '1px solid rgba(79,110,247,0.3)' : '1px solid var(--border)', color: user.role === 'admin' ? 'var(--blue)' : 'var(--text-3)' }}>{user.role}</span>
                    </td>
                    <td style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-3)' }}>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <button onClick={() => del(user._id, user.username)} style={{ padding: '6px 8px', borderRadius: '8px', border: '1px solid var(--border)', background: 'none', cursor: 'pointer', color: 'var(--text-3)', display: 'flex', alignItems: 'center' }} className="hover:border-[rgba(255,77,109,0.4)] hover:text-[#ff4d6d]">
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminShell>
  )
}
