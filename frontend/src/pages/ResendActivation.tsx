import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { Link } from "react-router-dom";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";

import Alert from 'react-bootstrap/Alert';

const RESEND_ACTIVATION_MUTATION = gql`
	mutation resendActivationEmail($email: String!) {
        resendActivationEmail (
            email: $email
        ) {
            errors
        }
    }`

interface EmailValue {
    email: string
}

const ResendActivation:React.FC = () => {
    const [resendActivationEmail, { data }] = useMutation(RESEND_ACTIVATION_MUTATION);
    const [msg, setMsg] = useState<string>("");
    const [viewMsg, setViewMsg] = useState<boolean>(false);
    const [alertVariant, setAlertVariant] = useState("danger")

    const initialValues: EmailValue = {
        email: ""
    }

    const validationSchema = Yup.object({
        email: Yup.string().email("Invalid email address").required("Email Required")
    })

    return (
        <div className="p-3 text-center">
            <h3>Send another user account activation email</h3>
            <br />
            {
                msg.length === 0 ? (<div></div>) : (
                    <div className="mb-3">
                        <Alert variant = { alertVariant }
                            show = { viewMsg }
                            onClose={() => {
                                setViewMsg(false);
                                setMsg("");
                            }}
                            dismissible
                        >
                            <Alert.Heading> Attention! </Alert.Heading>
                            <p> {msg} </p>
                        </Alert>
                        <br />
                    </div>
                )
            }
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={async (values, { setSubmitting }) => {
                    setSubmitting(true)
                    await resendActivationEmail({ variables: values });
                    if (data.resendActivationEmail.errors == null) {
                        setViewMsg(false);
                        setMsg("Please, check your email and follow the link therein");
                        setAlertVariant("success");
                        setViewMsg(true);
                    }
                    else {
                        setMsg(data.resendActivationEmail.errors.toString());
                        console.log(msg);
                        setViewMsg(true);
                    }
                }}
            >
                <Form>
                    <div className="mb-3">
                        <span>Email:&nbsp;</span>
                        <Field name="email" type="text" placeholder="Ingresa tu correo" />
                    </div>
                    <div className="mb-3">
                        <button type="submit" className="btn btn-primary">
                            <span> Send activation email again </span>
                        </button>
                    </div>

                    <ErrorMessage name="email" className="alert alert-warning" component={"div"} />
                </Form>
            </Formik>

            <div className="p-3">
                <h4>Don't remember the email of your account?</h4>
                <Link to="/login">Register</Link>
                <br /><br />
                <h4>Already registered?</h4>
                <Link to="/login">Log in</Link>
            </div>
        </div>
    )
}

export default ResendActivation;
