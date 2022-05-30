// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../lib/dbConnect'
import Instrument from '../../models/instrument'


type Data = {
  name: any
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  await dbConnect();
  let data = await Instrument.find({name:"ADANIENT"})
  res.status(200).json({name:data})
}