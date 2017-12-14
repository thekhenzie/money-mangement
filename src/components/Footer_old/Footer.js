import React from 'react';

export const Footer = (props) => (
    <footer>
        <div className={props.container || 'container-fluid'}>
            <p className="text-gray-dark">
                <strong className="m-r-1"><span className="text-gray-dark">© 2017 Copyright Artler Capital, Inc.</span></strong>
            </p>
        </div>
    </footer>
);

Footer.propTypes = {
    container: React.PropTypes.string
};

export default Footer;
