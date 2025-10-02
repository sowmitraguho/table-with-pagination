import './App.css'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
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
  const [selectedProducts, setSelectedProducts] = useState<products[] | null>(null);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(0);



  const template = {
    
    layout: 'PrevPageLink PageLinks NextPageLink CurrentPageReport',
    PrevPageLink: (options: any) => {
      
      const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        //console.log("Previous page clicked");
        handlePageChange({ page: currentPage - 2 });
      };
      return (
        <button type="button" className='p-paginator-prev p-paginator-element p-link' onClick={handleClick} disabled={currentPage===1}>
          <span className="mx-1">Previous</span>
        </button>
      );
    },
    NextPageLink: (options: any) => {
      //console.log(options);
      const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
       // console.log("Next page clicked");
        handlePageChange({ page: currentPage });
      };
      return (
        <button type="button" className={options.className} onClick={handleClick} disabled={options.disabled}>
          <span className="mx-1">Next</span>
        </button>
      );
    },
    PageLinks: (options: any) => {

      if ((options.view.startPage === options.page && options.view.startPage !== 0) || (options.view.endPage === options.page && options.page + 1 !== options.totalPages)) {
        const className = `${options.className} p-disabled`;
       // console.log(options);
        return (
          <span className={className} style={{ userSelect: 'none' }}>
            ...
          </span>
        );
      }

      return (
        <button type="button" className={options.className} onClick={options.onClick}>
          {options.page + 1}
        </button>
      );
    }
  }


  const handlePageChange = (event: { first: number; rows: number; page: number; pageCount: number }) => {
    setLoading(true);
    axios.get(`https://api.artic.edu/api/v1/artworks?page=${event.page + 1}`)
      .then(res => {
        setTotalRecords(res.data.pagination.total);
        setProducts(res.data.data);
        setCurrentPage(event.page + 1);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }


  useEffect(() => {
    axios.get("https://api.artic.edu/api/v1/artworks?page=1")
      .then(res => {
        console.log(res.data.pagination.total);
        setTotalRecords(res.data.pagination.total);
        setTotalPage(res.data.pagination.total_pages);
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
        <h1 className='my-4'>Table with Pagination</h1>


        <DataTable
          loading={loading}
          value={products}
          size={'normal'}
          showGridlines
          selectionMode='checkbox'
          selection={selectedProducts}
          onSelectionChange={(e) => setSelectedProducts(e.value)}
          tableStyle={{ minWidth: '50rem' }}
          paginator
          lazy
          totalRecords={totalRecords}
          rows={12}
          onPage={(e) => { handlePageChange(e) }}
          paginatorTemplate={template}
          currentPageReportTemplate={`Showing ${currentPage} of ${totalPage} pages`}
        >
          <Column selectionMode="multiple" style={{ width: '5%' }}></Column>
          <Column field="title" header="Title" style={{ width: '15%' }}></Column>
          <Column field="place_of_origin" header="Place of Origin" style={{ width: '15%' }}></Column>
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
