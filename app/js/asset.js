import Firebase from 'firebase';
import React from 'react';
import Sparkline from 'react-sparkline';
import {unique} from 'lodash/array';
import {find, map, reduce} from 'lodash/collection';

const firebaseUrl = 'https://asset-monitor.firebaseio.com/assets/';
const percentageChangeThreshold = 10;

const Asset = React.createClass({

    getInitialState() {
        return {
            files: []
        };
    },

    whosANaughtyAsset(assetHistory) {
        const current = assetHistory.pop();
        const penultimate = assetHistory.pop();

        if (current.uncompressed === penultimate.uncompressed) {
            return this.whosANaughtyAsset(assetHistory.concat([penultimate]));
        }

        return this.getPercentageChange(current.uncompressed, penultimate.uncompressed) >= percentageChangeThreshold;
    },

    getPercentageChange(newVal, oldVal) {
        return Math.floor(((newVal / oldVal) - 1) * 100);
    },

    componentWillMount() {
        const url = `${firebaseUrl}${this.props.type}`;

        new Firebase(url).limitToLast(this.props.numberOfBuilds).on('value', (data) => {
            const builds = data.val();
            const files = unique(reduce(map(builds, (build) => map(build, (asset) => asset.filename)), (arr, build) => arr.concat(build), []));

            const assets = map(files, (file) => {
                const history = map(builds, (build) => find(build, (asset) => asset.filename === file));

                return {
                    file: file,
                    recent: history[history.length - 1],
                    history: history,
                    showWarning: this.whosANaughtyAsset(history)
                };
            })
            .filter((asset) => asset.recent !== undefined)
            .sort((a, b) => b.recent.uncompressed > a.recent.uncompressed);

            this.setState({
                files: assets
            });
        });
    },

    render() {
        const assets = this.state.files.map((asset, i) => {
            return (
                <div className={['asset', asset.showWarning ? 'asset--warning' : ''].join(' ')} key={'asset' + i}>
                    <h1 className="asset-title">{asset.file}</h1>
                    <div className="asset-data">
                        <span>{(asset.recent.uncompressed / 1024).toFixed(1)}</span>
                        <span className="asset-unit">kb</span>
                    </div>
                    <div className="asset-sparkline">
                        <Sparkline data={map(asset.history, (asset) => asset.uncompressed)}
                               width="200"
                               height="40"
                               strokeColor="#67C8FF"
                               strokeWidth="2px"
                               circleDiameter="3" />
                    </div>
                </div>
            );
        });

        return <div>{assets}</div>;
    }

});

module.exports = Asset;
