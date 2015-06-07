import Firebase from 'firebase';
import React from 'react';
import Sparkline from 'react-sparkline';
import {unique} from 'lodash/array';
import {find, map, reduce} from 'lodash/collection';

var asset = React.createClass({

    getInitialState: function() {
        return {
            files: []
        };
    },

    componentWillMount: function() {
        new Firebase('https://asset-monitor.firebaseio.com/assets/images').limitToLast(10).on('value', (data) => {
            const builds = data.val();
            const files = unique(reduce(map(builds, (build) => map(build, (asset) => asset.filename)), (arr, build) => arr.concat(build), []));

            const assets = map(files, (file) => {
                const history = map(builds, (build) => find(build, (asset) => asset.filename === file));

                return {
                    file: file,
                    recent: history[history.length - 1],
                    history: history
                };
            }).sort((a, b) => b.recent.uncompressed > a.recent.uncompressed);

            this.setState({
                files: assets
            });
        });
    },

    render: function() {
        const blocks = this.state.files.map(function (asset, i) {
            return (
                <div className="col-md-4" key={'block' + i}>
                    <div className="block">
                        <h1 className="block-title">{asset.file}</h1>
                        <div className="block-data">{(asset.recent.uncompressed / 1024).toFixed(1)}kb</div>
                        <Sparkline data={map(asset.history, (asset) => asset.uncompressed)}
                                   width="200"
                                   height="40"
                                   strokeColor="#67C8FF"
                                   strokeWidth="2px"
                                   circleDiameter="2"/>
                    </div>
                </div>
            );
        });

        return <div className="row">{blocks}</div>;
    }

});

module.exports = asset;
