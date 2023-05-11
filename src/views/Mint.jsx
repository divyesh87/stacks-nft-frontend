import React, { useContext, useEffect, useState } from 'react'
import { Box, Button, Typography } from '@material-ui/core'
import styles from "../styles/Mint.module.css"
import DisplayNFT from "../components/DisplayNFT"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { WalletContext } from '../components/Wallet'
import Select from "react-select"
import UploadWidget from '../components/UploadWidget'
import { pinFileToIPFS } from "../helpers/mintEssentials.js"
import { toastInfo, toastSuccess, toastError } from "../helpers/Toast"
import { openContractCall } from "@stacks/connect"
import { standardPrincipalCV, stringAsciiCV } from "@stacks/transactions";
import config from "../stx/config.json"

const OPTIONS = [
  { value: "img", label: "Standard Image Metadata" },
  { value: "vid", label: "Video metadata for playable NFTs" }
]


function Mint() {

  const [imgBytes, setImgBytes] = useState(null)
  const [selectedFile, setselectedFile] = useState(null)
  const { activeAcc } = useContext(WalletContext)
  const [mintType, setmintType] = useState(null)
  const [videoNFTMetadata, setvideoNFTMetadata] = useState({
    uploaded: false,
    url: null
  })


  useEffect(() => {

    async function loadContract() {

    }
    loadContract()

  }, [])

  useEffect(() => {
    if (videoNFTMetadata.uploaded) {
      toastInfo('Video Upload success! Go ahead and click the mint button to mint!')
    }
  }, [videoNFTMetadata])


  function handleFile(e) {
    try {
      const file = e.target.files[0];
      if (file.type.startsWith("image/")) {
        setselectedFile(file)
        setmintType("img");
        const reader = new FileReader();

        reader.addEventListener("load", () => {
          setImgBytes(reader.result)
        })
        reader.readAsDataURL(file)
      }
      else return toastError("Unsupported file")
    } catch (e) {
      alert("somthing went wrong")
    }
  }

  async function mint(hash) {
    if (!hash) return;

    const options = {
      contractAddress: config.nftContract.address,
      contractName: config.nftContract.name,
      functionName: "mint",
      functionArgs: [standardPrincipalCV(activeAcc), stringAsciiCV(hash)],
      appDetails: {
        name: "Ignitus-NFT-Market",
        icon: window.location.origin + "/favicon.ico"
      },
      onFinish: data => {
        console.log(data);
        toastSuccess("Transaction sent for execution!")
      }
    }

    await openContractCall(options);
  }

  async function proceedToMint(e) {
    e.preventDefault();
    if (!activeAcc) return toastError("Please connect your wallet to mint")
    if (mintType === "img") {
      const hash = await pinFileToIPFS(selectedFile)
      mint(`https://gateway.pinata.cloud/ipfs/${hash}`)
    }
    else if (mintType === "vid") {
      const id = getVideoId()
      mint(id)
    }
    else {
      toastError("Invalid Mint type")
    }
  }

  function getVideoId() {
    if (!videoNFTMetadata.uploaded) {
      return toastError("Please upload a video first")
    };
    let uniqueId = videoNFTMetadata.url
    return uniqueId
  }

  return (
    <>
      <Box className={styles.mintPageContainer}>
        <div>
          <Typography variant='h4' style={{ color: "white" }}>
            Create Your Own Digital Legacy with our NFT Minting Service
          </Typography>
          <Typography variant='subtitle1' style={{ color: "white" }}>
            All of your NFT files, including metadata and assets, are stored on the decentralized Pinata IPFS network. This means that your NFTs are safe from censorship and single points of failure.
          </Typography>
          <hr style={{ color: "white" }} />
        </div>
        {mintType === null && <label htmlFor="type">
          <Typography variant='h6' style={{ color: "white" }}>
            Select the type of Metadata to be associated with your NFT
          </Typography>
        </label>}
        <Select id="type" onChange={(e) => setmintType(e.value)} options={OPTIONS} />
        {mintType === "img" && <div className={styles.ImgMintContainer}>
          <div>
            <DisplayNFT owner="test" type={mintType} file={imgBytes ? imgBytes : null} />
          </div>

          <div className={styles.mintControls}>
            <input onChange={(e) => handleFile(e)} style={{ color: "white", backgroundColor: "black", border: "2px solid white", }} type="file" />
            <Button onClick={proceedToMint} className={styles.mintBtn} variant='outlined' style={{ color: "white", background: "black", border: "1px solid white" }} >
              Mint
            </Button>
          </div>
        </div>
        }
        {mintType === "vid" &&
          <div className={styles.vidMintContainer}>
            <UploadWidget setNftDetails={setvideoNFTMetadata} nftDetails={videoNFTMetadata} />
            <Button onClick={proceedToMint} className={styles.mintBtn} variant='outlined' style={{ color: "white", background: "black", border: "1px solid white" }} >
              Mint
            </Button>
          </div>
        }
        <ToastContainer />
      </Box>
    </>
  )
}

export default Mint