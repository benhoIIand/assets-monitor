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
                <div className="group">
                    <h3 className="group-title">{type.toUpperCase()}</h3>
                    <Asset type={type} numberOfBuilds={20} />
                </div>
            );
        });

        return (
            <div>{assets}</div>
        );
    }

});

React.render(React.createElement(assetMonitor), document.getElementById('app'));
