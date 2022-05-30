import { API_KEY } from "../../lib/constants";


export default function handler(req,res) {
  
  let host = req.headers.host;
  
  res.writeHead(301, { Location: `https://kite.zerodha.com/connect/login?v=3&api_key=${API_KEY}&redirect_params=host=${host}`})
  res.end()
}
   