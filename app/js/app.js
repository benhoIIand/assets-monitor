import React from 'react';
import AssetList from './assetList';

const assetMonitor = React.createClass({

    render() {
        return <AssetList />;
    }

});

React.render(React.createElement(assetMonitor), document.getElementById('app'));
