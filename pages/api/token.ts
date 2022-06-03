import { API_KEY, CHECKSUM } from "../../lib/constants";
import shajs from 'sha.js'

import { serialize } from 'cookie';
import { NextApiRequest } from "next";

async function generateSession(token) {
    // console.log(token, checksum);

    const body = {
        'api_key': API_KEY,
        'request_token': token,
        'checksum': shajs('sha256').update(`${API_KEY}${token}60960qn0cpdca5m4o5lymxpj05xz0hcl`).digest('hex')
    }
    
    var formBody: string[] = [];
    for (var property in body) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(body[property]);
        formBody.push(encodedKey + "=" + encodedValue);
    }

    const response = await fetch('https://api.kite.trade/session/token', {
        method: 'POST',
        body: formBody.join("&"),
        headers: {
            'X-Kite-version': "3",
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
    });

    const data = await response.json();
    // console.log(2,data);
    return data.data;

}

export default async function handler(req:NextApiRequest, res) {

    let host = req.headers.host;
    let isLocalhost = req.query.host;

    if (host != isLocalhost) {
        res.writeHead(301, { Location: `http://localhost:3000/api/token?request_token=${req.query.access_token}` })
        res.end();
        return;
    }

    if (req.query.request_token) {
        let requestToken = req.query.request_token
        let response = await generateSession(requestToken);
        let accessToken = response.access_token;
        res.setHeader('Set-Cookie', serialize('accessToken', accessToken, { path: '/' }));
        res.writeHead(301, { Location: '/' })
        res.end()
    }

}
