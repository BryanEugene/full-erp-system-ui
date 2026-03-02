import { useState, useEffect } from 'react';
import { Wrench, Search } from 'lucide-react';
import manufacturingService, { type WorkOrder } from '@/services/manufacturingService';
import { Modal, DetailRow, ModalBtn } from '@/app/components/ui/Modal';
const statusColor: Record<string,string> = { PENDING:'bg-gray-100 text-gray-800', IN_PROGRESS:'bg-yellow-100 text-yellow-800', COMPLETED:'bg-green-100 text-green-800', CANCELLED:'bg-red-100 text-red-800' };
export function WorkOrders() {
  const [records, setRecords] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<WorkOrder|null>(null);
  const load = () => { setLoading(true); manufacturingService.getWorkOrders({ size:100 }).then(p=>setRecords(p.content??p as any)).catch(console.error).finally(()=>setLoading(false)); };
  useEffect(() => { load(); }, []);
  const filtered = records.filter(r => (r.workOrderNumber??'').toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="p-6">
      <div className="mb-6"><h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3"><Wrench className="w-8 h-8 text-blue-600" /> Work Order</h1><p className="text-gray-500 mt-1">Kelola perintah kerja produksi</p></div>
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6"><div className="flex-1 relative max-w-md"><Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Cari work order..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" /></div></div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? <div className="p-8 text-center text-gray-400">Memuat data...</div> : (<table className="w-full"><thead className="bg-gray-50 border-b border-gray-200"><tr>{['No. WO','Order Produksi','Operasi','Qty','Tgl Mulai','Status','Aksi'].map(h=><th key={h} className="text-left px-4 py-3 text-sm font-semibold text-gray-900">{h}</th>)}</tr></thead>
          <tbody className="divide-y divide-gray-200">{filtered.map(r=>(
            <tr key={r.id} className="hover:bg-gray-50"><td className="px-4 py-4 text-sm font-medium text-gray-900">{r.workOrderNumber??'-'}</td><td className="px-4 py-4 text-sm text-gray-600">{r.productionOrder?.orderNumber??'-'}</td><td className="px-4 py-4 text-sm text-gray-600">{r.operation??'-'}</td><td className="px-4 py-4 text-sm text-gray-600">{r.quantity??0}</td><td className="px-4 py-4 text-sm text-gray-600">{r.startDate??'-'}</td><td className="px-4 py-4"><span className="px-2.5 py-0.5 rounded-full text-xs font-medium">{r.status}</span></td><td className="px-4 py-4 text-sm"><button onClick={()=>setSelected(r)} className="text-blue-600 hover:text-blue-800">Lihat</button></td></tr>
          ))}</tbody></table>)}
      </div>
      <Modal open={!!selected} onClose={()=>setSelected(null)} title="Detail Work Order" size="md" footer={<ModalBtn onClick={()=>setSelected(null)}>Tutup</ModalBtn>}>{selected&&<div><DetailRow label="No. WO" value={selected.workOrderNumber??'-'}/><DetailRow label="Order Produksi" value={selected.productionOrder?.orderNumber??'-'}/><DetailRow label="Operasi" value={selected.operation??'-'}/><DetailRow label="Status" value={selected.status??'-'}/></div>}</Modal>
    </div>
  );
}
