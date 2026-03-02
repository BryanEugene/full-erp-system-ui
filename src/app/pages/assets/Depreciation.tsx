import { useState, useEffect } from 'react';
import { TrendingDown, Search } from 'lucide-react';
import assetService, { type AssetDepreciation } from '@/services/assetService';
import { Modal, DetailRow, ModalBtn } from '@/app/components/ui/Modal';
const fmt = (n?: number) => n != null ? 'Rp ' + Number(n).toLocaleString('id-ID') : '-';
export function Depreciation() {
  const [records, setRecords] = useState<AssetDepreciation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<AssetDepreciation|null>(null);
  const load = () => { setLoading(true); assetService.getDepreciation({ size:100 }).then(p=>setRecords(p.content??p as any)).catch(console.error).finally(()=>setLoading(false)); };
  useEffect(() => { load(); }, []);
  const filtered = records.filter(r => (r.asset?.name??'').toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="p-6">
      <div className="mb-6"><h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3"><TrendingDown className="w-8 h-8 text-blue-600" /> Depresiasi Aset</h1><p className="text-gray-500 mt-1">Pantau nilai depresiasi aset</p></div>
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6"><div className="flex-1 relative max-w-md"><Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Cari aset..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" /></div></div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? <div className="p-8 text-center text-gray-400">Memuat data...</div> : (<table className="w-full"><thead className="bg-gray-50 border-b border-gray-200"><tr>{['Aset','Metode','Tarif (%)','Nilai Buku','Akm. Depresiasi','Aksi'].map(h=><th key={h} className="text-left px-4 py-3 text-sm font-semibold text-gray-900">{h}</th>)}</tr></thead>
          <tbody className="divide-y divide-gray-200">{filtered.map(r=>(
            <tr key={r.id} className="hover:bg-gray-50"><td className="px-4 py-4 text-sm font-medium text-gray-900">{r.asset?.name??'-'}</td><td className="px-4 py-4 text-sm text-gray-600">{r.method??'-'}</td><td className="px-4 py-4 text-sm text-gray-600">{r.rate??0}%</td><td className="px-4 py-4 text-sm font-semibold text-gray-900">{fmt(r.bookValue)}</td><td className="px-4 py-4 text-sm font-semibold text-red-600">{fmt(r.accumulatedDepreciation)}</td><td className="px-4 py-4 text-sm"><button onClick={()=>setSelected(r)} className="text-blue-600 hover:text-blue-800">Lihat</button></td></tr>
          ))}</tbody></table>)}
      </div>
      <Modal open={!!selected} onClose={()=>setSelected(null)} title="Detail Depresiasi" size="md" footer={<ModalBtn onClick={()=>setSelected(null)}>Tutup</ModalBtn>}>{selected&&<div><DetailRow label="Aset" value={selected.asset?.name??'-'}/><DetailRow label="Metode" value={selected.method??'-'}/><DetailRow label="Tarif" value={`${selected.rate??0}%`}/><DetailRow label="Nilai Buku" value={fmt(selected.bookValue)}/><DetailRow label="Akm. Depresiasi" value={fmt(selected.accumulatedDepreciation)}/></div>}</Modal>
    </div>
  );
}
