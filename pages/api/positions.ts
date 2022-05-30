import { API_KEY } from "../../lib/constants";



export default async function handler(req,res) {
    let token = req.cookies.accessToken
    let apiResponse = await fetch('https://api.kite.trade/portfolio/positions', {
      headers: {
        "X-Kite-Version": "3",
        "Authorization": `token ${API_KEY}:${token}`
      }
    })
    let out = await apiResponse.json()
    res.status(200).json(out)
}
   