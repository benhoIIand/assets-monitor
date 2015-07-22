import React from 'react';
import AssetList from './assetList';
import PageWeight from './pageWeight';

const assetMonitor = React.createClass({

    render() {
        return (
            <div>
                <div className="col-2">
                    <PageWeight />
                </div>
                <div className="col-2">
                    <AssetList />
                </div>
            </div>
        );
    }

});

React.render(React.createElement(assetMonitor), document.getElementById('app'));
