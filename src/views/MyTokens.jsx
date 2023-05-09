import React, { useContext, useEffect, useState } from 'react'
import styles from "../styles/MyTokens.module.css"
import { Box, Typography } from '@material-ui/core'
import NFTCard from "../components/NFTCard"
import { WalletContext } from '../components/Wallet'


function MyTokens() {

  const [nftMetadatas, setnftMetadatas] = useState([])
  const { activeAcc } = useContext(WalletContext)

  useEffect(() => {
  }, [])

  useEffect(() => {
    async function loadFromTokenContract() {
    }
    loadFromTokenContract()
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
            {nftMetadatas.map((nft , key)=> {
              return <NFTCard nft={nft} key={key}/>
            })}
          </div>
        </div>
      </Box>
    </>
  )
}

export default MyTokens