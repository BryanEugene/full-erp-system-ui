import { useState, useEffect } from 'react';
import { Package, Plus, Search, Filter } from 'lucide-react';
import productService, { type Product } from '@/services/productService';
import { Modal, FormField, DetailRow, ModalBtn, inputCls, selectCls } from '@/app/components/ui/Modal';
const fmt = (n?: number) => n != null ? 'Rp ' + Number(n).toLocaleString('id-ID') : '-';
const statusColor: Record<string,string> = { ACTIVE:'bg-green-100 text-green-800', INACTIVE:'bg-gray-100 text-gray-800', DISCONTINUED:'bg-red-100 text-red-800' };
const blank = () => ({ productCode:'', name:'', category:'', unitOfMeasure:'PCS', price:0, status:'ACTIVE', description:'' });
export function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<'view'|'new'|'delete'|null>(null);
  const [selected, setSelected] = useState<Product|null>(null);
  const [form, setForm] = useState(blank());
  const load = () => { setLoading(true); productService.getAll({ size:200 }).then(p=>setProducts(p.content)).catch(console.error).finally(()=>setLoading(false)); };
  useEffect(() => { load(); }, []);
  const filtered = products.filter(p => (p.productCode??'').toLowerCase().includes(search.toLowerCase()) || (p.name??'').toLowerCase().includes(search.toLowerCase()));
  const close = () => { setModal(null); setSelected(null); setForm(blank()); };
  const handleNew = () => { productService.create(form).then(()=>{load();close();}).catch(console.error); };
  const handleDelete = () => { if (!selected) return; productService.delete(selected.id).then(()=>{load();close();}).catch(console.error); };
  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div><h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3"><Package className="w-8 h-8 text-blue-600" /> Produk</h1><p className="text-gray-500 mt-1">Kelola data produk dan stok</p></div>
        <button onClick={()=>setModal('new')} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"><Plus className="w-5 h-5" /> Produk Baru</button>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6"><div className="flex gap-4"><div className="flex-1 relative"><Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Cari produk..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" /></div><button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"><Filter className="w-5 h-5" /> Filter</button></div></div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? <div className="p-8 text-center text-gray-400">Memuat data...</div> : (<table className="w-full"><thead className="bg-gray-50 border-b border-gray-200"><tr>{['Kode','Nama','Kategori','Satuan','Harga','Status','Aksi'].map(h=><th key={h} className="text-left px-4 py-3 text-sm font-semibold text-gray-900">{h}</th>)}</tr></thead>
          <tbody className="divide-y divide-gray-200">{filtered.map(p=>(
            <tr key={p.id} className="hover:bg-gray-50"><td className="px-4 py-4 text-sm font-medium text-gray-900">{p.productCode??'-'}</td><td className="px-4 py-4 text-sm text-gray-900">{p.name??'-'}</td><td className="px-4 py-4 text-sm text-gray-600">{p.category??'-'}</td><td className="px-4 py-4 text-sm text-gray-600">{p.unitOfMeasure??'-'}</td><td className="px-4 py-4 text-sm font-semibold text-gray-900">{fmt(p.price)}</td><td className="px-4 py-4"><span className="px-2.5 py-0.5 rounded-full text-xs font-medium">{p.status??'-'}</span></td><td className="px-4 py-4 text-sm"><div className="flex gap-2"><button onClick={()=>{setSelected(p);setModal('view');}} className="text-blue-600 hover:text-blue-800">Lihat</button><button onClick={()=>{setSelected(p);setModal('delete');}} className="text-red-600 hover:text-red-800">Hapus</button></div></td></tr>
          ))}</tbody></table>)}
      </div>
      <Modal open={modal==='view'} onClose={close} title="Detail Produk" size="md" footer={<ModalBtn onClick={close}>Tutup</ModalBtn>}>{selected&&<div><DetailRow label="Kode" value={selected.productCode??'-'}/><DetailRow label="Nama" value={selected.name??'-'}/><DetailRow label="Kategori" value={selected.category??'-'}/><DetailRow label="Satuan" value={selected.unitOfMeasure??'-'}/><DetailRow label="Harga" value={fmt(selected.price)}/><DetailRow label="Status" value={selected.status??'-'}/></div>}</Modal>
      <Modal open={modal==='new'} onClose={close} title="Produk Baru" size="md" footer={<><ModalBtn onClick={close}>Batal</ModalBtn><ModalBtn variant="primary" onClick={handleNew}>Simpan</ModalBtn></>}><div className="grid grid-cols-2 gap-4"><FormField label="Kode Produk" required><input value={form.productCode} onChange={e=>setForm(f=>({...f,productCode:e.target.value}))} className={inputCls} /></FormField><FormField label="Nama Produk" required><input value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} className={inputCls} /></FormField><FormField label="Kategori"><input value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))} className={inputCls} /></FormField><FormField label="Satuan"><input value={form.unitOfMeasure} onChange={e=>setForm(f=>({...f,unitOfMeasure:e.target.value}))} className={inputCls} /></FormField><FormField label="Harga"><input type="number" value={form.price||''} onChange={e=>setForm(f=>({...f,price:Number(e.target.value)}))} className={inputCls} /></FormField><FormField label="Status"><select value={form.status} onChange={e=>setForm(f=>({...f,status:e.target.value}))} className={selectCls}><option value="ACTIVE">Aktif</option><option value="INACTIVE">Tidak Aktif</option></select></FormField></div></Modal>
      <Modal open={modal==='delete'} onClose={close} title="Hapus Produk" size="sm" footer={<><ModalBtn onClick={close}>Batal</ModalBtn><ModalBtn variant="danger" onClick={handleDelete}>Hapus</ModalBtn></>}><p className="text-gray-600">Yakin hapus produk <strong>{selected?.name}</strong>?</p></Modal>
    </div>
  );
}
