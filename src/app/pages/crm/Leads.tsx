import { useState, useEffect } from 'react';
import { UserPlus, Plus, Search, Filter } from 'lucide-react';
import crmService, { type Lead } from '@/services/crmService';
import { Modal, FormField, DetailRow, ModalBtn, inputCls, selectCls } from '@/app/components/ui/Modal';
const statusColor: Record<string,string> = { NEW:'bg-blue-100 text-blue-800', CONTACTED:'bg-yellow-100 text-yellow-800', QUALIFIED:'bg-purple-100 text-purple-800', CONVERTED:'bg-green-100 text-green-800', LOST:'bg-red-100 text-red-800' };
const blank = () => ({ companyName:'', contactName:'', email:'', phone:'', source:'WEB', status:'NEW', notes:'' });
export function Leads() {
  const [records, setRecords] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<'view'|'new'|null>(null);
  const [selected, setSelected] = useState<Lead|null>(null);
  const [form, setForm] = useState(blank());
  const load = () => { setLoading(true); crmService.getLeads({ size:100 }).then(p=>setRecords(p.content??p as any)).catch(console.error).finally(()=>setLoading(false)); };
  useEffect(() => { load(); }, []);
  const filtered = records.filter(r => (r.companyName??'').toLowerCase().includes(search.toLowerCase()) || (r.contactName??'').toLowerCase().includes(search.toLowerCase()));
  const close = () => { setModal(null); setSelected(null); setForm(blank()); };
  const handleNew = () => { crmService.createLead(form).then(()=>{load();close();}).catch(console.error); };
  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div><h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3"><UserPlus className="w-8 h-8 text-blue-600" /> Prospek (Leads)</h1><p className="text-gray-500 mt-1">Kelola prospek pelanggan</p></div>
        <button onClick={()=>setModal('new')} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"><Plus className="w-5 h-5" /> Lead Baru</button>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6"><div className="flex gap-4"><div className="flex-1 relative"><Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Cari prospek..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" /></div><button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"><Filter className="w-5 h-5" /> Filter</button></div></div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? <div className="p-8 text-center text-gray-400">Memuat data...</div> : (<table className="w-full"><thead className="bg-gray-50 border-b border-gray-200"><tr>{['Perusahaan','Kontak','Email','Telepon','Sumber','Status','Aksi'].map(h=><th key={h} className="text-left px-4 py-3 text-sm font-semibold text-gray-900">{h}</th>)}</tr></thead>
          <tbody className="divide-y divide-gray-200">{filtered.map(r=>(
            <tr key={r.id} className="hover:bg-gray-50"><td className="px-4 py-4 text-sm font-medium text-gray-900">{r.companyName??'-'}</td><td className="px-4 py-4 text-sm text-gray-900">{r.contactName??'-'}</td><td className="px-4 py-4 text-sm text-gray-600">{r.email??'-'}</td><td className="px-4 py-4 text-sm text-gray-600">{r.phone??'-'}</td><td className="px-4 py-4 text-sm text-gray-600">{r.source??'-'}</td><td className="px-4 py-4"><span className="px-2.5 py-0.5 rounded-full text-xs font-medium">{r.status}</span></td><td className="px-4 py-4 text-sm"><button onClick={()=>{setSelected(r);setModal('view');}} className="text-blue-600 hover:text-blue-800">Lihat</button></td></tr>
          ))}</tbody></table>)}
      </div>
      <Modal open={modal==='view'} onClose={close} title="Detail Lead" size="md" footer={<ModalBtn onClick={close}>Tutup</ModalBtn>}>{selected&&<div><DetailRow label="Perusahaan" value={selected.companyName??'-'}/><DetailRow label="Kontak" value={selected.contactName??'-'}/><DetailRow label="Email" value={selected.email??'-'}/><DetailRow label="Sumber" value={selected.source??'-'}/><DetailRow label="Status" value={selected.status??'-'}/></div>}</Modal>
      <Modal open={modal==='new'} onClose={close} title="Lead Baru" size="md" footer={<><ModalBtn onClick={close}>Batal</ModalBtn><ModalBtn variant="primary" onClick={handleNew}>Simpan</ModalBtn></>}><div className="grid grid-cols-2 gap-4"><FormField label="Perusahaan" required><input value={form.companyName} onChange={e=>setForm(f=>({...f,companyName:e.target.value}))} className={inputCls} /></FormField><FormField label="Kontak"><input value={form.contactName} onChange={e=>setForm(f=>({...f,contactName:e.target.value}))} className={inputCls} /></FormField><FormField label="Email"><input type="email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} className={inputCls} /></FormField><FormField label="Telepon"><input value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))} className={inputCls} /></FormField><FormField label="Sumber"><select value={form.source} onChange={e=>setForm(f=>({...f,source:e.target.value}))} className={selectCls}><option value="WEB">Website</option><option value="REFERRAL">Referral</option><option value="COLD_CALL">Cold Call</option><option value="SOCIAL_MEDIA">Media Sosial</option></select></FormField></div></Modal>
    </div>
  );
}
