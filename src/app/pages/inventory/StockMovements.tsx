import { useState, useEffect } from 'react';
import { ArrowLeftRight, Search, Filter } from 'lucide-react';
import { stockMovementService, type StockMovement } from '@/services/stockService';
import { Modal, DetailRow, ModalBtn } from '@/app/components/ui/Modal';
const typeColor: Record<string,string> = { IN:'bg-green-100 text-green-800', OUT:'bg-red-100 text-red-800', TRANSFER:'bg-blue-100 text-blue-800', ADJUSTMENT:'bg-yellow-100 text-yellow-800' };
export function StockMovements() {
  const [records, setRecords] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<StockMovement|null>(null);
  const load = () => { setLoading(true); stockMovementService.getAll({ size:100 }).then(p=>setRecords(p.content??p as any)).catch(console.error).finally(()=>setLoading(false)); };
  useEffect(() => { load(); }, []);
  const filtered = records.filter(r => (r.product?.name??'').toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="p-6">
      <div className="mb-6"><h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3"><ArrowLeftRight className="w-8 h-8 text-blue-600" /> Pergerakan Stok</h1><p className="text-gray-500 mt-1">Riwayat mutasi stok gudang</p></div>
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6"><div className="flex gap-4"><div className="flex-1 relative"><Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Cari produk..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" /></div><button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"><Filter className="w-5 h-5" /> Filter</button></div></div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? <div className="p-8 text-center text-gray-400">Memuat data...</div> : (<table className="w-full"><thead className="bg-gray-50 border-b border-gray-200"><tr>{['Produk','Gudang','Jenis','Qty','Ref. Dokumen','Tanggal','Aksi'].map(h=><th key={h} className="text-left px-4 py-3 text-sm font-semibold text-gray-900">{h}</th>)}</tr></thead>
          <tbody className="divide-y divide-gray-200">{filtered.map(r=>(
            <tr key={r.id} className="hover:bg-gray-50"><td className="px-4 py-4 text-sm font-medium text-gray-900">{r.product?.name??'-'}</td><td className="px-4 py-4 text-sm text-gray-600">{r.warehouse?.name??'-'}</td><td className="px-4 py-4"><span className="px-2.5 py-0.5 rounded-full text-xs font-medium">{r.movementType??'-'}</span></td><td className="px-4 py-4 text-sm font-semibold text-gray-900">{r.quantity??0}</td><td className="px-4 py-4 text-sm text-gray-600">{r.referenceDocument??'-'}</td><td className="px-4 py-4 text-sm text-gray-600">{r.movementDate??'-'}</td><td className="px-4 py-4 text-sm"><button onClick={()=>setSelected(r)} className="text-blue-600 hover:text-blue-800">Lihat</button></td></tr>
          ))}</tbody></table>)}
      </div>
      <Modal open={!!selected} onClose={()=>setSelected(null)} title="Detail Pergerakan Stok" size="md" footer={<ModalBtn onClick={()=>setSelected(null)}>Tutup</ModalBtn>}>{selected&&<div><DetailRow label="Produk" value={selected.product?.name??'-'}/><DetailRow label="Gudang" value={selected.warehouse?.name??'-'}/><DetailRow label="Jenis" value={selected.movementType??'-'}/><DetailRow label="Qty" value={String(selected.quantity??0)}/><DetailRow label="Ref. Dokumen" value={selected.referenceDocument??'-'}/><DetailRow label="Tanggal" value={selected.movementDate??'-'}/></div>}</Modal>
    </div>
  );
}
