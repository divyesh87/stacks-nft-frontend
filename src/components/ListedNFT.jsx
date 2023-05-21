import { Box, Button, Typography } from '@material-ui/core'
import React, { useContext, useEffect, useState, useRef } from 'react'
import styles from "../styles/Card.module.css"
import stxLogo from "../assets/images/stacksLogo.png"
import { WalletContext } from './Wallet'
import config from "../stx/config.json"
import { AnchorMode, callReadOnlyFunction, contractPrincipalCV, createAddress, PostConditionMode, uintCV } from '@stacks/transactions'
import { StacksTestnet } from "@stacks/network"
import { openContractCall, openSTXTransfer } from '@stacks/connect'


function ListedNFT({ nft }) {
    const [metadataType, setmetadataType] = useState(null)
    const videoRef = useRef(null)
    const [TxSuccess, setTxSuccess] = useState(false)
    const [nftMetadata, setnftMetadata] = useState({
        price: nft.price / 10 ** 6,
        seller: nft.seller,
        src: null,
        listingId: nft.listingId
    })

    const { activeAcc } = useContext(WalletContext)


    useEffect(() => {
        setnftMetadata({ ...nftMetadata, seller: nft.seller, price: nft.price / 10 ** 6 })
        async function loadAndFetch() {
            async function fetchNFTImg() {
                const options = {
                    contractAddress: config.nftContract.address,
                    contractName: config.nftContract.name,
                    functionName: "get-token-uri",
                    functionArgs: [uintCV(nft.tokenId)],
                    network: new StacksTestnet(),
                    senderAddress: activeAcc
                }
                const { value } = await callReadOnlyFunction(options)
                const src = value.value.data;
                if (src.startsWith("https://res.cloudinary.com")) {
                    setmetadataType("video")
                }
                setnftMetadata({ ...nftMetadata, src: value.value.data })
            }
            await fetchNFTImg()
        }
        loadAndFetch()
    }, [])

    async function buyNFT() {
        const options = {
            contractAddress: config.marketContract.address,
            contractName: config.marketContract.name,
            functionName: "fulfil-listing-stx",
            functionArgs: [uintCV(nft.listingId), contractPrincipalCV(config.nftContract.address, config.nftContract.name)],
            postConditionMode: PostConditionMode.Allow,
            appDetails: {
                name: "Ignitus-NFT-Market",
                icon: window.location.origin + "/favicon.ico"
            },
            onFinish: data => {
                console.log(data);
            }
        }

        await openContractCall(options);
    }

    async function playNFT() {
        openSTXTransfer({
            network : new StacksTestnet(),
            anchorMode : AnchorMode.Any,
            recipient : nft.seller,
            amount : 1e6,
            postConditionMode : PostConditionMode.Allow,
            onFinish : () => {
                setTxSuccess(true)
            }
        })
    }

    return (
        <Box className={styles.cardContainer}>
            <div className={styles.nftImage}>
                {metadataType == "video"
                    ?
                    <video ref={videoRef} style={{ height: "30vh", width: "25vw" }} controls={TxSuccess} loop>
                        <source src={nftMetadata.src} />
                    </video>
                    :
                    <img style={{ height: "30vh" }} src={nftMetadata.src} />
                }
            </div>
            <div>
                <Typography style={{ color: "white", display: "flex", alignItems: "center" }} variant='subtitle1'>
                    ASK : {nftMetadata.price}
                    <img style={{ height: "1.75rem", borderRadius: "50%" }} src={stxLogo} />
                </Typography>
            </div>
            <div>
                <Typography style={{ color: "white", marginTop: "0.2rem" }} variant="subtitle1">
                    SELLER : {nftMetadata.seller.slice(0, 4)}...{nftMetadata.seller.slice(nftMetadata.seller.length - 3, nftMetadata.seller.length)}
                </Typography>
            </div>
            <div>
                {metadataType == "video" &&
                    <Button onClick={playNFT} variant='outlined' style={{ color: "white", border: "0.1rem solid white", width: "100%", marginTop: "0.4rem" }}>
                        Play
                    </Button>
                }
            </div>
            <Button onClick={buyNFT} variant='outlined' style={{ color: "white", border: "0.1rem solid white", width: "100%", marginTop: "0.4rem", alignSelf: "flex-end" }}>
                Buy
            </Button>
        </Box>
    )
}

export default ListedNFT