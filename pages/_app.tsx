import '../styles/globals.css'
import type { AppProps } from 'next/app'
import {ExternalProvider, JsonRpcFetchFunc, Web3Provider} from "@ethersproject/providers";
import {Web3ReactProvider} from "@web3-react/core";

const getLibrary = (provider: ExternalProvider | JsonRpcFetchFunc) => {
  return new Web3Provider(provider)
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
      <Web3ReactProvider getLibrary={getLibrary}>
        <Component {...pageProps} />
      </Web3ReactProvider>
  )
}


export default MyApp
