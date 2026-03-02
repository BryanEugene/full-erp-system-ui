import { useState, useEffect } from 'react';
import { FileText, Plus, Search, Filter } from 'lucide-react';
import { salesQuotationService, type SalesQuotation } from '@/services/salesExtService';
import { Modal, FormField, DetailRow, ModalBtn, inputCls, selectCls } from '@/app/components/ui/Modal';

const fmt = (n?: number) => n != null ? 'Rp ' + Number(n).toLocaleString('id-ID') : '-';
const statusColor: Record<string,string> = { DRAFT:'bg-gray-100 text-gray-800', SENT:'bg-blue-100 text-blue-800', ACCEPTED:'bg-green-100 text-green-800', REJECTED:'bg-red-100 text-red-800', EXPIRED:'bg-orange-100 text-orange-800' };
const blank = () => ({ quotationNumber:'', customerId:0, quotationDate:'', validUntil:'', status:'DRAFT', notes:'', total:0 });

export function SalesQuotations() {
  const [records, setRecords] = useState<SalesQuotation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<'view'|'new'|null>(null);
  const [selected, setSelected] = useState<SalesQuotation|null>(null);
  const [form, setForm] = useState(blank());

  const load = () => { setLoading(true); salesQuotationService.getAll({ size:100 }).then(p=>setRecords(p.content)).catch(console.error).finally(()=>setLoading(false)); };
  useEffect(() => { load(); }, []);
  const filtered = records.filter(r => (r.quotationNumber??'').toLowerCase().includes(search.toLowerCase()) || (r.customer?.companyName??'').toLowerCase().includes(search.toLowerCase()));
  const close = () => { setModal(null); setSelected(null); setForm(blank()); };
  const handleNew = () => { salesQuotationService.create(form).then(()=>{load();close();}).catch(console.error); };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div><h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3"><FileText className="w-8 h-8 text-blue-600" /> Penawaran Harga</h1><p className="text-gray-500 mt-1">Kelola penawaran harga kepada pelanggan</p></div>
        <button onClick={()=>setModal('new')} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"><Plus className="w-5 h-5" /> Penawaran Baru</button>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex gap-4"><div className="flex-1 relative"><Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Cari penawaran atau pelanggan..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" /></div><button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"><Filter className="w-5 h-5" /> Filter</button></div>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? <div className="p-8 text-center text-gray-400">Memuat data...</div> : (
        <table className="w-full"><thead className="bg-gray-50 border-b border-gray-200"><tr>{['No. Penawaran','Pelanggan','Tgl','Berlaku Hingga','Total','Status','Aksi'].map(h=><th key={h} className="text-left px-4 py-3 text-sm font-semibold text-gray-900">{h}</th>)}</tr></thead>
          <tbody className="divide-y divide-gray-200">{filtered.map(r=>(
            <tr key={r.id} className="hover:bg-gray-50">
              <td className="px-4 py-4 text-sm font-medium text-gray-900">{r.quotationNumber??'-'}</td>
              <td className="px-4 py-4 text-sm text-gray-900">{r.customer?.companyName??'-'}</td>
              <td className="px-4 py-4 text-sm text-gray-600">{r.quotationDate??'-'}</td>
              <td className="px-4 py-4 text-sm text-gray-600">{r.validUntil??'-'}</td>
              <td className="px-4 py-4 text-sm font-semibold text-gray-900">{fmt(r.total)}</td>
              <td className="px-4 py-4"><span className="px-2.5 py-0.5 rounded-full text-xs font-medium">{r.status}</span></td>
              <td className="px-4 py-4 text-sm"><button onClick={()=>{setSelected(r);setModal('view');}} className="text-blue-600 hover:text-blue-800">Lihat</button></td>
            </tr>
          ))}
          </tbody>
        </table>
        )}
      </div>
      <Modal open={modal==='view'} onClose={close} title="Detail Penawaran" size="md" footer={<ModalBtn onClick={close}>Tutup</ModalBtn>}>
        {selected&&<div><DetailRow label="No. Penawaran" value={selected.quotationNumber??'-'}/><DetailRow label="Pelanggan" value={selected.customer?.companyName??'-'}/><DetailRow label="Tgl" value={selected.quotationDate??'-'}/><DetailRow label="Berlaku Hingga" value={selected.validUntil??'-'}/><DetailRow label="Total" value={fmt(selected.total)}/><DetailRow label="Status" value={selected.status}/></div>}
      </Modal>
      <Modal open={modal==='new'} onClose={close} title="Penawaran Baru" size="md" footer={<><ModalBtn onClick={close}>Batal</ModalBtn><ModalBtn variant="primary" onClick={handleNew}>Simpan</ModalBtn></>}>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="No. Penawaran" required><input value={form.quotationNumber} onChange={e=>setForm(f=>({...f,quotationNumber:e.target.value}))} className={inputCls} /></FormField>
          <FormField label="ID Pelanggan" required><input type="number" value={form.customerId||''} onChange={e=>setForm(f=>({...f,customerId:Number(e.target.value)}))} className={inputCls} /></FormField>
          <FormField label="Tgl Penawaran"><input type="date" value={form.quotationDate} onChange={e=>setForm(f=>({...f,quotationDate:e.target.value}))} className={inputCls} /></FormField>
          <FormField label="Berlaku Hingga"><input type="date" value={form.validUntil} onChange={e=>setForm(f=>({...f,validUntil:e.target.value}))} className={inputCls} /></FormField>
          <FormField label="Total"><input type="number" value={form.total||''} onChange={e=>setForm(f=>({...f,total:Number(e.target.value)}))} className={inputCls} /></FormField>
          <FormField label="Status"><select value={form.status} onChange={e=>setForm(f=>({...f,status:e.target.value}))} className={selectCls}><option value="DRAFT">Draft</option><option value="SENT">Terkirim</option><option value="ACCEPTED">Diterima</option><option value="REJECTED">Ditolak</option></select></FormField>
        </div>
      </Modal>
    </div>
  );
}
