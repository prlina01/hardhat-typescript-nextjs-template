import type { NextPage } from 'next'
import {useWeb3React} from "@web3-react/core";
import {InjectedConnector} from '@web3-react/injected-connector'
import GreeterContract from "../artifacts/contracts/Greeter.sol/Greeter.json"
import {ethers} from "ethers";
import {Greeter, Greeter__factory} from "../typechain";
import { useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import Link from 'next/link'



// @ts-ignore
const injected = new InjectedConnector()
const Home: NextPage = () => {
  const {account, deactivate, activate, active, library: provider} = useWeb3React()
  const [greetingMsg, setGreetingMsg] = useState<string>("")
  const [hasMetamask, setHasMetamask] = useState<boolean>(false)


  async function connect() {
    try {
      await activate(injected)
      localStorage.setItem('isWalletConnected', 'true')
    } catch(e) {
      console.log(e)
    }
  }

  async function disconnect() {
    try {
      await deactivate()
      localStorage.setItem('isWalletConnected', 'false')
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    const connectWalletOnPageLoad = async() => {
      if(localStorage?.getItem('isWalletConnected') === 'true') {
        try {
          await activate(injected)
          localStorage.setItem('isWalletConnected', 'true')
        } catch (e) {
          console.log(e)
        }
      }
    }
    if(hasMetamask) connectWalletOnPageLoad()
    // @ts-ignore
    else if (typeof window.ethereum !== "undefined") setHasMetamask(true);

  }, [])

  function _getContract() {
    const signer = provider.getSigner()


    const contractAddress = "0x745f3C80e6c63b21b633bFc56ecB129826937Ca0"
    const abi = GreeterContract.abi
    const contract = Greeter__factory.connect(contractAddress, signer)
    return contract
  }


  async function execute(entered_greet: { [greet: string]: string; }) {
    if(active) {
      const greet = entered_greet['greetInputField']
      const contract = _getContract()
      // const contract = new ethers.Contract(contractAddress, abi, signer)
      try {
        await contract.setGreeting(greet)
        setGreetingMsg(greet)
      } catch (e) {
        console.log(e)
      }

    }
  }

  const {reset, register, handleSubmit, formState} = useForm()

  useEffect(() => {
    reset({
      greetInputField: ''
    })
  }, [reset, formState.isSubmitSuccessful])

  useEffect(() => {
    const initialGreeting = async () => {
      const contract = _getContract()
      const msg = await contract.greet()
      setGreetingMsg(msg)
    }
    active && initialGreeting()
  }, [active])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      {hasMetamask ? (
        active ? (
          <>
            <span>Connected with <b>{account}</b></span>
            <span>Greeter: <b>{greetingMsg}</b></span>
            <form onSubmit={handleSubmit(execute)}>
              <label>Change greeting:</label>
              <input {...register("greetInputField", {required: true})} className="border-2 m-2" />
              <input type="submit" value="submit" className="py-2 px-2 rounded-2xl mt-20 mb-4 text-lg font-bold text-white  bg-blue-600 hover:bg-blue-800"/>
            </form>
            <Link href="state">
              <button className="py-2 px-2 rounded-2xl mt-20 mb-4 text-lg font-bold text-white  bg-blue-600 hover:bg-blue-800">
                Go to state page[metamask account stays logged in when changing pages]
              </button>
            </Link>

            <b>Rinkeby testnet</b>
            <button onClick={() => disconnect()} className="py-2 px-2 rounded-2xl mt-20 mb-4 text-lg font-bold text-white bg-blue-600 hover:bg-blue-800">
              Log out from account
            </button>
          </>
      ) : (
          <button onClick={() => connect() } className="py-2 px-2 rounded-2xl mt-20 mb-4 text-lg font-bold text-white  bg-blue-600 hover:bg-blue-800">
            Connect
          </button>
      )): (
          <>
            <h1>You don't have metamask installed in your browser</h1>
            <button className="py-2 px-2 rounded-2xl mt-20 mb-4 text-lg font-bold text-white bg-blue-600 hover:bg-blue-800">
              <a href="https://metamask.io/download/">Install</a>
            </button>
          </>
      )
      }
    </div>
  )
}

export default Home
