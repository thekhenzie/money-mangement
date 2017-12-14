import React from 'react';
import { Link } from 'react-router';
import faker from 'faker';

import {
    Row,
    Col,
    Panel,
    Button,
    Form,
    FormGroup,
    FormControl,
    AvatarImage
} from 'components';

import { RoutedComponent, connect } from 'routes/routedComponent';
import { CONTENT_VIEW_FLUID } from 'layouts/DefaultLayout/modules/layout';

import { Colors } from 'consts';

import classes from './../Pages.scss';

import logo from 'static/spin-logo-inverted.png';

class LockScreenContainer extends RoutedComponent {
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
                <Col lg={12}>
                    <Button className='m-t-2 m-b-1' onClick={() => this.props.history.goBack()}>
                        <i className='fa fa-angle-left m-r-1'></i>
                        Back
                    </Button>

                    <Row>
                        <Col className={classes.centerCol} md={4}>
                            <Panel
                                header={(
                                    <div className='text-center'>
                                        <AvatarImage
                                            src={faker.image.avatar()}
                                            size='large'
                                            showStatus
                                            statusPlacement='bottom'
                                            statusColor={Colors.brandDanger}
                                        />
                                    </div>
                                )}
                                footer={(
                                    <div className='text-center'>
                                        <Link to='/pages/login'>
                                            Sign in as Different User
                                        </Link>
                                    </div>
                                )}
                            >
                                <h2 className={classes.panelHeader}>
                                    {`${faker.name.firstName()} ${faker.name.lastName()}`}
                                </h2>
                                <p className='text-center m-b-3'>
                                    Enter your password to access the application.
                                </p>

                                <Form onSubmit={e => e.preventDefault()}>
                                    <FormGroup>
                                        <FormControl type='password' placeholder='Your Password...' />
                                    </FormGroup>

                                    <Button block bsStyle='primary' className='m-b-2'>
                                        Unlock
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

export default connect()(LockScreenContainer);
