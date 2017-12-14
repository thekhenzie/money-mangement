import React from 'react';
import {
    Row,
    Col,
    Editor
} from 'components';

import { RoutedComponent, connect } from 'routes/routedComponent';
import { CONTENT_VIEW_STATIC } from 'layouts/DefaultLayout/modules/layout';

//import classes from './../Pages.scss';

class UsersContainer extends RoutedComponent {
    constructor(props) {
        super(props);

        this.state = {};
    }

    getLayoutOptions() {
        return {
            contentView: CONTENT_VIEW_STATIC
        }
    }

    render() {
        return (
            <Row>
                <Col lg={12}>
                    <p>
                        UsersContainer
                    </p>
                </Col>
            </Row>
        );
    }
}

export default connect()(UsersContainer);
