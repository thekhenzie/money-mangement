import React from 'react';
// import { Redirect } from 'react-router';
class HomeContainer extends React.Component {
    static contextTypes = {
        router: React.PropTypes.object.isRequired
    }

    componentDidMount() {
        this.context.router.push('/simulator');
        // <Redirect to='/simulator'/>
    }

    render() {
        return (<span></span>);
    }
}

export default HomeContainer;
