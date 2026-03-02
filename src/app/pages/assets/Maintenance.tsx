import { useState, useEffect } from 'react';
import { Wrench, Plus, Search } from 'lucide-react';
import assetService, { type AssetMaintenance } from '@/services/assetService';
import { Modal, FormField, DetailRow, ModalBtn, inputCls, selectCls } from '@/app/components/ui/Modal';
const fmt = (n?: number) => n != null ? 'Rp ' + Number(n).toLocaleString('id-ID') : '-';
const statusColor: Record<string,string> = { SCHEDULED:'bg-blue-100 text-blue-800', IN_PROGRESS:'bg-yellow-100 text-yellow-800', COMPLETED:'bg-green-100 text-green-800', CANCELLED:'bg-red-100 text-red-800' };
const blank = () => ({ assetId:0, type:'PREVENTIVE', scheduledDate:'', cost:0, status:'SCHEDULED', notes:'' });
export function Maintenance() {
  const [records, setRecords] = useState<AssetMaintenance[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<'view'|'new'|null>(null);
  const [selected, setSelected] = useState<AssetMaintenance|null>(null);
  const [form, setForm] = useState(blank());
  const load = () => { setLoading(true); assetService.getMaintenance({ size:100 }).then(p=>setRecords(p.content??p as any)).catch(console.error).finally(()=>setLoading(false)); };
  useEffect(() => { load(); }, []);
  const filtered = records.filter(r => (r.asset?.name??'').toLowerCase().includes(search.toLowerCase()));
  const close = () => { setModal(null); setSelected(null); setForm(blank()); };
  const handleNew = () => { assetService.createMaintenance(form).then(()=>{load();close();}).catch(console.error); };
  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div><h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3"><Wrench className="w-8 h-8 text-blue-600" /> Pemeliharaan Aset</h1><p className="text-gray-500 mt-1">Kelola jadwal pemeliharaan aset</p></div>
        <button onClick={()=>setModal('new')} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"><Plus className="w-5 h-5" /> Jadwal Baru</button>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6"><div className="flex-1 relative max-w-md"><Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Cari aset..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" /></div></div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? <div className="p-8 text-center text-gray-400">Memuat data...</div> : (<table className="w-full"><thead className="bg-gray-50 border-b border-gray-200"><tr>{['Aset','Tipe','Jadwal','Biaya','Status','Aksi'].map(h=><th key={h} className="text-left px-4 py-3 text-sm font-semibold text-gray-900">{h}</th>)}</tr></thead>
          <tbody className="divide-y divide-gray-200">{filtered.map(r=>(
            <tr key={r.id} className="hover:bg-gray-50"><td className="px-4 py-4 text-sm font-medium text-gray-900">{r.asset?.name??'-'}</td><td className="px-4 py-4 text-sm text-gray-600">{r.type??'-'}</td><td className="px-4 py-4 text-sm text-gray-600">{r.scheduledDate??'-'}</td><td className="px-4 py-4 text-sm font-semibold text-gray-900">{fmt(r.cost)}</td><td className="px-4 py-4"><span className="px-2.5 py-0.5 rounded-full text-xs font-medium">{r.status}</span></td><td className="px-4 py-4 text-sm"><button onClick={()=>{setSelected(r);setModal('view');}} className="text-blue-600 hover:text-blue-800">Lihat</button></td></tr>
          ))}</tbody></table>)}
      </div>
      <Modal open={modal==='view'} onClose={close} title="Detail Pemeliharaan" size="md" footer={<ModalBtn onClick={close}>Tutup</ModalBtn>}>{selected&&<div><DetailRow label="Aset" value={selected.asset?.name??'-'}/><DetailRow label="Tipe" value={selected.type??'-'}/><DetailRow label="Jadwal" value={selected.scheduledDate??'-'}/><DetailRow label="Status" value={selected.status??'-'}/></div>}</Modal>
      <Modal open={modal==='new'} onClose={close} title="Jadwal Pemeliharaan Baru" size="md" footer={<><ModalBtn onClick={close}>Batal</ModalBtn><ModalBtn variant="primary" onClick={handleNew}>Simpan</ModalBtn></>}><div className="grid grid-cols-2 gap-4"><FormField label="ID Aset" required><input type="number" value={form.assetId||''} onChange={e=>setForm(f=>({...f,assetId:Number(e.target.value)}))} className={inputCls} /></FormField><FormField label="Tipe"><select value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))} className={selectCls}><option value="PREVENTIVE">Preventif</option><option value="CORRECTIVE">Korektif</option><option value="INSPECTION">Inspeksi</option></select></FormField><FormField label="Tgl Jadwal"><input type="date" value={form.scheduledDate} onChange={e=>setForm(f=>({...f,scheduledDate:e.target.value}))} className={inputCls} /></FormField><FormField label="Biaya"><input type="number" value={form.cost||''} onChange={e=>setForm(f=>({...f,cost:Number(e.target.value)}))} className={inputCls} /></FormField></div></Modal>
    </div>
  );
}
