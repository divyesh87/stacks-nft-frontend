import React, { useContext, useEffect, useState } from 'react'
import styles from "../styles/MyTokens.module.css"
import { Box, Typography } from '@material-ui/core'
import NFTCard from "../components/NFTCard"
import { WalletContext } from '../components/Wallet'
import { openContractCall } from "@stacks/connect"
import config from "../stx/config.json"
import { uintCV } from '@stacks/transactions'

function MyTokens() {

  const [nftMetadatas, setnftMetadatas] = useState([])
  const { activeAcc } = useContext(WalletContext)

  useEffect(() => {
    const options = {
      contractAddress: config.nftContract.address,
      contractName: config.nftContract.name,
      functionName: 'get-token-uri',
      functionArgs: [uintCV(1)],
      appDetails: {
        name: 'My App',
        icon: window.location.origin + '/my-app-logo.svg',
      },
      onFinish: data => {
        console.log('Stacks Transaction:', data.stacksTransaction);
        console.log('Transaction ID:', data.txId);
        console.log('Raw transaction:', data.txRaw);
      },
    }


  }, [])




  return (
    <>
      <Box className={styles.pageContainer}>
        <div className={styles.tokensContainer}>
          <Typography align="center" variant='h4' style={{ color: "white" }}>
            Found {nftMetadatas.length} Tokens
            <hr />
          </Typography>
          <div className={styles.tokenDisplay}>
            {nftMetadatas.map((nft, key) => {
              return <NFTCard nft={nft} key={key} />
            })}
          </div>
        </div>
      </Box>
    </>
  )
}

export default MyTokens