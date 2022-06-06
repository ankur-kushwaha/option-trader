import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import React, { MouseEvent, PropsWithChildren, ReactElement, ReactNode, useContext, useEffect } from 'react'

type TableProps<T> = {
  data: T[],
  children?: ReactElement<ColumnProps<T>>[],
  title?: keyof T
}

interface ColumnProps<T=any>{
  item?: any,
  children?: (item: T) => ReactElement,
  name?: string,
  selector: any,
  onClick?: (event: MouseEvent) => void,
  setColumn?: any
}

export default function XTable<T extends unknown>({ children, data }: TableProps<T>) {

  return (<>
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            {children}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, j) => (
            <TableRow
              key={j}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              {children?.map((item, i) => (
                <TableCell key={i}>{item.props.children ? item.props.children(row) : row[item.props.selector]}</TableCell>
              )
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>

  </>
  )
}

export function Column<T extends unknown>(props: ColumnProps<T>) {

  return (
    <><TableCell>{props.name||props.selector}</TableCell></>
  )
}
