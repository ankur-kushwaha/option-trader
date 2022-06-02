import '../styles/normalize.css'
// import '../styles/skeleton.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/globals.css'

import type { AppProps } from 'next/app'
import { UserProvider } from '../components/common/UserContext';


function MyApp({ Component, pageProps }: AppProps) {
  return <UserProvider><Component {...pageProps} /></UserProvider>
}

export default MyApp
