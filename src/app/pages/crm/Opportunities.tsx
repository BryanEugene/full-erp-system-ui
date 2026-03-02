import { useState, useEffect } from 'react';
import { TrendingUp, Plus, Search } from 'lucide-react';
import crmService, { type Opportunity } from '@/services/crmService';
import { Modal, FormField, DetailRow, ModalBtn, inputCls, selectCls } from '@/app/components/ui/Modal';
const fmt = (n?: number) => n != null ? 'Rp ' + Number(n).toLocaleString('id-ID') : '-';
const statusColor: Record<string,string> = { PROSPECT:'bg-blue-100 text-blue-800', PROPOSAL:'bg-yellow-100 text-yellow-800', NEGOTIATION:'bg-orange-100 text-orange-800', WON:'bg-green-100 text-green-800', LOST:'bg-red-100 text-red-800' };
const blank = () => ({ name:'', customerId:0, value:0, probability:0, expectedCloseDate:'', status:'PROSPECT', notes:'' });
export function Opportunities() {
  const [records, setRecords] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<'view'|'new'|null>(null);
  const [selected, setSelected] = useState<Opportunity|null>(null);
  const [form, setForm] = useState(blank());
  const load = () => { setLoading(true); crmService.getOpportunities({ size:100 }).then(p=>setRecords(p.content??p as any)).catch(console.error).finally(()=>setLoading(false)); };
  useEffect(() => { load(); }, []);
  const filtered = records.filter(r => (r.name??'').toLowerCase().includes(search.toLowerCase()) || (r.customer?.companyName??'').toLowerCase().includes(search.toLowerCase()));
  const close = () => { setModal(null); setSelected(null); setForm(blank()); };
  const handleNew = () => { crmService.createOpportunity(form).then(()=>{load();close();}).catch(console.error); };
  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div><h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3"><TrendingUp className="w-8 h-8 text-blue-600" /> Peluang</h1><p className="text-gray-500 mt-1">Kelola peluang penjualan</p></div>
        <button onClick={()=>setModal('new')} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"><Plus className="w-5 h-5" /> Peluang Baru</button>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6"><div className="flex-1 relative max-w-md"><Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Cari peluang..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" /></div></div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? <div className="p-8 text-center text-gray-400">Memuat data...</div> : (<table className="w-full"><thead className="bg-gray-50 border-b border-gray-200"><tr>{['Nama','Klien','Nilai','Probabilitas','Tgl Estimasi','Status','Aksi'].map(h=><th key={h} className="text-left px-4 py-3 text-sm font-semibold text-gray-900">{h}</th>)}</tr></thead>
          <tbody className="divide-y divide-gray-200">{filtered.map(r=>(
            <tr key={r.id} className="hover:bg-gray-50"><td className="px-4 py-4 text-sm font-medium text-gray-900">{r.name??'-'}</td><td className="px-4 py-4 text-sm text-gray-600">{r.customer?.companyName??'-'}</td><td className="px-4 py-4 text-sm font-semibold text-gray-900">{fmt(r.value)}</td><td className="px-4 py-4 text-sm text-gray-600">{r.probability??0}%</td><td className="px-4 py-4 text-sm text-gray-600">{r.expectedCloseDate??'-'}</td><td className="px-4 py-4"><span className="px-2.5 py-0.5 rounded-full text-xs font-medium">{r.status}</span></td><td className="px-4 py-4 text-sm"><button onClick={()=>{setSelected(r);setModal('view');}} className="text-blue-600 hover:text-blue-800">Lihat</button></td></tr>
          ))}</tbody></table>)}
      </div>
      <Modal open={modal==='view'} onClose={close} title="Detail Peluang" size="md" footer={<ModalBtn onClick={close}>Tutup</ModalBtn>}>{selected&&<div><DetailRow label="Nama" value={selected.name??'-'}/><DetailRow label="Klien" value={selected.customer?.companyName??'-'}/><DetailRow label="Nilai" value={fmt(selected.value)}/><DetailRow label="Probabilitas" value={`${selected.probability??0}%`}/><DetailRow label="Status" value={selected.status??'-'}/></div>}</Modal>
      <Modal open={modal==='new'} onClose={close} title="Peluang Baru" size="md" footer={<><ModalBtn onClick={close}>Batal</ModalBtn><ModalBtn variant="primary" onClick={handleNew}>Simpan</ModalBtn></>}><div className="grid grid-cols-2 gap-4"><FormField label="Nama" required><input value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} className={inputCls} /></FormField><FormField label="ID Klien"><input type="number" value={form.customerId||''} onChange={e=>setForm(f=>({...f,customerId:Number(e.target.value)}))} className={inputCls} /></FormField><FormField label="Nilai"><input type="number" value={form.value||''} onChange={e=>setForm(f=>({...f,value:Number(e.target.value)}))} className={inputCls} /></FormField><FormField label="Probabilitas (%)"><input type="number" min="0" max="100" value={form.probability||''} onChange={e=>setForm(f=>({...f,probability:Number(e.target.value)}))} className={inputCls} /></FormField><FormField label="Tgl Estimasi"><input type="date" value={form.expectedCloseDate} onChange={e=>setForm(f=>({...f,expectedCloseDate:e.target.value}))} className={inputCls} /></FormField><FormField label="Status"><select value={form.status} onChange={e=>setForm(f=>({...f,status:e.target.value}))} className={selectCls}><option value="PROSPECT">Prospek</option><option value="PROPOSAL">Proposal</option></select></FormField></div></Modal>
    </div>
  );
}
