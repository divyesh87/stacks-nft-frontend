import React, { useContext, useEffect, useState } from 'react'
import styles from "../styles/MyTokens.module.css"
import { Box, Typography } from '@material-ui/core'
import NFTCard from "../components/NFTCard"
import { WalletContext } from '../components/Wallet'
import { StacksTestnet } from "@stacks/network"
import axios from 'axios'
import { callReadOnlyFunction, uintCV } from '@stacks/transactions'

function MyTokens() {

  const [nftMetadatas, setnftMetadatas] = useState([])
  const { activeAcc } = useContext(WalletContext)

  useEffect(() => {

    async function fetchNFTs() {
      if (!activeAcc) return

      const { data } = await axios.get(`https://api.testnet.hiro.so/extended/v1/tokens/nft/holdings?principal=${activeAcc}`)

      const metadatas = data.results.map(async (nft) => {
        const contractAddress = nft.asset_identifier.split("::")[0].split(".")[0]
        const contractName = nft.asset_identifier.split("::")[0].split(".")[1]
        const tokenId = parseInt(nft.value.repr.split("u")[1]);
        const options = {
          contractAddress,
          contractName,
          functionName: "get-token-uri",
          functionArgs: [uintCV(tokenId)],
          network: new StacksTestnet(),
          senderAddress: activeAcc
        }

        const { value } = await callReadOnlyFunction(options)
        const nftObj = {
          token_uri: value.value.data,
          symbol: "NFT",
          token_id: tokenId,
          contractAddress : contractAddress + "." + contractName
        }
        return nftObj

      })

      const settledPromises = await Promise.allSettled(metadatas);
      const resolvedPromises = settledPromises.filter(
        (promise) => promise.status === 'fulfilled'
      );
      const results = resolvedPromises.map((promise) => promise.value);
      setnftMetadatas(results)
    }

    fetchNFTs()
  }, [activeAcc])


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