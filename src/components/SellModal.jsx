import React, { useContext, useEffect, useRef, useState } from 'react'
import { Typography, Button } from '@material-ui/core'
import { Form, Modal } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import { WalletContext } from './Wallet';
import { bufferCVFromString, contractPrincipalCV, createAssetInfo, makeStandardNonFungiblePostCondition, NonFungibleConditionCode, principalCV, standardPrincipalCV, tupleCV, uintCV, PostConditionMode } from '@stacks/transactions';
import config from "../stx/config.json"
import { openContractCall } from '@stacks/connect';


function SellModal({ nft, showModal, handleModal }) {
    const [price, setprice] = useState(0)
    const { activeAcc } = useContext(WalletContext)

    const contractAddress = nft.contractAddress.split(".")[0]
    const contractName = nft.contractAddress.split(".")[1];

    console.log(nft);
    async function sellNFT() {

        const options = {
            contractAddress: config.marketContract.address,
            contractName: config.marketContract.name,
            functionName: "list-asset",
            functionArgs: [contractPrincipalCV(contractAddress, contractName), tupleCV({
                "token-id": uintCV(nft.token_id),
                "price": uintCV(price * 10**6)
            })],
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

    return (
        <div>
            <Modal show={showModal} onHide={handleModal}>
                <Modal.Header style={{ background: "rgba(0, 0, 0, 0.85)" }} closeButton closeVariant='white'>
                    <Modal.Title>
                        <Typography style={{ color: "white" }}>
                            Sell your NFT
                        </Typography>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ backgroundColor: "rgba(0, 0, 0, 0.85)" }}>
                    <Form.Group>
                        <Form.Control type='number' required value={price} onChange={(e) => setprice(e.target.value)} placeholder="PRICE IN $STX" />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer style={{ background: "rgba(0, 0, 0, 0.85)" }}>
                    <Button onClick={sellNFT} variant='outlined' style={{ color: "white", border: "1px solid white" }} >
                        Sell
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>


    )
}

export default SellModal