import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { Link, useNavigate } from "react-router-dom";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { saveToken, saveRefToken } from "../components/manage-tokens";

import Alert from 'react-bootstrap/Alert';

const LOGIN_MUTATION = gql`
	mutation login($username: String!, $password: String!) {
	tokenAuth (
		username: $username
		password: $password
	) {
		token
		refreshToken
	}
}`

interface LoginValues {
    username: string
    password: string
}

const Login: React.FC = () => {
    let navigate = useNavigate();
    const [login] = useMutation(LOGIN_MUTATION);
    const [msg, setMsg] = useState<string>("");
    const [viewMsg, setViewMsg] = useState<boolean>(false);

    const initialValues: LoginValues = {
        username: "",
        password: ""
    }

    const validationSchema = Yup.object({
        username: Yup.string().max(20, "Username must be 20 characters or less").required("Username required"),
        password: Yup.string().max(20, "Password must be 20 characters or less").required("Password required")
    })

    return (
        <div className="p-3 text-center">
            <h3>Log in</h3>
            <br />
            {
                msg === "" ? (<div></div>) : (
                    <div className="mb-3">
                        <Alert variant="danger" show={viewMsg} onClose={() => setViewMsg(false)} dismissible>
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
                    const response = await login({ variables: values });
                    if (response.data.tokenAuth.token != null && response.data.tokenAuth.refreshToken != null) {
                        saveToken(response.data.tokenAuth.token);
                        saveRefToken(response.data.tokenAuth.refreshToken);
                        setSubmitting(false);
                        navigate("/user");
                    }
                    else {
                        setMsg("Please, activate your account, check your credentials and try again");
                        setViewMsg(true);
                    }
                }}
            >
                <Form>
                    <div className="mb-3">
                        <span>Username:&nbsp;</span>
                        <Field name="username" type="text" placeholder="Enter your username" />
                    </div>
                    <div className="mb-3">
                        <span>Password:&nbsp;</span>
                        <Field name="password" type="password" placeholder="Enter your password" />
                    </div>
                    <div className="mb-3">
                        <button type="submit" className="btn btn-primary">
                            <span>Log in</span>
                        </button>
                    </div>
                    
                    <ErrorMessage name="username" className="alert alert-warning" component={"div"} />
                    <ErrorMessage name="password" className="alert alert-warning" component={"div"} />
                </Form>
            </Formik>
            
            <div className="p-3">
                <h4>Not registered yet?</h4>
                <Link to="/signup">Register</Link>
                <br /><br />
                <h4>Resend activation email?</h4>
                <Link to="/resend">Resend email</Link>
            </div>
        </div>
    )
}

export default Login;
