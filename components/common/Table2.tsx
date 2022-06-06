import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import React, { MouseEvent, PropsWithChildren, ReactElement, ReactNode, useContext, useEffect } from 'react'

type TableProps<T> = {  
  data:T[],
  children?:ReactElement<ColumnProps<T>>[],
  title?:string
}

type ColumnProps<T=any>={
  changeSortOrder?:(selector:string)=>(event:MouseEvent)=>void,
  item?:any,
  children?:(arg0: T)=>ReactElement,
  name?:string,
  selector:any,
  onClick?:(event: MouseEvent)=>void,
  setColumn?:any
}

type TableContextProps={
  data:any,
  setColumn?:(prps:ColumnProps)=>void
}

let TableContext = React.createContext<TableContextProps>({
  data:[]
});

// export default function XTable<T>({children,data}:TableProps<T>){
//   const [columns,setColumns] = React.useState<{[key:string]:ColumnProps}>({}); 
  
//   function setColumn(props){
//     console.log({props});
    
//       setColumns(pre=>{
//         return {...pre,
//         [props.selector]:props
//         }
//       })
//     }
  

//   console.log({data,columns});
  
//   const childrenWithProps = React.Children.map(children, child => {
//     // Checking isValidElement is the safe way and avoids a typescript
//     // error too.
//     if (React.isValidElement(child)) {
//       //@ts-ignore
//       return React.cloneElement(child, { setColumn });
//     }
//     return child;
//   });

//   return (<>
//     {/* <TableContext.Provider value={{data,setColumn}}> */}
//       <>
//       {childrenWithProps}
//       <TableContainer component={Paper}>
//       <Table sx={{ minWidth: 650 }} aria-label="simple table">
//         <TableHead>
//           <TableRow>
//             {Object.values(columns).map((col,i)=>{
//               return (<TableCell key={i}>{col.selector}</TableCell>)
//             })}
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {data.map((row,j) => (
//             <TableRow
//               key={j}
//               sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
//             >
//               {Object.values(columns).map((col,i)=>{
//               return (
//               <TableCell key={i}>{col.children?col.children(row):row[col.selector]}</TableCell>
//               )
//             })}
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </TableContainer>
//     </>
//   {/* </TableContext.Provider> */}
//   </>
//   )
// }

// export function Column<T>(props:ColumnProps<T>){
//   // let {data,setColumn} = useContext(TableContext)
//   useEffect(()=>{
//     props.setColumn && props.setColumn(props)
//   },[]);

//   return (
//    <></>
//   )
// }


export function Column<T>({changeSortOrder,item}:ColumnProps<T>){
  return <th onClick={changeSortOrder && changeSortOrder(item?.selector)} key={item.name}>{item.name}</th>
}



export default function TableX<T>({data,children=[],title=""}:TableProps<T>){
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
          //@ts-ignore
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


