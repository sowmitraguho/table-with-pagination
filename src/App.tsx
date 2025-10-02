import './App.css'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputSwitch } from 'primereact/inputswitch';
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
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rowClick, setRowClick] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState(null);

  useEffect(() => {
    axios.get("https://api.artic.edu/api/v1/artworks?page=1")
      .then(res => {
        console.log(res.data);
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
      {loading ? <p>Loading...</p> : <div className='container mx-auto p-12'>
        <div className="flex justify-content-center align-items-center mb-4 gap-2">
                <InputSwitch inputId="input-rowclick" checked={rowClick} onChange={(e) => setRowClick(e.value)} />
                <label htmlFor="input-rowclick">Row Click</label>
            </div>
        <h1>Table with Pagination</h1>
        <DataTable value={products} size={'normal'} showGridlines selectionMode={rowClick ? null : 'checkbox'} selection={selectedProducts} onSelectionChange={(e) => setSelectedProducts(e.value)}  tableStyle={{ minWidth: '50rem' }}>
          <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
          <Column field="title" header="Title"></Column>
          <Column field="place_of_origin" header="Place of Origin"></Column>
          <Column field="artist_display" header="Artist"></Column>
          <Column field="inscription" header="Inscription"></Column>
          <Column field="date_start" header="Start Date"></Column>
          <Column field="date_end" header="End Date"></Column>
        </DataTable>
      </div>}
    </>
  )
}

export default App
