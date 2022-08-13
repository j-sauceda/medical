import React, { useState } from 'react'
import { Link, Navigate, useParams } from "react-router-dom"
import { gql, useMutation } from "@apollo/client";

import Alert from 'react-bootstrap/Alert';
import { Button } from 'react-bootstrap';

const Activation:React.FC = () => {
    const params = useParams();
    if (params.token == null)
        < Navigate to = "/" />
    const token = params.token;

    const VERIFICATION_MUTATION = gql`
	mutation verifyAccount($token: String!) {
        verifyAccount (token: $token) {
            success
            errors
        }
    }`

    const [verifyAccount, { loading, error, data }] = useMutation(VERIFICATION_MUTATION, {
        variables: { token }
    });
    const [viewMsg, setViewMsg] = useState<boolean>(false);

    if (loading) return <div className="mb-3"><h2> Submitting, please wait... </h2></div>
    if (error) 
        return (
            <div className="mb-3">
                <Alert variant="danger"
                    show={viewMsg}
                    onClose={() => { setViewMsg(false); }}
                    dismissible
                >
                    <Alert.Heading> Attention! </Alert.Heading>
                    { <p> err.message </p> }
                </Alert>
            </div>
        )
    
    if (!data) {
        return (
            <div className='p-3 text-center'>
                <Button variant="primary" onClick={async () => {
                    await verifyAccount({ variables: { token } });
                    setViewMsg(true);
                }}>
                    Verify your account
                </Button>
            </div>
        )
    }
    
    return (
        <div className="p-3 text-center">
            {data.verifyAccount.success ? (
                <div>
                    <Alert variant="success" show={viewMsg} >
                        User account activated
                    </Alert>
                    <br />
                    <Link to="/login"> Log in </Link>
                </div>
            ) : (
                <div>
                    <Alert variant="danger" show={viewMsg} >
                        Expired or invalid email link
                    </Alert>
                    <br />
                    <Link to="/resend"> Resend activation email </Link>
                </div>
            )}
        </div>
    )
}

export default Activation;
