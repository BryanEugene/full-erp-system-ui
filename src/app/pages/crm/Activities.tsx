import { useState, useEffect } from 'react';
import { Activity as ActivityIcon, Plus, Search } from 'lucide-react';
import crmService, { type Activity } from '@/services/crmService';
import { Modal, FormField, DetailRow, ModalBtn, inputCls, selectCls } from '@/app/components/ui/Modal';
const statusColor: Record<string,string> = { PLANNED:'bg-blue-100 text-blue-800', IN_PROGRESS:'bg-yellow-100 text-yellow-800', COMPLETED:'bg-green-100 text-green-800', CANCELLED:'bg-red-100 text-red-800' };
const blank = () => ({ type:'CALL', subject:'', relatedTo:'', dueDate:'', status:'PLANNED', notes:'' });
export function Activities() {
  const [records, setRecords] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<'view'|'new'|null>(null);
  const [selected, setSelected] = useState<Activity|null>(null);
  const [form, setForm] = useState(blank());
  const load = () => { setLoading(true); crmService.getActivities({ size:100 }).then(p=>setRecords(p.content??p as any)).catch(console.error).finally(()=>setLoading(false)); };
  useEffect(() => { load(); }, []);
  const filtered = records.filter(r => (r.subject??'').toLowerCase().includes(search.toLowerCase()));
  const close = () => { setModal(null); setSelected(null); setForm(blank()); };
  const handleNew = () => { crmService.createActivity(form).then(()=>{load();close();}).catch(console.error); };
  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div><h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3"><ActivityIcon className="w-8 h-8 text-blue-600" /> Aktivitas CRM</h1><p className="text-gray-500 mt-1">Kelola aktivitas penjualan</p></div>
        <button onClick={()=>setModal('new')} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"><Plus className="w-5 h-5" /> Aktivitas Baru</button>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6"><div className="flex-1 relative max-w-md"><Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Cari aktivitas..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" /></div></div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? <div className="p-8 text-center text-gray-400">Memuat data...</div> : (<table className="w-full"><thead className="bg-gray-50 border-b border-gray-200"><tr>{['Tipe','Subjek','Berkaitan','Jatuh Tempo','Status','Aksi'].map(h=><th key={h} className="text-left px-4 py-3 text-sm font-semibold text-gray-900">{h}</th>)}</tr></thead>
          <tbody className="divide-y divide-gray-200">{filtered.map(r=>(
            <tr key={r.id} className="hover:bg-gray-50"><td className="px-4 py-4 text-sm font-medium text-gray-900">{r.type??'-'}</td><td className="px-4 py-4 text-sm text-gray-900">{r.subject??'-'}</td><td className="px-4 py-4 text-sm text-gray-600">{r.relatedTo??'-'}</td><td className="px-4 py-4 text-sm text-gray-600">{r.dueDate??'-'}</td><td className="px-4 py-4"><span className="px-2.5 py-0.5 rounded-full text-xs font-medium">{r.status}</span></td><td className="px-4 py-4 text-sm"><button onClick={()=>{setSelected(r);setModal('view');}} className="text-blue-600 hover:text-blue-800">Lihat</button></td></tr>
          ))}</tbody></table>)}
      </div>
      <Modal open={modal==='view'} onClose={close} title="Detail Aktivitas" size="md" footer={<ModalBtn onClick={close}>Tutup</ModalBtn>}>{selected&&<div><DetailRow label="Tipe" value={selected.type??'-'}/><DetailRow label="Subjek" value={selected.subject??'-'}/><DetailRow label="Status" value={selected.status??'-'}/><DetailRow label="Catatan" value={selected.notes??'-'}/></div>}</Modal>
      <Modal open={modal==='new'} onClose={close} title="Aktivitas Baru" size="md" footer={<><ModalBtn onClick={close}>Batal</ModalBtn><ModalBtn variant="primary" onClick={handleNew}>Simpan</ModalBtn></>}><div className="grid grid-cols-2 gap-4"><FormField label="Tipe"><select value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))} className={selectCls}><option value="CALL">Panggilan</option><option value="EMAIL">Email</option><option value="MEETING">Rapat</option><option value="TASK">Tugas</option></select></FormField><FormField label="Subjek" required><input value={form.subject} onChange={e=>setForm(f=>({...f,subject:e.target.value}))} className={inputCls} /></FormField><FormField label="Berkaitan Dengan"><input value={form.relatedTo} onChange={e=>setForm(f=>({...f,relatedTo:e.target.value}))} className={inputCls} /></FormField><FormField label="Jatuh Tempo"><input type="date" value={form.dueDate} onChange={e=>setForm(f=>({...f,dueDate:e.target.value}))} className={inputCls} /></FormField></div></Modal>
    </div>
  );
}
