import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";
import { getRefToken, deleteToken } from '../components/manage-tokens';
import { gql, useMutation } from '@apollo/client';
import { Button, Modal } from 'react-bootstrap';


const Logout: React.FC = () => {
    let navigate = useNavigate();
    const [showLogout, setShowLogout] = useState<boolean>(false);
    
    const closeLogout = () => setShowLogout(false);
    const openLogout = () => setShowLogout(true);

    const ref_token = getRefToken();

    const REVOKE_TOKEN_MUTATION = gql`
    mutation {
      revokeToken (refreshToken: "${ref_token}") {
        revoked
      }
    }`

    const [revokeToken] = useMutation(REVOKE_TOKEN_MUTATION);
    
    const onLogout = (async () => {
        await revokeToken({ variables: { ref_token } });
        deleteToken();
        navigate("/");
    })

    return (
        <div className="p-3 text-right">
            <Button variant="primary" onClick={openLogout}>
                Logout
            </Button>
            <Modal show={showLogout} onHide={closeLogout} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm log out</Modal.Title>
                </Modal.Header>
                <Modal.Body>Exit system?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeLogout}>
                        No
                    </Button>
                    <Button variant="danger" onClick={onLogout}>
                        Yes
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default Logout
