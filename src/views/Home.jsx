import React, { useState, useEffect, useContext } from 'react'
import styles from "../styles/Home.module.css"
import stxLogo from "../assets/images/stacksLogo.png"
import ListedNFT from "../components/ListedNFT"
import { Box, Typography } from '@material-ui/core'
import { WalletContext } from '../components/Wallet'
import config from "../stx/config.json"
import { callReadOnlyFunction, createAddress ,uintCV } from '@stacks/transactions'
import {StacksTestnet} from "@stacks/network"


function Home() {
  const [nftMetadatas, setnftMetadatas] = useState([])
  const { activeAcc } = useContext(WalletContext)

  useEffect(() => {
    async function loadAndFetchNFTS() {
      let tempMetadata = [];
      for (let i = 0; i < 10; i++) {
        const options = {
          contractAddress: config.marketContract.address,
          contractName: config.marketContract.name,
          functionName: "get-listing",
          functionArgs: [uintCV(i)],
          network: new StacksTestnet(),
          senderAddress: activeAcc
        }
        const { value } = await callReadOnlyFunction(options)
        if(!value) continue;
        const data = value.data;
        console.log(data);
        const nft = {
          price : Number(data.price.value),
          seller : data.maker.address.hash160,
          tokenId : Number(data["token-id"].value),
          listingId : i
        }
        tempMetadata.push(nft);
      }

      setnftMetadatas(tempMetadata)
    }
    loadAndFetchNFTS()
  }, [activeAcc])

  return (
    <>
      <div className={styles.introContainer}>
        <div className={styles.introInfo}>
          <Typography style={{ color: "white", marginBottom: "1rem" }} variant='h3' >
            Experience True Ownership
            <hr style={{ width: "100%" }} />
          </Typography>
          <Typography style={{ color: "white" }} variant="h5">
            Explore, discover and own unique digital assets on our NFT marketplace, where creativity meets blockchain technology. Buy, sell and showcase one-of-a-kind collectibles, art, music and more, securely and transparently. Join the revolution of ownership in the digital age.
          </Typography>
        </div>
        <div className={styles.logoContainer}>
          <img style={{ width: "33vw" }} src={stxLogo} alt="STXLOGO" />
          <Typography style={{ color: "white" }} variant='h6'>
            Powered by Stacks
          </Typography>
        </div>
      </div>
      <Box className={styles.offerings}>
        <div>
          <Typography align='center' style={{ color: "white" }} variant="h4">
            Explore Current Offerings:
            <hr />
          </Typography>
        </div>
        <div className={styles.offeringsDisplay}>
          {nftMetadatas.map((nft, key) => {
            return <ListedNFT nft={nft} key={key} />
          })}
        </div>
      </Box>
    </>

  )
}

export default Home