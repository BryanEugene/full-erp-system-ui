import { useState, useEffect } from 'react';
import { Receipt, Plus, Search, Filter } from 'lucide-react';
import { salesInvoiceService, type SalesInvoice } from '@/services/salesExtService';
import { Modal, FormField, DetailRow, ModalBtn, inputCls, selectCls } from '@/app/components/ui/Modal';

const fmt = (n?: number) => n != null ? 'Rp ' + Number(n).toLocaleString('id-ID') : '-';
const statusColor: Record<string,string> = { DRAFT:'bg-gray-100 text-gray-800', SENT:'bg-blue-100 text-blue-800', PARTIAL:'bg-yellow-100 text-yellow-800', PAID:'bg-green-100 text-green-800', OVERDUE:'bg-red-100 text-red-800' };
const blank = () => ({ invoiceNumber:'', customerId:0, invoiceDate:'', dueDate:'', status:'DRAFT', total:0 });

export function SalesInvoices() {
  const [records, setRecords] = useState<SalesInvoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<'view'|'new'|null>(null);
  const [selected, setSelected] = useState<SalesInvoice|null>(null);
  const [form, setForm] = useState(blank());

  const load = () => { setLoading(true); salesInvoiceService.getAll({ size:100 }).then(p=>setRecords(p.content)).catch(console.error).finally(()=>setLoading(false)); };
  useEffect(() => { load(); }, []);
  const filtered = records.filter(r => (r.invoiceNumber??'').toLowerCase().includes(search.toLowerCase()) || (r.customer?.companyName??'').toLowerCase().includes(search.toLowerCase()));
  const close = () => { setModal(null); setSelected(null); setForm(blank()); };
  const handleNew = () => { salesInvoiceService.create(form).then(()=>{load();close();}).catch(console.error); };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div><h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3"><Receipt className="w-8 h-8 text-blue-600" /> Invoice Penjualan</h1><p className="text-gray-500 mt-1">Kelola invoice penjualan</p></div>
        <button onClick={()=>setModal('new')} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"><Plus className="w-5 h-5" /> Invoice Baru</button>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex gap-4"><div className="flex-1 relative"><Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Cari invoice atau pelanggan..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" /></div><button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"><Filter className="w-5 h-5" /> Filter</button></div>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? <div className="p-8 text-center text-gray-400">Memuat data...</div> : (
        <table className="w-full"><thead className="bg-gray-50 border-b border-gray-200"><tr>{['No. Invoice','Pelanggan','Tgl Invoice','Jatuh Tempo','Total','Status','Aksi'].map(h=><th key={h} className="text-left px-4 py-3 text-sm font-semibold text-gray-900">{h}</th>)}</tr></thead>
          <tbody className="divide-y divide-gray-200">{filtered.map(r=>(
            <tr key={r.id} className="hover:bg-gray-50">
              <td className="px-4 py-4 text-sm font-medium text-gray-900">{r.invoiceNumber??'-'}</td>
              <td className="px-4 py-4 text-sm text-gray-900">{r.customer?.companyName??'-'}</td>
              <td className="px-4 py-4 text-sm text-gray-600">{r.invoiceDate??'-'}</td>
              <td className="px-4 py-4 text-sm text-gray-600">{r.dueDate??'-'}</td>
              <td className="px-4 py-4 text-sm font-semibold text-gray-900">{fmt(r.total)}</td>
              <td className="px-4 py-4"><span className="px-2.5 py-0.5 rounded-full text-xs font-medium">{r.status}</span></td>
              <td className="px-4 py-4 text-sm"><button onClick={()=>{setSelected(r);setModal('view');}} className="text-blue-600 hover:text-blue-800">Lihat</button></td>
            </tr>
          ))}
          </tbody>
        </table>
        )}
      </div>
      <Modal open={modal==='view'} onClose={close} title="Detail Invoice" size="md" footer={<ModalBtn onClick={close}>Tutup</ModalBtn>}>
        {selected&&<div><DetailRow label="No. Invoice" value={selected.invoiceNumber??'-'}/><DetailRow label="Pelanggan" value={selected.customer?.companyName??'-'}/><DetailRow label="Tgl Invoice" value={selected.invoiceDate??'-'}/><DetailRow label="Jatuh Tempo" value={selected.dueDate??'-'}/><DetailRow label="Total" value={fmt(selected.total)}/><DetailRow label="Status" value={selected.status}/></div>}
      </Modal>
      <Modal open={modal==='new'} onClose={close} title="Invoice Baru" size="md" footer={<><ModalBtn onClick={close}>Batal</ModalBtn><ModalBtn variant="primary" onClick={handleNew}>Simpan</ModalBtn></>}>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="No. Invoice" required><input value={form.invoiceNumber} onChange={e=>setForm(f=>({...f,invoiceNumber:e.target.value}))} className={inputCls} /></FormField>
          <FormField label="ID Pelanggan" required><input type="number" value={form.customerId||''} onChange={e=>setForm(f=>({...f,customerId:Number(e.target.value)}))} className={inputCls} /></FormField>
          <FormField label="Tgl Invoice"><input type="date" value={form.invoiceDate} onChange={e=>setForm(f=>({...f,invoiceDate:e.target.value}))} className={inputCls} /></FormField>
          <FormField label="Jatuh Tempo"><input type="date" value={form.dueDate} onChange={e=>setForm(f=>({...f,dueDate:e.target.value}))} className={inputCls} /></FormField>
          <FormField label="Total"><input type="number" value={form.total||''} onChange={e=>setForm(f=>({...f,total:Number(e.target.value)}))} className={inputCls} /></FormField>
          <FormField label="Status"><select value={form.status} onChange={e=>setForm(f=>({...f,status:e.target.value}))} className={selectCls}><option value="DRAFT">Draft</option><option value="SENT">Terkirim</option><option value="PARTIAL">Sebagian</option><option value="PAID">Lunas</option></select></FormField>
        </div>
      </Modal>
    </div>
  );
}
