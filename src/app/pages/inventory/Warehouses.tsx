import { useState, useEffect } from 'react';
import { Warehouse as WarehouseIcon, Plus, Search } from 'lucide-react';
import warehouseService, { type Warehouse } from '@/services/warehouseService';
import { Modal, FormField, DetailRow, ModalBtn, inputCls, selectCls } from '@/app/components/ui/Modal';
const blank = () => ({ code:'', name:'', location:'', capacity:0, isActive:true });
export function Warehouses() {
  const [records, setRecords] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<'view'|'new'|null>(null);
  const [selected, setSelected] = useState<Warehouse|null>(null);
  const [form, setForm] = useState(blank());
  const load = () => { setLoading(true); warehouseService.getAll().then(data=>setRecords(Array.isArray(data)?data:(data as any).content??[])).catch(console.error).finally(()=>setLoading(false)); };
  useEffect(() => { load(); }, []);
  const filtered = records.filter(r => (r.code??'').toLowerCase().includes(search.toLowerCase()) || (r.name??'').toLowerCase().includes(search.toLowerCase()));
  const close = () => { setModal(null); setSelected(null); setForm(blank()); };
  const handleNew = () => { warehouseService.create(form).then(()=>{load();close();}).catch(console.error); };
  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div><h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3"><WarehouseIcon className="w-8 h-8 text-blue-600" /> Gudang</h1><p className="text-gray-500 mt-1">Kelola data gudang dan lokasi</p></div>
        <button onClick={()=>setModal('new')} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"><Plus className="w-5 h-5" /> Gudang Baru</button>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6"><div className="flex-1 relative max-w-md"><Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Cari gudang..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" /></div></div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? <div className="p-8 text-center text-gray-400">Memuat data...</div> : (<table className="w-full"><thead className="bg-gray-50 border-b border-gray-200"><tr>{['Kode','Nama','Lokasi','Kapasitas','Status','Aksi'].map(h=><th key={h} className="text-left px-4 py-3 text-sm font-semibold text-gray-900">{h}</th>)}</tr></thead>
          <tbody className="divide-y divide-gray-200">{filtered.map(r=>(
            <tr key={r.id} className="hover:bg-gray-50"><td className="px-4 py-4 text-sm font-medium text-gray-900">{r.code??'-'}</td><td className="px-4 py-4 text-sm text-gray-900">{r.name??'-'}</td><td className="px-4 py-4 text-sm text-gray-600">{r.location??'-'}</td><td className="px-4 py-4 text-sm text-gray-600">{r.capacity??'-'}</td><td className="px-4 py-4"><span className="px-2.5 py-0.5 rounded-full text-xs font-medium">{r.isActive?'Aktif':'Nonaktif'}</span></td><td className="px-4 py-4 text-sm"><button onClick={()=>{setSelected(r);setModal('view');}} className="text-blue-600 hover:text-blue-800">Lihat</button></td></tr>
          ))}</tbody></table>)}
      </div>
      <Modal open={modal==='view'} onClose={close} title="Detail Gudang" size="md" footer={<ModalBtn onClick={close}>Tutup</ModalBtn>}>{selected&&<div><DetailRow label="Kode" value={selected.code??'-'}/><DetailRow label="Nama" value={selected.name??'-'}/><DetailRow label="Lokasi" value={selected.location??'-'}/><DetailRow label="Kapasitas" value={String(selected.capacity??'-')}/><DetailRow label="Status" value={selected.isActive?'Aktif':'Nonaktif'}/></div>}</Modal>
      <Modal open={modal==='new'} onClose={close} title="Gudang Baru" size="md" footer={<><ModalBtn onClick={close}>Batal</ModalBtn><ModalBtn variant="primary" onClick={handleNew}>Simpan</ModalBtn></>}><div className="grid grid-cols-2 gap-4"><FormField label="Kode" required><input value={form.code} onChange={e=>setForm(f=>({...f,code:e.target.value}))} className={inputCls} /></FormField><FormField label="Nama" required><input value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} className={inputCls} /></FormField><FormField label="Lokasi"><input value={form.location} onChange={e=>setForm(f=>({...f,location:e.target.value}))} className={inputCls} /></FormField><FormField label="Kapasitas"><input type="number" value={form.capacity||''} onChange={e=>setForm(f=>({...f,capacity:Number(e.target.value)}))} className={inputCls} /></FormField><FormField label="Status"><select value={form.isActive?'true':'false'} onChange={e=>setForm(f=>({...f,isActive:e.target.value==='true'}))} className={selectCls}><option value="true">Aktif</option><option value="false">Nonaktif</option></select></FormField></div></Modal>
    </div>
  );
}
