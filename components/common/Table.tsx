import React, { MouseEvent, ReactElement, ReactNode } from 'react'

type TableProps<T> = {  
  data:T[],
  children?:ReactElement|ReactElement<ColumnProps<T>>[],
  title?:string
}

type ColumnProps<T=any>={
  changeSortOrder?:(selector:string)=>(event:MouseEvent)=>void,
  item?:any,
  children?:(arg0: T)=>ReactElement,
  name?:string,
  selector:keyof T,
  onClick?:(event: MouseEvent)=>void
}

export function Column<T>({changeSortOrder,item}:ColumnProps<T>){
  return <th onClick={changeSortOrder && changeSortOrder(item?.selector)} key={item.name}>{item.name}</th>
}



export default function Table<T>({data,children=[],title=""}:TableProps<T>){
  let [sortOrder,setSortOrder ] = React.useState({
    key:"test",
    order:true
  })

  const changeSortOrder = (key)=>()=>{
    setSortOrder({
      key,
      order:!sortOrder.order
    }) 
  }

  data = data
    .map(item=>{
      for(let key in item){
        if(typeof item[key] == 'number'){
          item[key] = Number(item[key]).toFixed(2)
        }
      }
      return item;
    });

  if(sortOrder.key && sortOrder.key != null){
    data = data.sort((a,b)=>{
      if(isNaN(Number(a[sortOrder.key]))){
        if(sortOrder.order){
          return (a[sortOrder.key])<(b[sortOrder.key])?1:-1
        }else{
          return (b[sortOrder.key])>(a[sortOrder.key])?-1:1
        }
      }else{
        if(sortOrder.order){
          return Number(a[sortOrder.key])-Number(b[sortOrder.key])>0?1:-1
        }else{
          return Number(a[sortOrder.key])-Number(b[sortOrder.key])>0?-1:1
        }
      }
      
    });
  }
  

  return (
    <div className="table-container">
      <h3 className="title is-5">{title}</h3>

      <table width={"100%"} className="table">
        <thead>
          <tr>
          {children && children.map((item,i)=><th onClick={changeSortOrder(item.props.selector)} key={i}>{item.props.name||item.props.selector}</th>)}
          </tr>
        </thead>
        <tbody>
          {data.map((item,i)=>
            <tr key={i}>
              {children && children.map((cell,j)=><td key={j}>
                {cell.props.children ?cell.props.children(item) : item[cell.props.selector]}
              </td>)}
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

