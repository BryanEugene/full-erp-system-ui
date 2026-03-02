import { useState, useEffect } from 'react';
import { CheckSquare, Plus, Search } from 'lucide-react';
import { taskService, type Task } from '@/services/projectSubService';
import { Modal, FormField, DetailRow, ModalBtn, inputCls, selectCls } from '@/app/components/ui/Modal';
const statusColor: Record<string,string> = { TODO:'bg-gray-100 text-gray-800', IN_PROGRESS:'bg-blue-100 text-blue-800', REVIEW:'bg-yellow-100 text-yellow-800', DONE:'bg-green-100 text-green-800' };
const priorityColor: Record<string,string> = { LOW:'bg-gray-100 text-gray-800', MEDIUM:'bg-yellow-100 text-yellow-800', HIGH:'bg-orange-100 text-orange-800', CRITICAL:'bg-red-100 text-red-800' };
const blank = () => ({ title:'', projectId:0, assigneeId:0, dueDate:'', priority:'MEDIUM', status:'TODO', description:'' });
export function Tasks() {
  const [records, setRecords] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<'view'|'new'|null>(null);
  const [selected, setSelected] = useState<Task|null>(null);
  const [form, setForm] = useState(blank());
  const load = () => { setLoading(true); taskService.getAll({ size:100 }).then(p=>setRecords(p.content??p as any)).catch(console.error).finally(()=>setLoading(false)); };
  useEffect(() => { load(); }, []);
  const filtered = records.filter(r => (r.title??'').toLowerCase().includes(search.toLowerCase()) || (r.assignee?.fullName??'').toLowerCase().includes(search.toLowerCase()));
  const close = () => { setModal(null); setSelected(null); setForm(blank()); };
  const handleNew = () => { taskService.create(form).then(()=>{load();close();}).catch(console.error); };
  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div><h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3"><CheckSquare className="w-8 h-8 text-blue-600" /> Tugas</h1><p className="text-gray-500 mt-1">Kelola tugas proyek</p></div>
        <button onClick={()=>setModal('new')} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"><Plus className="w-5 h-5" /> Tugas Baru</button>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6"><div className="flex-1 relative max-w-md"><Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Cari tugas..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" /></div></div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? <div className="p-8 text-center text-gray-400">Memuat data...</div> : (<table className="w-full"><thead className="bg-gray-50 border-b border-gray-200"><tr>{['Judul','Penanggung Jawab','Jatuh Tempo','Prioritas','Status','Aksi'].map(h=><th key={h} className="text-left px-4 py-3 text-sm font-semibold text-gray-900">{h}</th>)}</tr></thead>
          <tbody className="divide-y divide-gray-200">{filtered.map(r=>(
            <tr key={r.id} className="hover:bg-gray-50"><td className="px-4 py-4 text-sm font-medium text-gray-900">{r.title??'-'}</td><td className="px-4 py-4 text-sm text-gray-600">{r.assignee?.fullName??'-'}</td><td className="px-4 py-4 text-sm text-gray-600">{r.dueDate??'-'}</td><td className="px-4 py-4"><span className="px-2.5 py-0.5 rounded-full text-xs font-medium">{r.priority}</span></td><td className="px-4 py-4"><span className="px-2.5 py-0.5 rounded-full text-xs font-medium">{r.status}</span></td><td className="px-4 py-4 text-sm"><button onClick={()=>{setSelected(r);setModal('view');}} className="text-blue-600 hover:text-blue-800">Lihat</button></td></tr>
          ))}</tbody></table>)}
      </div>
      <Modal open={modal==='view'} onClose={close} title="Detail Tugas" size="md" footer={<ModalBtn onClick={close}>Tutup</ModalBtn>}>{selected&&<div><DetailRow label="Judul" value={selected.title??'-'}/><DetailRow label="Penanggung Jawab" value={selected.assignee?.fullName??'-'}/><DetailRow label="Prioritas" value={selected.priority??'-'}/><DetailRow label="Status" value={selected.status??'-'}/></div>}</Modal>
      <Modal open={modal==='new'} onClose={close} title="Tugas Baru" size="md" footer={<><ModalBtn onClick={close}>Batal</ModalBtn><ModalBtn variant="primary" onClick={handleNew}>Simpan</ModalBtn></>}><div className="grid grid-cols-2 gap-4"><FormField label="Judul" required><input value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} className={inputCls} /></FormField><FormField label="ID Proyek"><input type="number" value={form.projectId||''} onChange={e=>setForm(f=>({...f,projectId:Number(e.target.value)}))} className={inputCls} /></FormField><FormField label="Jatuh Tempo"><input type="date" value={form.dueDate} onChange={e=>setForm(f=>({...f,dueDate:e.target.value}))} className={inputCls} /></FormField><FormField label="Prioritas"><select value={form.priority} onChange={e=>setForm(f=>({...f,priority:e.target.value}))} className={selectCls}><option value="LOW">Rendah</option><option value="MEDIUM">Sedang</option><option value="HIGH">Tinggi</option><option value="CRITICAL">Kritis</option></select></FormField></div></Modal>
    </div>
  );
}
