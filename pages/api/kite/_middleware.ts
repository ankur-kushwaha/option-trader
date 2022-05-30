import { NextFetchEvent, NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest, ev: NextFetchEvent) {
    console.log(req.cookies['authorization_token']);
    
    if(!req.cookies['authorization_token']){
        // return res.writeHead(301, { Location: `http://${query.host}?request_token=${request_token}`});
        // req.redirect('http://${query.host}?request_token=${request_token}')
        return new Response("NOT Authorized")
    }

    return NextResponse.next()
}