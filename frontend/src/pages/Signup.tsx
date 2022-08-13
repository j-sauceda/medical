import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { Link, useNavigate } from "react-router-dom";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";

import Alert from 'react-bootstrap/Alert';

const REGISTER_MUTATION = gql`
	mutation register($username: String!, $email: String!, $password1: String!, $password2: String!) {
	register (
		username: $username
        	email: $email
		password1: $password1
	        password2: $password2
	) {
        	success
	        errors
	}
}`

interface RegisterValues {
    username: string;
    email: string;
    password1: string;
    password2: string;
}

interface ErrMsg {
    message: string;
    code: string;
}

const Signup: React.FC = () => {
    let navigate = useNavigate();
    const [register] = useMutation(REGISTER_MUTATION);
    const [msg, setMsg] = useState<string[]>([]);
    const [viewMsg, setViewMsg] = useState<boolean>(false);

    const initialValues: RegisterValues = {
        username: "",
        email: "",
        password1: "",
        password2: ""
    }

    const validationSchema = Yup.object({
        username: Yup.string().max(20, "Username must be 20 characters or less").required("Username required"),
        email: Yup.string().email("Invalid email").required("Email Required"),
        password1: Yup.string().max(20, "Password must be 20 characters or less").required("Password required"),
        password2: Yup.string().oneOf([Yup.ref("password1")], "Passwords do not match")
    })

    return (
        <div className="p-3 text-center">
            <h3>Create a new account</h3>
            <br />
            {
                msg === [] ? (<div></div>) : (
                    <div className="mb-3">
                        <Alert variant="danger" 
                            show={viewMsg}
                            onClose={() => {
                                setViewMsg(false);
                                setMsg([]);
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
                    const response = await register({ variables: values });
                    if (response.data.register.success === true) {
                        setSubmitting(false);
                        navigate("/login");
                    }
                    else {
                        if (response.data.register.errors.password2 !== null){
                            response.data.register.errors.password2.map((err: ErrMsg) => {
                                setMsg([...msg, err.message])
                                return <div></div>
                            })
                        }
                        // console.log(msg);
                        setViewMsg(true);
                    }
                }}
            >
                <Form>
                    <div className="mb-3">
                        <span>Username:&nbsp;</span>
                        <Field name="username" type="text" placeholder="Create a username" />
                    </div>
                    <div className="mb-3">
                        <span>Email:&nbsp;</span>
                        <Field name="email" type="text" placeholder="Enter your email" />
                    </div>
                    <div className="mb-3">
                        <span>Password:&nbsp;</span>
                        <Field name="password1" type="password" placeholder="Create a password" />
                    </div>
                    <div className="mb-3">
                        <span>Confirm your password:&nbsp;</span>
                        <Field name="password2" type="password" placeholder="Confirm your password" />
                    </div>
                    <div className="mb-3">
                        <button type="submit" className="btn btn-primary">
                            <span>Register</span>
                        </button>
                    </div>

                    <ErrorMessage name="username" className="alert alert-warning" component={"div"} />
                    <ErrorMessage name="email" className="alert alert-warning" component={"div"} />
                    <ErrorMessage name="password1" className="alert alert-warning" component={"div"} />
                    <ErrorMessage name="password2" className="alert alert-warning" component={"div"} />
                </Form>
            </Formik>

            <div className="p-3">
                <h4>Already registered?</h4>
                <Link to="/login">Log in</Link>
                <br /><br />
                <h4>Resend activation email?</h4>
                <Link to="/resend">Resend email</Link><br />
            </div>
        </div>
    )
}

export default Signup;
