import React from 'react';
import {
    Row,
    Col
} from 'components';

import { RoutedComponent, connect } from 'routes/routedComponent';
import { CONTENT_VIEW_STATIC } from 'layouts/DefaultLayout/modules/layout';
import { isUserLogged } from '../../../auth';
//import classes from './../Pages.scss';

class SimulatorContainer extends RoutedComponent {
    static contextTypes = {
        router: React.PropTypes.object.isRequired
    }
    constructor(props) {
        super(props);
        this.state = {};

    }

    getLayoutOptions() {
        return {
            contentView: CONTENT_VIEW_STATIC
        }
    }

    toLogin() {
        this.context.router.push('/user/login');
    }
    render() {
        isUserLogged() ? console.log("Logged in") : this.toLogin();
        return (
            <Row>
                <Col lg={12}>
                    <p>
                        SimulatorContainer
                    </p>
                </Col>
            </Row>
        );
    }
}

export default connect()(SimulatorContainer);
