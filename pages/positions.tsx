import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import React, { useContext, useEffect } from 'react'
import { API_KEY } from '../lib/constants'

import Navbar from '../components/common/Navbar'

import '../styles/Home.module.css'
import PositionContext, { PositionsProvder } from '../components/position/PositionsContext'
import OptionTrader from '../components/position/OptionTrader'
import Button from '@mui/material/Button';

type HomeProps = {
  positions: any
}






const Home: NextPage<HomeProps> = ({ positions }) => {

  const [activeKey, setActiveKey] = React.useState(null);
  return (
    <div className={""}>
      <Head>
        <title>Option Trader</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />

      <div>
        <PositionsProvder initialValue={positions}>
          <OptionTrader></OptionTrader>
        </PositionsProvder>
      </div>


      <footer className={"footer"}>
        <a
          href="#"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={"logo"}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}

export async function getServerSideProps({ req }) {

  let token = req.cookies.accessToken

  console.log(`token ${API_KEY}:${token}`);
  let res = await fetch('https://api.kite.trade/portfolio/positions', {
    headers: {
      "X-Kite-Version": "3",
      "Authorization": `token ${API_KEY}:${token}`
    }
  })
  let out = await res.json()

  if (out.status == 'error') {
    return {
      redirect: {
        destination: '/api/login',
        permanent: false,
      }
    }
  }

  console.log(3, out);


  return {
    props: {
      positions: out
    }, // will be passed to the page component as props
  }
}

export default Home
