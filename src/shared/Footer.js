import React, { Component } from 'react';

class Footer extends Component {
    render() {
        return (
            <footer>
                <address>
                    <strong>Contact us</strong><br />
                    <a href="https://www.flexinets.eu/contact-en/">flexinets.eu/contact/</a><br />
                    <a href="mailto:support@flexinets.se">support@flexinets.se</a>
                </address>
                <address>
                    <strong>Sweden</strong><br />
                    info@flexinets.se<br />
                    +46 (0)8 5465 8420
                </address>
                <address>
                    <strong>Finland</strong><br />
                    info@flexinets.fi<br />
                    +358 (0)9 4245 0327
                </address>
                <address>
                    <strong>Denmark</strong><br />
                    info@flexinets.dk<br />
                    +45 (0)7 014 5399
                </address>
            </footer>
        );
    }
}

export default Footer;