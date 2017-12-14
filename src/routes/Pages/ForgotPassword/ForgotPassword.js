import React from 'react';
import { Link } from 'react-router';

import {
    Row,
    Col,
    Panel,
    Button,
    Form,
    FormGroup,
    FormControl,
    Alert
} from 'components';

import { RoutedComponent, connect } from 'routes/routedComponent';
import { CONTENT_VIEW_FLUID } from 'layouts/DefaultLayout/modules/layout';

import classes from './../Pages.scss';

import logo from 'static/envel-logo-inverted.png';
import NotificationSystem from 'react-notification-system';
import { toastr } from '../../../utils/toastr';
class ForgotPassword extends RoutedComponent {
    constructor(props) {
        super(props);
        this.state = {
            userInput: {
                email: ''
            },
            errors: {},
            message: 'Please check your email address to reset your password',
            showAlert: false
        };
        this.onTextChange = this.onTextChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }
    onTextChange(event) {
        let userInput = Object.assign({}, this.state.userInput);
        userInput[event.target.name] = event.target.value;
        this.setState({ userInput });
        console.log(this.state.userInput);
    }
    forgotPassword() {
        return fetch(`http://artlertestingapi.azurewebsites.net/api/Users/ResetPassword?email=${this.state.userInput.email}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: this.state.userInput.email
            })
        })
            .then((response) => {
                if (response.status == 400) {
                    this.clearFields();
                    toastr('Email not found', 'error', this.refs.notificationSystem);
                }
                else {
                    this.clearFields();
                    this.setState({ showAlert: true });
                    toastr('Please check your email address to reset your password', 'success', this.refs.notificationSystem);
                }
            })
            .catch(error => {
                this.clearFields();
                toastr('Email not found', 'error', this.refs.notificationSystem);
                console.error(error);
            });
    }
    clearFields() {
        this.setState({
            userInput: {
                email: ''
            },
            errors: {}
        });
    }
    handleValidation() {
        let userInput = this.state.userInput;
        let errors = this.state.errors;
        errors["email"] = "";
        let formIsValid = true;
        //Email
        if (!userInput.email) {
            formIsValid = false;
            errors["email"] = "Email cannot be empty";
        }
        this.setState({ errors: errors });
        return formIsValid;
    }
    onSubmit() {
        if (this.handleValidation()) {
            this.forgotPassword();
        } else {
            toastr('Please fill all fields properly', 'error', this.refs.notificationSystem);
        }
    }
    getLayoutOptions() {
        return {
            contentView: CONTENT_VIEW_FLUID,
            sidebarEnabled: false,
            navbarEnabled: false,
            footerEnabled: false,
            headerEnabled: false
        }
    }

    render() {
        return (
            <Row>
                <br /><br />
                <Col lg={12}>
                    <Row>
                        <Col className={classes.centerCol} md={6}>
                            <Panel
                                header={(
                                    <Link to='/' className={classes.toHomeLink}>
                                        <img src={logo} width='155px' height='30px' alt='Back to Home' />
                                    </Link>
                                )}
                                footer={(
                                    <div>
                                        <Link to='/user/login'>
                                            Login
                                        </Link>
                                        <Link to='/user/register' className='pull-right'>
                                            Register
                                        </Link>
                                    </div>
                                )}
                            >
                                <h2 className={classes.panelHeader}>
                                    Forgot Password
                                </h2>
                                <p className='text-center m-b-3'>
                                    We can help you reset your password using a user name or email address associated with your account.
                                </p>
                                {this.state.showAlert && (
                                    <Alert bsStyle='success' onDismiss={() => this.setState({ showAlert: false })}>{this.state.message}</Alert>
                                )}
                                <Form>
                                    <FormGroup>
                                        <div className={this.state.errors.email ? "form-group has-error has-feedback" : "form-group "}>
                                            <FormControl type='email' name='email' placeholder='Enter your Email...' onChange={this.onTextChange} value={this.state.userInput.email} />
                                        </div>
                                        <span className="label label-danger">{this.state.errors.email}</span>

                                    </FormGroup>
                                    <NotificationSystem ref="notificationSystem" />
                                    <Button block bsStyle='primary' className='m-b-2' onClick={this.onSubmit}>
                                        Reset Your Password
                                    </Button>
                                </Form>
                            </Panel>
                            <p className='text-center text-gray-light'>
                                <strong>
                                    <span className='text-gray-light'> © 2017 Copyright Artler Capital, Inc.</span>
                                </strong>
                            </p>
                        </Col>
                    </Row>
                </Col>
            </Row>
        );
    }
}

export default connect()(ForgotPassword);
