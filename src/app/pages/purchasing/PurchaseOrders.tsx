import { useState, useEffect } from 'react';
import { ShoppingBag, Plus, Search, Filter } from 'lucide-react';
import purchaseOrderService, { type PurchaseOrder } from '@/services/purchaseOrderService';
import { Modal, FormField, DetailRow, ModalBtn, inputCls, selectCls } from '@/app/components/ui/Modal';
const fmt = (n?: number) => n != null ? 'Rp ' + Number(n).toLocaleString('id-ID') : '-';
const statusColor: Record<string,string> = { DRAFT:'bg-gray-100 text-gray-800', CONFIRMED:'bg-blue-100 text-blue-800', RECEIVED:'bg-green-100 text-green-800', CANCELLED:'bg-red-100 text-red-800' };
const blank = () => ({ poNumber:'', vendorId:0, orderDate:'', deliveryDate:'', status:'DRAFT', notes:'', total:0 });
export function PurchaseOrders() {
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<'view'|'new'|'delete'|null>(null);
  const [selected, setSelected] = useState<PurchaseOrder|null>(null);
  const [form, setForm] = useState(blank());
  const load = () => { setLoading(true); purchaseOrderService.getAll({ size:100 }).then(p=>setOrders(p.content)).catch(console.error).finally(()=>setLoading(false)); };
  useEffect(() => { load(); }, []);
  const filtered = orders.filter(o => (o.poNumber??'').toLowerCase().includes(search.toLowerCase()) || (o.vendor?.companyName??'').toLowerCase().includes(search.toLowerCase()));
  const close = () => { setModal(null); setSelected(null); setForm(blank()); };
  const handleNew = () => { purchaseOrderService.create(form).then(()=>{load();close();}).catch(console.error); };
  const handleDelete = () => { if (!selected) return; purchaseOrderService.delete(selected.id).then(()=>{load();close();}).catch(console.error); };
  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div><h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3"><ShoppingBag className="w-8 h-8 text-blue-600" /> Purchase Order</h1><p className="text-gray-500 mt-1">Kelola pesanan pembelian</p></div>
        <button onClick={()=>setModal('new')} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"><Plus className="w-5 h-5" /> PO Baru</button>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6"><div className="flex gap-4"><div className="flex-1 relative"><Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Cari PO atau pemasok..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" /></div><button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"><Filter className="w-5 h-5" /> Filter</button></div></div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? <div className="p-8 text-center text-gray-400">Memuat data...</div> : (<table className="w-full"><thead className="bg-gray-50 border-b border-gray-200"><tr>{['No. PO','Pemasok','Tgl Order','Tgl Terima','Total','Status','Aksi'].map(h=><th key={h} className="text-left px-4 py-3 text-sm font-semibold text-gray-900">{h}</th>)}</tr></thead>
          <tbody className="divide-y divide-gray-200">{filtered.map(o=>(
            <tr key={o.id} className="hover:bg-gray-50"><td className="px-4 py-4 text-sm font-medium text-gray-900">{o.poNumber??'-'}</td><td className="px-4 py-4 text-sm text-gray-900">{o.vendor?.companyName??'-'}</td><td className="px-4 py-4 text-sm text-gray-600">{o.orderDate??'-'}</td><td className="px-4 py-4 text-sm text-gray-600">{o.deliveryDate??'-'}</td><td className="px-4 py-4 text-sm font-semibold text-gray-900">{fmt(o.total)}</td><td className="px-4 py-4"><span className="px-2.5 py-0.5 rounded-full text-xs font-medium">{o.status}</span></td><td className="px-4 py-4 text-sm"><div className="flex gap-2"><button onClick={()=>{setSelected(o);setModal('view');}} className="text-blue-600 hover:text-blue-800">Lihat</button><button onClick={()=>{setSelected(o);setModal('delete');}} className="text-red-600 hover:text-red-800">Hapus</button></div></td></tr>
          ))}</tbody></table>)}
      </div>
      <Modal open={modal==='view'} onClose={close} title="Detail PO" size="md" footer={<ModalBtn onClick={close}>Tutup</ModalBtn>}>{selected&&<div><DetailRow label="No. PO" value={selected.poNumber??'-'}/><DetailRow label="Pemasok" value={selected.vendor?.companyName??'-'}/><DetailRow label="Tgl Order" value={selected.orderDate??'-'}/><DetailRow label="Total" value={fmt(selected.total)}/><DetailRow label="Status" value={selected.status}/></div>}</Modal>
      <Modal open={modal==='new'} onClose={close} title="PO Baru" size="md" footer={<><ModalBtn onClick={close}>Batal</ModalBtn><ModalBtn variant="primary" onClick={handleNew}>Simpan</ModalBtn></>}><div className="grid grid-cols-2 gap-4"><FormField label="No. PO" required><input value={form.poNumber} onChange={e=>setForm(f=>({...f,poNumber:e.target.value}))} className={inputCls} /></FormField><FormField label="ID Pemasok" required><input type="number" value={form.vendorId||''} onChange={e=>setForm(f=>({...f,vendorId:Number(e.target.value)}))} className={inputCls} /></FormField><FormField label="Tgl Order"><input type="date" value={form.orderDate} onChange={e=>setForm(f=>({...f,orderDate:e.target.value}))} className={inputCls} /></FormField><FormField label="Tgl Terima"><input type="date" value={form.deliveryDate} onChange={e=>setForm(f=>({...f,deliveryDate:e.target.value}))} className={inputCls} /></FormField><FormField label="Total"><input type="number" value={form.total||''} onChange={e=>setForm(f=>({...f,total:Number(e.target.value)}))} className={inputCls} /></FormField><FormField label="Status"><select value={form.status} onChange={e=>setForm(f=>({...f,status:e.target.value}))} className={selectCls}><option value="DRAFT">Draft</option><option value="CONFIRMED">Terkonfirmasi</option></select></FormField></div></Modal>
      <Modal open={modal==='delete'} onClose={close} title="Hapus PO" size="sm" footer={<><ModalBtn onClick={close}>Batal</ModalBtn><ModalBtn variant="danger" onClick={handleDelete}>Hapus</ModalBtn></>}><p className="text-gray-600">Yakin hapus PO <strong>{selected?.poNumber}</strong>?</p></Modal>
    </div>
  );
}
