import Firebase from 'firebase';
import React from 'react';
import Sparkline from 'react-sparkline';
import {unique} from 'lodash/array';
import {find, map, reduce} from 'lodash/collection';

const firebaseUrl = 'https://asset-monitor.firebaseio.com/assets/';

const Asset = React.createClass({

    getInitialState() {
        return {
            files: []
        };
    },

    componentWillMount() {
        const url = `${firebaseUrl}${this.props.type}`;

        new Firebase(url).limitToLast(10).on('value', (data) => {
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

    render() {
        const blocks = this.state.files.map((asset, i) => {
            return (
                <div className="block" key={'block' + i}>
                    <h1 className="block-title">{asset.file}</h1>
                    <div className="block-data">{(asset.recent.uncompressed / 1024).toFixed(1)}kb</div>
                    <Sparkline data={map(asset.history, (asset) => asset.uncompressed)}
                               width="200"
                               height="40"
                               strokeColor="#67C8FF"
                               strokeWidth="2px"
                               circleDiameter="2"/>
                </div>
            );
        });

        return <div>{blocks}</div>;
    }

});

module.exports = Asset;
