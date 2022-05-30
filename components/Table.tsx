import React, { MouseEvent } from 'react'

type ColumnProps={
  changeSortOrder?:(selector:string)=>(event:MouseEvent)=>void,
  item?:any,
  children?:any,
  selector:string,
  onClick?:(event: MouseEvent)=>void
}

function Column({changeSortOrder,item}:ColumnProps){
  return <th onClick={changeSortOrder && changeSortOrder(item.selector)} key={item.name}>{item.name}</th>
}

export {
  Column
}

type TableProps = {
  columns?:any,
  data:any,
  children?:any,
  title?:any
}

export default function Table({columns,data,children=[],title=""}:TableProps){
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
          item[key] = item[key].toFixed(2)
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
          <tr>{
            columns && columns.map(item=><th onClick={changeSortOrder(item.selector)} key={item.name}>{item.name}</th>)
          }
          {children && children.map((item,i)=><th onClick={changeSortOrder(item.props.selector)} key={i}>{item.props.name||item.props.selector}</th>)}
          </tr>
        </thead>
        <tbody>
          {data.map((item,i)=>
            <tr key={i}>
              {columns && columns.map((cell,j)=>
                <td key={j}>
                  {cell.cell?<cell.cell {...item}/>:
                    item[cell.selector]}
                </td>)}

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

