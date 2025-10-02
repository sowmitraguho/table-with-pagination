import './App.css'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputSwitch } from 'primereact/inputswitch';
import { Button } from 'primereact/button';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface products {
  id: number;
  title: string;
  place_of_origin: string;
  artist_display: string;
  inscription: string | null;
  date_start: number;
  date_end: number;
}


function App() {
  const [products, setProducts] = useState<products[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [rowClick, setRowClick] = useState<boolean>(true);
  const [selectedProducts, setSelectedProducts] = useState<products[] | null>(null);
  const [totalRecords, setTotalRecords] = useState<number>(0);

  const paginatorLeft = <Button type="button" icon="pi pi-refresh" text />;
  const paginatorRight = <Button type="button" icon="pi pi-download" text />;

  useEffect(() => {
    axios.get("https://api.artic.edu/api/v1/artworks?page=1")
      .then(res => {
        console.log(res.data.pagination.total);
        setTotalRecords(res.data.pagination.total);
        setProducts(res.data.data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    console.log(selectedProducts);
  }, [selectedProducts]);

  return (
    <>
       <div className='container mx-auto p-12'>
        <div className="flex justify-content-center align-items-center mb-4 gap-2">
          <InputSwitch inputId="input-rowclick" checked={rowClick} onChange={(e) => setRowClick(e.value)} />
          <label htmlFor="input-rowclick">Row Click</label>
        </div>
        <h1 className='my-4'>Table with Pagination</h1>
        <DataTable 
        loading={loading}
        value={products} 
        size={'normal'} 
        showGridlines 
        selectionMode={rowClick ? null : 'checkbox'} 
        selection={selectedProducts} 
        onSelectionChange={(e) => setSelectedProducts(e.value)} 
        tableStyle={{ minWidth: '50rem' }} 
        paginator 
         
        totalRecords={totalRecords}
        rows={12}
        
        >
          <Column selectionMode="multiple" style={{ width: '5%' }}></Column>
          <Column field="title" header="Title" style={{ width: '15%' }}></Column>
          <Column field="place_of_origin" header="Place of Origin" style={{ width: '5%' }}></Column>
          <Column field="artist_display" header="Artist" style={{ width: '15%' }}></Column>
          <Column field="inscription" header="Inscription" style={{ width: '20%' }}></Column>
          <Column field="date_start" header="Start Date" style={{ width: '10%' }}></Column>
          <Column field="date_end" header="End Date" style={{ width: '10%' }}></Column>
        </DataTable>
      </div>
    </>
  )
}

export default App
