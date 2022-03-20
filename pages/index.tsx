import type { NextPage } from 'next'
import {useWeb3React} from "@web3-react/core";
import {InjectedConnector} from '@web3-react/injected-connector'
import GreeterContract from "../artifacts/contracts/Greeter.sol/Greeter.json"
import {ethers} from "hardhat";
import {Greeter, Greeter__factory} from "../typechain";
import { useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import Link from 'next/link'



// @ts-ignore
const injected = new InjectedConnector()

const Home: NextPage = () => {
  const {activate, active, library: provider} = useWeb3React()

  const [greetingMsg, setGreetingMsg] = useState<string>()

  async function connect() {
    try {
      await activate(injected)
      localStorage.setItem('isWalletConnected', 'true')
    } catch(e) {
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
    connectWalletOnPageLoad()
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
      {active ? (
          <>
            Greeter: <b>{greetingMsg}</b>

            <form onSubmit={handleSubmit(execute)}>
              <label>Change greeting:</label>
              <input {...register("greetInputField", {required: true})} />
              <input type="submit" value="submit" />
            </form>
            <Link href="state"><button>Go to state page[metamask account stays logged in when changing pages]</button></Link>

            <br/>
            <br/>
            <b>RInkeby testnet</b>
          </>
      ) : (
          <button onClick={() => connect()}>Connect</button>
      )}
    </div>
  )
}

export default Home
