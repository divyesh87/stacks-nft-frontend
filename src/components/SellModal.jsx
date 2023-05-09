import React, { useContext, useEffect, useRef, useState } from 'react'
import { Typography, Button } from '@material-ui/core'
import { Form, Modal } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import { WalletContext } from './Wallet';


function SellModal({ nft, showModal, handleModal }) {
    const [price, setprice] = useState(0)
    const { activeAcc } = useContext(WalletContext)

    useEffect(() => {

       
    }, [])


    async function sellNFT() {
 
    }

    async function listonMarket() {
    
    }

    async function approveMarketContract() {
  
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
                        <Form.Control type='number' required value={price} onChange={(e) => setprice(e.target.value)} placeholder="PRICE IN $BNB" />
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