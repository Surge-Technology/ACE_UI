import React, { Component, useEffect, useState } from 'react'
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import localeInfo from "rc-pagination/lib/locale/en_US";
 
export default function TablePagination(props) {
  const [data,setData] = useState({ totalDocs:props.totalPages,currentPage:props.currentPage})
  const  onPaginationChange=(data)=>{
    props.callbackfunc(data);
  }
  const  onShowSizeChange=(data)=>{
    console.log("onShowSizeChange",data)
  }
  return (
    <>
    <Pagination
     showTotal={(total, range) =>
      `${range[0]} - ${range[1]} of ${total} items`
      }
       showQuickJumper
    pageSizeOptions={['10', '20', '50', '100']}
    showSizeChanger
    defaultPageSize={props.defaultPageSize}
    defaultCurrent={data.currentPage}
    onShowSizeChange={ onShowSizeChange}
    onChange={onPaginationChange}
    total={data.totalDocs}
    locale={localeInfo}
  />
</>
  )
}
