import React from 'react';
import {
    Row,
    Col
} from 'components';

import { RoutedComponent, connect } from 'routes/routedComponent';
import { CONTENT_VIEW_STATIC } from 'layouts/DefaultLayout/modules/layout';

//import classes from './../Pages.scss';

class AdminContainer extends RoutedComponent {
    constructor(props) {
        super(props);

        this.state = { };
    }

    getLayoutOptions() {
        return {
            contentView: CONTENT_VIEW_STATIC
        }
    }

    render() {
        return (
            <Row>
                <Col lg={ 12 }>
                    <p>
                        Admin Container
                    </p>
                </Col>
            </Row>
        );
    }
}

export default connect()(AdminContainer);
