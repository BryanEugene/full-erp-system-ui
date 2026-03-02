import { useState, useEffect } from 'react';
import { ArrowRightLeft, Plus, Search } from 'lucide-react';
import assetService, { type AssetTransfer } from '@/services/assetService';
import { Modal, FormField, DetailRow, ModalBtn, inputCls, selectCls } from '@/app/components/ui/Modal';
const statusColor: Record<string,string> = { PENDING:'bg-yellow-100 text-yellow-800', APPROVED:'bg-blue-100 text-blue-800', COMPLETED:'bg-green-100 text-green-800', CANCELLED:'bg-red-100 text-red-800' };
const blank = () => ({ assetId:0, fromLocation:'', toLocation:'', transferDate:'', status:'PENDING', reason:'' });
export function AssetTransfers() {
  const [records, setRecords] = useState<AssetTransfer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<'view'|'new'|null>(null);
  const [selected, setSelected] = useState<AssetTransfer|null>(null);
  const [form, setForm] = useState(blank());
  const load = () => { setLoading(true); assetService.getTransfers({ size:100 }).then(p=>setRecords(p.content??p as any)).catch(console.error).finally(()=>setLoading(false)); };
  useEffect(() => { load(); }, []);
  const filtered = records.filter(r => (r.asset?.name??'').toLowerCase().includes(search.toLowerCase()));
  const close = () => { setModal(null); setSelected(null); setForm(blank()); };
  const handleNew = () => { assetService.createTransfer(form).then(()=>{load();close();}).catch(console.error); };
  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div><h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3"><ArrowRightLeft className="w-8 h-8 text-blue-600" /> Transfer Aset</h1><p className="text-gray-500 mt-1">Kelola perpindahan aset</p></div>
        <button onClick={()=>setModal('new')} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"><Plus className="w-5 h-5" /> Transfer Baru</button>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6"><div className="flex-1 relative max-w-md"><Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Cari aset..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" /></div></div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? <div className="p-8 text-center text-gray-400">Memuat data...</div> : (<table className="w-full"><thead className="bg-gray-50 border-b border-gray-200"><tr>{['Aset','Dari','Ke','Tgl Transfer','Status','Aksi'].map(h=><th key={h} className="text-left px-4 py-3 text-sm font-semibold text-gray-900">{h}</th>)}</tr></thead>
          <tbody className="divide-y divide-gray-200">{filtered.map(r=>(
            <tr key={r.id} className="hover:bg-gray-50"><td className="px-4 py-4 text-sm font-medium text-gray-900">{r.asset?.name??'-'}</td><td className="px-4 py-4 text-sm text-gray-600">{r.fromLocation??'-'}</td><td className="px-4 py-4 text-sm text-gray-600">{r.toLocation??'-'}</td><td className="px-4 py-4 text-sm text-gray-600">{r.transferDate??'-'}</td><td className="px-4 py-4"><span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor[r.status??'']??'bg-gray-100 text-gray-800'}`}>{r.status}</span></td><td className="px-4 py-4 text-sm"><button onClick={()=>{setSelected(r);setModal('view');}} className="text-blue-600 hover:text-blue-800">Lihat</button></td></tr>
          ))}</tbody></table>)}
      </div>
      <Modal open={modal==='view'} onClose={close} title="Detail Transfer Aset" size="md" footer={<ModalBtn onClick={close}>Tutup</ModalBtn>}>{selected&&<div><DetailRow label="Aset" value={selected.asset?.name??'-'}/><DetailRow label="Dari" value={selected.fromLocation??'-'}/><DetailRow label="Ke" value={selected.toLocation??'-'}/><DetailRow label="Status" value={selected.status??'-'}/></div>}</Modal>
      <Modal open={modal==='new'} onClose={close} title="Transfer Aset Baru" size="md" footer={<><ModalBtn onClick={close}>Batal</ModalBtn><ModalBtn variant="primary" onClick={handleNew}>Simpan</ModalBtn></>}><div className="grid grid-cols-2 gap-4"><FormField label="ID Aset" required><input type="number" value={form.assetId||''} onChange={e=>setForm(f=>({...f,assetId:Number(e.target.value)}))} className={inputCls} /></FormField><FormField label="Dari Lokasi" required><input value={form.fromLocation} onChange={e=>setForm(f=>({...f,fromLocation:e.target.value}))} className={inputCls} /></FormField><FormField label="Ke Lokasi" required><input value={form.toLocation} onChange={e=>setForm(f=>({...f,toLocation:e.target.value}))} className={inputCls} /></FormField><FormField label="Tgl Transfer"><input type="date" value={form.transferDate} onChange={e=>setForm(f=>({...f,transferDate:e.target.value}))} className={inputCls} /></FormField><FormField label="Status"><select value={form.status} onChange={e=>setForm(f=>({...f,status:e.target.value}))} className={selectCls}><option value="PENDING">Menunggu</option><option value="APPROVED">Disetujui</option></select></FormField></div></Modal>
    </div>
  );
}
