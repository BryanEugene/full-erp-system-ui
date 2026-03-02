import { useState, useEffect } from 'react';
import { Layers, Plus, Search } from 'lucide-react';
import manufacturingService, { type BillOfMaterials } from '@/services/manufacturingService';
import { Modal, FormField, DetailRow, ModalBtn, inputCls, selectCls } from '@/app/components/ui/Modal';
const statusColor: Record<string,string> = { DRAFT:'bg-gray-100 text-gray-800', ACTIVE:'bg-green-100 text-green-800', OBSOLETE:'bg-red-100 text-red-800' };
const blank = () => ({ bomNumber:'', productId:0, version:'1.0', status:'DRAFT', notes:'' });
export function BillOfMaterials() {
  const [records, setRecords] = useState<BillOfMaterials[]>([]);;
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<'view'|'new'|null>(null);
  const [selected, setSelected] = useState<BillOfMaterials|null>(null);
  const [form, setForm] = useState(blank());
  const load = () => { setLoading(true); manufacturingService.getBOMs({ size:100 }).then(p=>setRecords(p.content??p as any)).catch(console.error).finally(()=>setLoading(false)); };
  useEffect(() => { load(); }, []);
  const filtered = records.filter(r => (r.bomNumber??'').toLowerCase().includes(search.toLowerCase()) || (r.product?.name??'').toLowerCase().includes(search.toLowerCase()));
  const close = () => { setModal(null); setSelected(null); setForm(blank()); };
  const handleNew = () => { manufacturingService.createBOM(form).then(()=>{load();close();}).catch(console.error); };
  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div><h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3"><Layers className="w-8 h-8 text-blue-600" /> Bill of Materials</h1><p className="text-gray-500 mt-1">Kelola struktur material produk</p></div>
        <button onClick={()=>setModal('new')} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"><Plus className="w-5 h-5" /> BOM Baru</button>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6"><div className="flex-1 relative max-w-md"><Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Cari BOM atau produk..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" /></div></div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? <div className="p-8 text-center text-gray-400">Memuat data...</div> : (<table className="w-full"><thead className="bg-gray-50 border-b border-gray-200"><tr>{['No. BOM','Produk','Versi','Status','Aksi'].map(h=><th key={h} className="text-left px-4 py-3 text-sm font-semibold text-gray-900">{h}</th>)}</tr></thead>
          <tbody className="divide-y divide-gray-200">{filtered.map(r=>(
            <tr key={r.id} className="hover:bg-gray-50"><td className="px-4 py-4 text-sm font-medium text-gray-900">{r.bomNumber??'-'}</td><td className="px-4 py-4 text-sm text-gray-900">{r.product?.name??'-'}</td><td className="px-4 py-4 text-sm text-gray-600">{r.version??'-'}</td><td className="px-4 py-4"><span className="px-2.5 py-0.5 rounded-full text-xs font-medium">{r.status}</span></td><td className="px-4 py-4 text-sm"><button onClick={()=>{setSelected(r);setModal('view');}} className="text-blue-600 hover:text-blue-800">Lihat</button></td></tr>
          ))}</tbody></table>)}
      </div>
      <Modal open={modal==='view'} onClose={close} title="Detail BOM" size="md" footer={<ModalBtn onClick={close}>Tutup</ModalBtn>}>{selected&&<div><DetailRow label="No. BOM" value={selected.bomNumber??'-'}/><DetailRow label="Produk" value={selected.product?.name??'-'}/><DetailRow label="Versi" value={selected.version??'-'}/><DetailRow label="Status" value={selected.status??'-'}/></div>}</Modal>
      <Modal open={modal==='new'} onClose={close} title="BOM Baru" size="md" footer={<><ModalBtn onClick={close}>Batal</ModalBtn><ModalBtn variant="primary" onClick={handleNew}>Simpan</ModalBtn></>}><div className="grid grid-cols-2 gap-4"><FormField label="No. BOM" required><input value={form.bomNumber} onChange={e=>setForm(f=>({...f,bomNumber:e.target.value}))} className={inputCls} /></FormField><FormField label="ID Produk" required><input type="number" value={form.productId||''} onChange={e=>setForm(f=>({...f,productId:Number(e.target.value)}))} className={inputCls} /></FormField><FormField label="Versi"><input value={form.version} onChange={e=>setForm(f=>({...f,version:e.target.value}))} className={inputCls} /></FormField><FormField label="Status"><select value={form.status} onChange={e=>setForm(f=>({...f,status:e.target.value}))} className={selectCls}><option value="DRAFT">Draft</option><option value="ACTIVE">Aktif</option></select></FormField></div></Modal>
    </div>
  );
}
