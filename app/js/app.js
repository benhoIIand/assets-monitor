import React from 'react';
import Asset from './asset';

const assetMonitor = React.createClass({

    getDefaultProps() {
        return {
            fileTypes: ['css', 'js', 'images']
        };
    },

    render() {
        const assets = this.props.fileTypes.map((type) => {
            return (
                <div className="asset-block">
                    <h3 className="asset-title">{type.toUpperCase()}</h3>
                    <Asset type={type} />
                </div>
            );
        });

        return (
            <div>{assets}</div>
        );
    }

});

React.render(React.createElement(assetMonitor), document.getElementById('app'));
