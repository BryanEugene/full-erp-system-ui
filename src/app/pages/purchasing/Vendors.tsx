import { useState, useEffect } from 'react';
import { Truck, Plus, Search, Filter } from 'lucide-react';
import vendorService, { type Vendor } from '@/services/vendorService';
import { Modal, FormField, DetailRow, ModalBtn, inputCls, selectCls } from '@/app/components/ui/Modal';

const statusColor: Record<string,string> = { ACTIVE:'bg-green-100 text-green-800', INACTIVE:'bg-gray-100 text-gray-800' };
const blank = () => ({ companyName:'', contactName:'', email:'', phone:'', address:'', city:'', country:'', status:'ACTIVE' });

export function Vendors() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<'view'|'new'|'edit'|'delete'|null>(null);
  const [selected, setSelected] = useState<Vendor|null>(null);
  const [form, setForm] = useState(blank());

  const load = () => { setLoading(true); vendorService.getAll({ size:200 }).then(p=>setVendors(p.content)).catch(console.error).finally(()=>setLoading(false)); };
  useEffect(() => { load(); }, []);
  const filtered = vendors.filter(v => (v.companyName??'').toLowerCase().includes(search.toLowerCase()) || (v.contactName??'').toLowerCase().includes(search.toLowerCase()));
  const close = () => { setModal(null); setSelected(null); setForm(blank()); };
  const handleNew = () => { vendorService.create(form).then(()=>{load();close();}).catch(console.error); };
  const handleEdit = () => { if (!selected) return; vendorService.update(selected.id, form).then(()=>{load();close();}).catch(console.error); };
  const handleDelete = () => { if (!selected) return; vendorService.delete(selected.id).then(()=>{load();close();}).catch(console.error); };
  const openEdit = (v: Vendor) => { setSelected(v); setForm({ companyName:v.companyName, contactName:v.contactName??'', email:v.email??'', phone:v.phone??'', address:v.address??'', city:v.city??'', country:v.country??'', status:v.status??'ACTIVE' }); setModal('edit'); };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div><h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3"><Truck className="w-8 h-8 text-blue-600" /> Pemasok</h1><p className="text-gray-500 mt-1">Kelola data pemasok / vendor</p></div>
        <button onClick={()=>setModal('new')} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"><Plus className="w-5 h-5" /> Pemasok Baru</button>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex gap-4"><div className="flex-1 relative"><Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Cari pemasok..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" /></div><button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"><Filter className="w-5 h-5" /> Filter</button></div>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? <div className="p-8 text-center text-gray-400">Memuat data...</div> : (
        <table className="w-full"><thead className="bg-gray-50 border-b border-gray-200"><tr>{['Perusahaan','Kontak','Email','Telepon','Kota','Status','Aksi'].map(h=><th key={h} className="text-left px-4 py-3 text-sm font-semibold text-gray-900">{h}</th>)}</tr></thead>
          <tbody className="divide-y divide-gray-200">{filtered.map(v=>(
            <tr key={v.id} className="hover:bg-gray-50">
              <td className="px-4 py-4 text-sm font-medium text-gray-900">{v.companyName}</td>
              <td className="px-4 py-4 text-sm text-gray-600">{v.contactName??'-'}</td>
              <td className="px-4 py-4 text-sm text-gray-600">{v.email??'-'}</td>
              <td className="px-4 py-4 text-sm text-gray-600">{v.phone??'-'}</td>
              <td className="px-4 py-4 text-sm text-gray-600">{v.city??'-'}</td>
              <td className="px-4 py-4"><span className="px-2.5 py-0.5 rounded-full text-xs font-medium">{v.status}</span></td>
              <td className="px-4 py-4 text-sm"><div className="flex gap-2"><button onClick={()=>{setSelected(v);setModal('view');}} className="text-blue-600 hover:text-blue-800">Lihat</button><button onClick={()=>openEdit(v)} className="text-yellow-600 hover:text-yellow-800">Edit</button><button onClick={()=>{setSelected(v);setModal('delete');}} className="text-red-600 hover:text-red-800">Hapus</button></div></td>
            </tr>
          ))}
          </tbody>
        </table>
        )}
      </div>
      <Modal open={modal==='view'} onClose={close} title="Detail Pemasok" size="md" footer={<ModalBtn onClick={close}>Tutup</ModalBtn>}>
        {selected&&<div><DetailRow label="Perusahaan" value={selected.companyName}/><DetailRow label="Kontak" value={selected.contactName??'-'}/><DetailRow label="Email" value={selected.email??'-'}/><DetailRow label="Telepon" value={selected.phone??'-'}/><DetailRow label="Kota" value={selected.city??'-'}/><DetailRow label="Status" value={<span className="px-2.5 py-0.5 rounded-full text-xs font-medium">{selected.status}</span>}/></div>}
      </Modal>
      {[{m:'new',title:'Pemasok Baru'},{m:'edit',title:'Edit Pemasok'}].map(({m,title})=>(
        <Modal key={m} open={modal===m} onClose={close} title={title} size="lg" footer={<><ModalBtn onClick={close}>Batal</ModalBtn><ModalBtn variant="primary" onClick={m==='new'?handleNew:handleEdit}>Simpan</ModalBtn></>}>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Nama Perusahaan" required><input value={form.companyName} onChange={e=>setForm(f=>({...f,companyName:e.target.value}))} className={inputCls} /></FormField>
            <FormField label="Nama Kontak"><input value={form.contactName} onChange={e=>setForm(f=>({...f,contactName:e.target.value}))} className={inputCls} /></FormField>
            <FormField label="Email"><input type="email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} className={inputCls} /></FormField>
            <FormField label="Telepon"><input value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))} className={inputCls} /></FormField>
            <FormField label="Kota"><input value={form.city} onChange={e=>setForm(f=>({...f,city:e.target.value}))} className={inputCls} /></FormField>
            <FormField label="Negara"><input value={form.country} onChange={e=>setForm(f=>({...f,country:e.target.value}))} className={inputCls} /></FormField>
            <FormField label="Status"><select value={form.status} onChange={e=>setForm(f=>({...f,status:e.target.value}))} className={selectCls}><option value="ACTIVE">Aktif</option><option value="INACTIVE">Nonaktif</option></select></FormField>
          </div>
        </Modal>
      ))}
      <Modal open={modal==='delete'} onClose={close} title="Hapus Pemasok" size="sm" footer={<><ModalBtn onClick={close}>Batal</ModalBtn><ModalBtn variant="danger" onClick={handleDelete}>Hapus</ModalBtn></>}>
        <p className="text-gray-600">Yakin ingin menghapus pemasok <strong>{selected?.companyName}</strong>?</p>
      </Modal>
    </div>
  );
}
