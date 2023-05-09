import React, { useState, useEffect, useContext } from 'react'
import styles from "../styles/Home.module.css"
import stxLogo from "../assets/images/stacksLogo.png"
import ListedNFT from "../components/ListedNFT"
import { Box, Typography } from '@material-ui/core'
import { WalletContext } from '../components/Wallet'



function Home() {
  const [nftMetadatas, setnftMetadatas] = useState([])
  const {activeAcc} = useContext(WalletContext)

  useEffect(() => {
    async function loadAndFetchNFTS() {
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