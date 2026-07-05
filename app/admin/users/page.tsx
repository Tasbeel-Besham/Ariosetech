'use client'
import { useEffect, useState } from 'react'
import AdminShell from '@/components/layout/AdminShell'
import { Plus, Trash2 } from '@/components/ui/Icons'
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

  const inpClass = "w-full bg-bg-3 border border-border rounded-lg py-2.5 px-3.5 text-[13px] text-white outline-none box-border font-body transition-colors focus:border-primary/50"
  const lblClass = "font-mono text-[10px] text-text-3 uppercase tracking-wider block mb-1.5"

  return (
    <AdminShell>
      <div className="p-8 max-w-[1000px]">
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <div>
            <h1 className="font-display text-[28px] font-extrabold text-white tracking-tight">Users</h1>
            <p className="text-[13px] text-text-3 mt-1">Manage admin panel access</p>
          </div>
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 py-2.5 px-[18px] rounded-lg border-none bg-gradient-to-br from-primary to-primary-dark text-white text-[13px] font-bold cursor-pointer font-display transition-opacity hover:opacity-90">
            <Plus size={15} /> Add User
          </button>
        </div>

        {showForm && (
          <div className="bg-bg-2 border border-primary/30 rounded-2xl p-6 mb-6">
            <h3 className="font-display text-base font-bold text-white mb-4">New User</h3>
            <div className="grid grid-cols-3 gap-3.5 mb-4 max-sm:grid-cols-1">
              <div><label className={lblClass}>Username</label><input value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} placeholder="john.doe" className={inpClass} /></div>
              <div><label className={lblClass}>Password</label><input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="••••••••" className={inpClass} /></div>
              <div><label className={lblClass}>Role</label>
                <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} className={inpClass}>
                  <option value="editor">Editor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2.5">
              <button onClick={create} className="py-2.5 px-[18px] rounded-lg border-none bg-[color:var(--blue)] text-white text-[13px] font-bold cursor-pointer font-display transition-opacity hover:opacity-90">Create</button>
              <button onClick={() => setShowForm(false)} className="py-2.5 px-[18px] rounded-lg border border-border bg-transparent text-text-3 text-[13px] cursor-pointer transition-colors hover:bg-bg-3">Cancel</button>
            </div>
          </div>
        )}

        <div className="bg-bg-2 border border-border rounded-2xl overflow-x-auto">
          {loading ? <div className="p-10 text-center text-text-3">Loading…</div> : (
            <table className="w-full border-collapse min-w-[600px]">
              <thead><tr className="border-b border-border">
                {['Username', 'Role', 'Created', ''].map(h => <th key={h} className="py-3.5 px-4 text-left font-mono text-[10px] text-text-3 uppercase tracking-wider font-semibold">{h}</th>)}
              </tr></thead>
              <tbody>
                {users.map((user, i) => (
                  <tr key={user._id} className={`transition-colors hover:bg-bg-3 ${i < users.length - 1 ? 'border-b border-border' : ''}`}>
                    <td className="py-3.5 px-4 font-display text-sm font-bold text-white">{user.username}</td>
                    <td className="py-3.5 px-4">
                      <span className={`font-mono text-[10px] py-1 px-2.5 rounded-full uppercase tracking-wider border ${user.role === 'admin' ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-white/5 border-border text-text-3'}`}>{user.role}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-text-3">{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="py-3.5 px-4 text-right">
                      <button onClick={() => del(user._id, user.username)} className="py-1.5 px-2 rounded-lg border border-border bg-transparent cursor-pointer text-text-3 inline-flex items-center transition-colors hover:border-[#ff4d6d]/40 hover:text-[#ff4d6d]">
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
