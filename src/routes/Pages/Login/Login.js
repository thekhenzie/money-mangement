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
    Checkbox
} from 'components';

import { RoutedComponent, connect } from 'routes/routedComponent';
import { CONTENT_VIEW_FLUID } from 'layouts/DefaultLayout/modules/layout';

import classes from './../Pages.scss';

import logo from 'static/envel-logo-inverted.png';

import NotificationSystem from 'react-notification-system';
import { authenticateUser } from '../../../actions/userActions';
import { toastr } from '../../../utils/toastr';
import store from '../../../store/store';
import { isUserLogged } from '../../../auth';
import SecureLS from 'secure-ls';
let ls;
class LoginContainer extends RoutedComponent {
    static contextTypes = {
        router: React.PropTypes.object.isRequired
    }
    constructor(props) {
        super(props);

        this.state = {
            userInput: {
                email: '',
                password: ''
            },
            errors: {},
            isChecked: false
        };
        ls = new SecureLS({ encodingType: 'aes' });
        this.onTextChange = this.onTextChange.bind(this);
        this.authenticateUser = this.authenticateUser.bind(this);
        this.handleValidation = this.handleValidation.bind(this);
        this.onSubmit = this.onSubmit.bind(this);


    }
    componentWillMount() {
        debugger;
        let credentials = ls.get('cred');
        credentials != null ? Object.assign(this.state.userInput, credentials) : null
    }
    onTextChange(event) {
        let userInput = Object.assign({}, this.state.userInput);
        userInput[event.target.name] = event.target.value;
        this.setState({ userInput });
    }
    checkEmail(email) {
        let emailRegex = /\b[\w\.-]+@yopmail\.\w{2,4}\b/;
        return emailRegex.test(email);
    }
    getLayoutOptions() {
        return {
            contentView: CONTENT_VIEW_FLUID,
            sidebarEnabled: false,
            navbarEnabled: false,
            footerEnabled: false,
            headerEnabled: false,
            rightSidebarEnabled: false
        }
    }
    authenticateUser() {
        debugger;
        this.state.isChecked ? ls.set('cred', { email: this.state.userInput.email, password: this.state.userInput.password }) : ls.removeAll()
        return fetch('http://artlertestingapi.azurewebsites.net/api/Users/Authenticate', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                firstName: this.state.userInput.firstName,
                lastName: this.state.userInput.lastName,
                email: this.state.userInput.email,
                password: this.state.userInput.password
            })
        })
            .then((response) => response.json())
            .then((responseJSON) => {
                this.clearFields();
                sessionStorage.setItem('user_cred', JSON.stringify(responseJSON));
                store.loggedUser = responseJSON;
                store.loggedUser.isAdmin = this.checkEmail(responseJSON.email);
                toastr('Login successful', 'success', this.refs.notificationSystem);
                setTimeout(() => {
                    this.context.router.push('/simulator');
                }, 1000);

            })
            .catch(error => {
                toastr('Login failed', 'error', this.refs.notificationSystem);
                console.error(error);
            });
    }
    clearFields() {
        this.setState({
            userInput: {
                email: '',
                password: ''
            },
            errors: {}
        });
    }
    toLogin() {
        this.context.router.push('/simulator');
    }
    handleValidation() {
        let userInput = this.state.userInput;
        let errors = this.state.errors;
        errors["email"] = "";
        errors["password"] = "";
        let formIsValid = true;
        //Email
        if (!userInput.email) {
            formIsValid = false;
            errors["email"] = "Email cannot be empty";
        }
        //Password
        if (!userInput.password) {
            formIsValid = false;
            errors["password"] = "Password cannot be empty";
        }
        this.setState({ errors: errors });
        return formIsValid;
    }
    onSubmit() {
        if (this.handleValidation()) {
            this.authenticateUser();
        } else {
            toastr('Please fill all fields properly', 'error', this.refs.notificationSystem);
        }
    }
    render() {
        debugger;
        isUserLogged() ? this.toLogin() : null;
        return (
            <Row>
                <Col lg={12}>
                    {/* <Button className='m-t-2 m-b-1' onClick={() => this.props.history.goBack()}>
                        <i className='fa fa-angle-left m-r-1'></i>
                        Back
                    </Button> */}
                    <br /><br />
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
                                        <Link to='/forgot-password'>
                                            Forgot Password?
                                        </Link>
                                        <Link to='/user/register' className='pull-right'>
                                            Register
                                        </Link>
                                    </div>
                                )}
                            >
                                <h2 className={classes.panelHeader}>
                                    EMMS v0.1
                                </h2>
                                <p className='text-center m-b-3'>
                                    Authorised access only
                                </p>
                                <Form>
                                    <FormGroup>
                                        <div className={this.state.errors.email ? "form-group has-error has-feedback" : "form-group "}>
                                            <FormControl type='text' placeholder='Enter email...' name='email' onChange={this.onTextChange} value={this.state.userInput.email} />
                                        </div>
                                        <span className="label label-danger">{this.state.errors.email}</span>
                                    </FormGroup>
                                    <FormGroup>
                                        <div className={this.state.errors.password ? "form-group has-error has-feedback" : "form-group "}>
                                            <FormControl type='password' placeholder='Your Password...' name='password' onChange={this.onTextChange} value={this.state.userInput.password} />
                                        </div>
                                        <span className="label label-danger">{this.state.errors.password}</span>
                                    </FormGroup>
                                    <Checkbox checked={this.state.isChecked} onChange={() => this.setState({ isChecked: !this.state.isChecked })}>
                                        Remember Password?
                                    </Checkbox>

                                    <Button block bsStyle='primary' className='m-b-2' onClick={this.onSubmit}>
                                        Login
                                    </Button>
                                    <NotificationSystem ref="notificationSystem" />
                                </Form>
                            </Panel>
                            <p className='text-center text-gray-light'>
                                <strong>
                                    <span className='text-gray-light'>
                                        © 2017 Copyright Artler Capital, Inc.
                                </span>
                                </strong>
                            </p>
                        </Col>
                    </Row>
                </Col>
            </Row >
        );
    }
}

const mapStateToProps = (state) => ({
    usersResult: state.usersResult
});
const mapActionCreators = {
    authenticateUser
};
export default connect(mapStateToProps, mapActionCreators)(LoginContainer);
