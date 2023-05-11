import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "../views/Home"
import Mint from "../views/Mint"
import MyTokens from "../views/MyTokens"
import Header from "./Header"
import { WalletContext } from "./Wallet"
import { useEffect, useState } from "react"
import { toastError, toastInfo } from "../helpers/Toast"
import { ToastContainer } from "react-toastify"
import {
  AppConfig,
  UserSession,
  AuthDetails,
  showConnect,
} from "@stacks/connect";


function App() {

  const [activeAcc, setactiveAcc] = useState(null)

  const appConfig = new AppConfig(["store_write"]);
  const userSession = new UserSession({ appConfig });

  const appDetails = {
    name: "Ignitus NFT market",
    icon: window.location.origin + "/favicon.ico"
  }

  useEffect(() => {
    if (userSession.isUserSignedIn()) {
      const acc = userSession.loadUserData().profile.stxAddress.testnet
      setactiveAcc(acc)
    }

  }, [])


  async function connect() {
    showConnect({
      appDetails,
      onFinish: (data) => handleAccountChange(data),
      userSession,
      onCancel: () => toastError("Rejected wallet connect request!")
    })
  }

  async function handleAccountChange(payload) {
    try {
      const acc = payload?.authResponsePayload?.profile?.stxAddress?.testnet
      setactiveAcc(acc)
    } catch (e) {
      toastError("Failed to connect")
    }
  }

  async function disconnect(){
    userSession.signUserOut()
    setactiveAcc(null)
  }


  return (
    <>
      <BrowserRouter>
        <WalletContext.Provider value={{ activeAcc, connect, disconnect }}>
          <Header />
          <Routes>
            <Route path="/" Component={Home} />
            <Route path="/mint" Component={Mint} />
            <Route path="/mytokens" Component={MyTokens} />
          </Routes>
        </WalletContext.Provider>
        <ToastContainer />
      </BrowserRouter>
    </>

  );
}

export default App;
