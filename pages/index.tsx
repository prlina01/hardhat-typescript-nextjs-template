import type { NextPage } from 'next'
import GreeterContract from "../artifacts/contracts/Greeter.sol/Greeter.json"
import {ethers} from "ethers";
import {Greeter, Greeter__factory} from "../typechain";
import {useEffect, useRef, useState} from "react";
import {useForm} from "react-hook-form";
import Web3Modal from "web3modal";




const Home: NextPage = () => {
  const [greetingMsg, setGreetingMsg] = useState<string>("")
  const [walletConnected, setWalletConnected] = useState(false);
  const web3ModalRef = useRef<Web3Modal>();


  // function _getContract() {
  //   const signer = provider.getSigner()
  //
  //
  //   const contractAddress = "0x745f3C80e6c63b21b633bFc56ecB129826937Ca0"
  //   const abi = GreeterContract.abi
  //   const contract = Greeter__factory.connect(contractAddress, signer)
  //   return contract
  // }
  // async function execute(entered_greet: { [greet: string]: string; }) {
  //   if(active) {
  //     const greet = entered_greet['greetInputField']
  //     const contract = _getContract()
  //     // const contract = new ethers.Contract(contractAddress, abi, signer)
  //     try {
  //       await contract.setGreeting(greet)
  //       setGreetingMsg(greet)
  //     } catch (e) {
  //       console.log(e)
  //     }
  //
  //   }
  // }

  const {reset, register, handleSubmit, formState} = useForm()

  useEffect(() => {
    reset({
      greetInputField: ''
    })
  }, [reset, formState.isSubmitSuccessful])

  const getProviderOrSigner = async (needSigner = false) => {
    const provider = web3ModalRef.current && await web3ModalRef.current.connect();
    const web3Provider = new ethers.providers.Web3Provider(provider);

    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 4) {
      window.alert("Change the network to Rinkeby");
      throw new Error("Change network to Rinkeby");
    }

    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }
    return web3Provider;
  };

  useEffect(() => {
    // if wallet is not connected, create a new instance of Web3Modal and connect the MetaMask wallet
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: "rinkeby",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      void connectWallet();
    }
  }, [walletConnected]);

  const connectWallet = async () => {
      try {
        // Get the provider from web3Modal, which in our case is MetaMask
        // When used for the first time, it prompts the user to connect their wallet
        await getProviderOrSigner();
        setWalletConnected(true);
      } catch (err) {
        console.error(err);
      }
    };


  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <h1>Ide gas</h1>
      {/*{hasMetamask ? (*/}
      {/*    walletConnected ? (*/}
      {/*    <>*/}
      {/*      <span>Connected with <b>{account}</b></span>*/}
      {/*      <span>Greeter: <b>{greetingMsg}</b></span>*/}
      {/*      <form onSubmit={handleSubmit(execute)}>*/}
      {/*        <label>Change greeting:</label>*/}
      {/*        <input {...register("greetInputField", {required: true})} className="border-2 m-2" />*/}
      {/*        <input type="submit" value="submit" className="py-2 px-2 rounded-2xl mt-20 mb-4 text-lg font-bold text-white  bg-blue-600 hover:bg-blue-800"/>*/}
      {/*      </form>*/}
      {/*      <Link href="state">*/}
      {/*        <button className="py-2 px-2 rounded-2xl mt-20 mb-4 text-lg font-bold text-white  bg-blue-600 hover:bg-blue-800">*/}
      {/*          Go to state page[metamask account stays logged in when changing pages]*/}
      {/*        </button>*/}
      {/*      </Link>*/}

      {/*      <b>Rinkeby testnet</b>*/}
      {/*      <button onClick={() => disconnect()} className="py-2 px-2 rounded-2xl mt-20 mb-4 text-lg font-bold text-white bg-blue-600 hover:bg-blue-800">*/}
      {/*        Log out from account*/}
      {/*      </button>*/}
      {/*    </>*/}
      {/*) : (*/}
      {/*    <button onClick={() => connect() } className="py-2 px-2 rounded-2xl mt-20 mb-4 text-lg font-bold text-white  bg-blue-600 hover:bg-blue-800">*/}
      {/*      Connect*/}
      {/*    </button>*/}
      {/*)): (*/}
      {/*    <>*/}
      {/*      <h1>You don't have metamask installed in your browser</h1>*/}
      {/*      <button className="py-2 px-2 rounded-2xl mt-20 mb-4 text-lg font-bold text-white bg-blue-600 hover:bg-blue-800">*/}
      {/*        <a href="https://metamask.io/download/">Install</a>*/}
      {/*      </button>*/}
      {/*    </>*/}
      {/*)*/}
      {/*}*/}
    </div>
  )
}

export default Home
