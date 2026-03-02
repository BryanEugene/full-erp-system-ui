import { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Search, Filter } from 'lucide-react';
import salesOrderService, { type SalesOrder } from '@/services/salesOrderService';
import { Modal, FormField, DetailRow, ModalBtn, inputCls, selectCls } from '@/app/components/ui/Modal';

const fmt = (n?: number) => n != null ? 'Rp ' + Number(n).toLocaleString('id-ID') : '-';
const statusColor: Record<string,string> = { DRAFT:'bg-gray-100 text-gray-800', CONFIRMED:'bg-blue-100 text-blue-800', PROCESSING:'bg-yellow-100 text-yellow-800', SHIPPED:'bg-purple-100 text-purple-800', DELIVERED:'bg-green-100 text-green-800', CANCELLED:'bg-red-100 text-red-800' };
const blank = () => ({ orderNumber:'', customerId:0, orderDate:'', deliveryDate:'', status:'DRAFT', notes:'', total:0 });

export function SalesOrders() {
  const [orders, setOrders] = useState<SalesOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<'view'|'new'|'delete'|null>(null);
  const [selected, setSelected] = useState<SalesOrder|null>(null);
  const [form, setForm] = useState(blank());

  const load = () => {
    setLoading(true);
    salesOrderService.getAll({ size:100 }).then(p=>setOrders(p.content)).catch(console.error).finally(()=>setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const filtered = orders.filter(o => (o.orderNumber??'').toLowerCase().includes(search.toLowerCase()) || (o.customer?.companyName??'').toLowerCase().includes(search.toLowerCase()));
  const close = () => { setModal(null); setSelected(null); setForm(blank()); };

  const handleNew = () => { salesOrderService.create(form).then(()=>{load();close();}).catch(console.error); };
  const handleDelete = () => { if (!selected) return; salesOrderService.delete(selected.id).then(()=>{load();close();}).catch(console.error); };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div><h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3"><ShoppingCart className="w-8 h-8 text-blue-600" /> Sales Order</h1><p className="text-gray-500 mt-1">Kelola pesanan penjualan</p></div>
        <button onClick={()=>setModal('new')} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"><Plus className="w-5 h-5" /> Order Baru</button>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex gap-4"><div className="flex-1 relative"><Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Cari order atau pelanggan..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" /></div><button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"><Filter className="w-5 h-5" /> Filter</button></div>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? <div className="p-8 text-center text-gray-400">Memuat data...</div> : (
        <table className="w-full"><thead className="bg-gray-50 border-b border-gray-200"><tr>{['No. Order','Pelanggan','Tgl Order','Tgl Kirim','Total','Status','Aksi'].map(h=><th key={h} className="text-left px-4 py-3 text-sm font-semibold text-gray-900">{h}</th>)}</tr></thead>
          <tbody className="divide-y divide-gray-200">{filtered.map(o=>(
            <tr key={o.id} className="hover:bg-gray-50">
              <td className="px-4 py-4 text-sm font-medium text-gray-900">{o.orderNumber??'-'}</td>
              <td className="px-4 py-4 text-sm text-gray-900">{o.customer?.companyName??'-'}</td>
              <td className="px-4 py-4 text-sm text-gray-600">{o.orderDate??'-'}</td>
              <td className="px-4 py-4 text-sm text-gray-600">{o.deliveryDate??'-'}</td>
              <td className="px-4 py-4 text-sm font-semibold text-gray-900">{fmt(o.total)}</td>
              <td className="px-4 py-4"><span className="px-2.5 py-0.5 rounded-full text-xs font-medium">{o.status}</span></td>
              <td className="px-4 py-4 text-sm"><div className="flex gap-2"><button onClick={()=>{setSelected(o);setModal('view');}} className="text-blue-600 hover:text-blue-800">Lihat</button><button onClick={()=>{setSelected(o);setModal('delete');}} className="text-red-600 hover:text-red-800">Hapus</button></div></td>
            </tr>
          ))}
          </tbody>
        </table>
        )}
      </div>
      <Modal open={modal==='view'} onClose={close} title="Detail Sales Order" size="md" footer={<ModalBtn onClick={close}>Tutup</ModalBtn>}>
        {selected&&<div><DetailRow label="No. Order" value={selected.orderNumber??'-'}/><DetailRow label="Pelanggan" value={selected.customer?.companyName??'-'}/><DetailRow label="Tgl Order" value={selected.orderDate??'-'}/><DetailRow label="Tgl Kirim" value={selected.deliveryDate??'-'}/><DetailRow label="Total" value={fmt(selected.total)}/><DetailRow label="Catatan" value={selected.notes??'-'}/><DetailRow label="Status" value={<span className="px-2.5 py-0.5 rounded-full text-xs font-medium">{selected.status}</span>}/></div>}
      </Modal>
      <Modal open={modal==='new'} onClose={close} title="Sales Order Baru" size="md" footer={<><ModalBtn onClick={close}>Batal</ModalBtn><ModalBtn variant="primary" onClick={handleNew}>Simpan</ModalBtn></>}>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="No. Order" required><input value={form.orderNumber} onChange={e=>setForm(f=>({...f,orderNumber:e.target.value}))} className={inputCls} /></FormField>
          <FormField label="ID Pelanggan" required><input type="number" value={form.customerId||''} onChange={e=>setForm(f=>({...f,customerId:Number(e.target.value)}))} className={inputCls} /></FormField>
          <FormField label="Tgl Order" required><input type="date" value={form.orderDate} onChange={e=>setForm(f=>({...f,orderDate:e.target.value}))} className={inputCls} /></FormField>
          <FormField label="Tgl Kirim"><input type="date" value={form.deliveryDate} onChange={e=>setForm(f=>({...f,deliveryDate:e.target.value}))} className={inputCls} /></FormField>
          <FormField label="Total"><input type="number" value={form.total||''} onChange={e=>setForm(f=>({...f,total:Number(e.target.value)}))} className={inputCls} /></FormField>
          <FormField label="Status"><select value={form.status} onChange={e=>setForm(f=>({...f,status:e.target.value}))} className={selectCls}><option value="DRAFT">Draft</option><option value="CONFIRMED">Terkonfirmasi</option><option value="PROCESSING">Diproses</option></select></FormField>
          <div className="col-span-2"><FormField label="Catatan"><input value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} className={inputCls} /></FormField></div>
        </div>
      </Modal>
      <Modal open={modal==='delete'} onClose={close} title="Hapus Sales Order" size="sm" footer={<><ModalBtn onClick={close}>Batal</ModalBtn><ModalBtn variant="danger" onClick={handleDelete}>Hapus</ModalBtn></>}>
        <p className="text-gray-600">Yakin ingin menghapus order <strong>{selected?.orderNumber}</strong>?</p>
      </Modal>
    </div>
  );
}
