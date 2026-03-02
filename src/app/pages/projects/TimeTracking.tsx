import { useState, useEffect } from 'react';
import { Clock, Plus, Search } from 'lucide-react';
import { timeEntryService, type TimeEntry } from '@/services/projectSubService';
import { Modal, FormField, DetailRow, ModalBtn, inputCls } from '@/app/components/ui/Modal';
const blank = () => ({ employeeId:0, projectId:0, taskId:0, date:'', hours:0, description:'' });
export function TimeTracking() {
  const [records, setRecords] = useState<TimeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<'view'|'new'|null>(null);
  const [selected, setSelected] = useState<TimeEntry|null>(null);
  const [form, setForm] = useState(blank());
  const load = () => { setLoading(true); timeEntryService.getAll({ size:100 }).then(p=>setRecords(p.content??p as any)).catch(console.error).finally(()=>setLoading(false)); };
  useEffect(() => { load(); }, []);
  const filtered = records.filter(r => (r.employee?.fullName??'').toLowerCase().includes(search.toLowerCase()) || (r.project?.name??'').toLowerCase().includes(search.toLowerCase()));
  const close = () => { setModal(null); setSelected(null); setForm(blank()); };
  const handleNew = () => { timeEntryService.create(form).then(()=>{load();close();}).catch(console.error); };
  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div><h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3"><Clock className="w-8 h-8 text-blue-600" /> Pencatatan Waktu</h1><p className="text-gray-500 mt-1">Catat jam kerja proyek</p></div>
        <button onClick={()=>setModal('new')} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"><Plus className="w-5 h-5" /> Entri Baru</button>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6"><div className="flex-1 relative max-w-md"><Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Cari karyawan atau proyek..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" /></div></div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? <div className="p-8 text-center text-gray-400">Memuat data...</div> : (<table className="w-full"><thead className="bg-gray-50 border-b border-gray-200"><tr>{['Karyawan','Proyek','Tugas','Tanggal','Jam','Deskripsi','Aksi'].map(h=><th key={h} className="text-left px-4 py-3 text-sm font-semibold text-gray-900">{h}</th>)}</tr></thead>
          <tbody className="divide-y divide-gray-200">{filtered.map(r=>(
            <tr key={r.id} className="hover:bg-gray-50"><td className="px-4 py-4 text-sm font-medium text-gray-900">{r.employee?.fullName??'-'}</td><td className="px-4 py-4 text-sm text-gray-600">{r.project?.name??'-'}</td><td className="px-4 py-4 text-sm text-gray-600">{r.task?.title??'-'}</td><td className="px-4 py-4 text-sm text-gray-600">{r.date??'-'}</td><td className="px-4 py-4 text-sm font-semibold text-gray-900">{r.hours??0} jam</td><td className="px-4 py-4 text-sm text-gray-500 max-w-xs truncate">{r.description??'-'}</td><td className="px-4 py-4 text-sm"><button onClick={()=>{setSelected(r);setModal('view');}} className="text-blue-600 hover:text-blue-800">Lihat</button></td></tr>
          ))}</tbody></table>)}
      </div>
      <Modal open={modal==='view'} onClose={close} title="Detail Entri Waktu" size="md" footer={<ModalBtn onClick={close}>Tutup</ModalBtn>}>{selected&&<div><DetailRow label="Karyawan" value={selected.employee?.fullName??'-'}/><DetailRow label="Proyek" value={selected.project?.name??'-'}/><DetailRow label="Jam" value={`${selected.hours??0} jam`}/><DetailRow label="Deskripsi" value={selected.description??'-'}/></div>}</Modal>
      <Modal open={modal==='new'} onClose={close} title="Entri Waktu Baru" size="md" footer={<><ModalBtn onClick={close}>Batal</ModalBtn><ModalBtn variant="primary" onClick={handleNew}>Simpan</ModalBtn></>}><div className="grid grid-cols-2 gap-4"><FormField label="ID Karyawan" required><input type="number" value={form.employeeId||''} onChange={e=>setForm(f=>({...f,employeeId:Number(e.target.value)}))} className={inputCls} /></FormField><FormField label="ID Proyek" required><input type="number" value={form.projectId||''} onChange={e=>setForm(f=>({...f,projectId:Number(e.target.value)}))} className={inputCls} /></FormField><FormField label="Tanggal"><input type="date" value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))} className={inputCls} /></FormField><FormField label="Jam"><input type="number" step="0.5" value={form.hours||''} onChange={e=>setForm(f=>({...f,hours:Number(e.target.value)}))} className={inputCls} /></FormField></div></Modal>
    </div>
  );
}
