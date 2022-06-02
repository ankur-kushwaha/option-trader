import { API_KEY } from "../../lib/constants";

import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    let {query} = req;
    let token = req.cookies.accessToken
    const searchParams = new URLSearchParams();
    if(Array.isArray(query.instrument)){
      for(let instrument of query.instrument){
        searchParams.append("i",instrument)
      }
    }else{
      searchParams.append("i",query.instrument)
    }

    let apiResponse = await fetch(`https://api.kite.trade/quote?${searchParams.toString()}`, {
      headers: {
        "X-Kite-Version": "3",
        "Authorization": `token ${API_KEY}:${token}`
      }
    })
    
    let out = await apiResponse.json()
    if(out.status!='success'){
      console.log(out)
    }
    res.status(200).json(out)
}
   