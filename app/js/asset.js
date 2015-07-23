import Firebase from 'firebase';
import React from 'react';
import Sparkline from 'react-sparkline';
import {unique} from 'lodash/array';
import {find, map, reduce} from 'lodash/collection';

const firebaseUrl = 'https://asset-monitor.firebaseio.com/assets/';
const PERCENT_CHANGE_THRESHOLD = 10;
const PRIMARY_METRIC = 'uncompressed';

const Asset = React.createClass({

    getInitialState() {
        return {
            files: []
        };
    },

    whosANaughtyAsset(assetHistory) {
        const current = assetHistory.pop();
        const penultimate = assetHistory.pop();

        if (penultimate === undefined) {
            return false;
        }

        if (current[PRIMARY_METRIC] === penultimate[PRIMARY_METRIC]) {
            return this.whosANaughtyAsset(assetHistory.concat([penultimate]));
        }

        return this.getPercentageChange(current[PRIMARY_METRIC], penultimate[PRIMARY_METRIC]) >= PERCENT_CHANGE_THRESHOLD;
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
                const recent = history[history.length - 1];
                const isDeleted = recent[PRIMARY_METRIC] === undefined;

                return {
                    file,
                    recent,
                    history,
                    isDeleted,
                    showWarning: isDeleted ? false : this.whosANaughtyAsset(history)
                };
            })
            .filter((asset) => !asset.isDeleted)
            .sort((a, b) => b.recent[PRIMARY_METRIC] > a.recent[PRIMARY_METRIC]);

            this.setState({
                files: assets
            });
        });
    },

    getPreviousChange(assetHistory) {
        const current = assetHistory.pop();
        const penultimate = assetHistory.pop();

        if (penultimate === undefined) {
            return current;
        }

        if (current[PRIMARY_METRIC] === penultimate[PRIMARY_METRIC]) {
            return this.getPreviousChange(assetHistory.concat([penultimate]));
        }

        return penultimate;
    },

    render() {
        const assets = this.state.files.map((asset, i) => {
            return (
                <div className={['asset', asset.showWarning ? 'asset--warning' : ''].join(' ')} key={'asset' + i}>
                    <h1 className="asset-title">{asset.file}</h1>
                    <div className="asset-data">
                        <span className="asset-data-previous">
                            <span>{(this.getPreviousChange(asset.history)[PRIMARY_METRIC] / 1024).toFixed(1)}</span>
                            <span className="asset-unit">kb</span>
                            <span> / </span>
                        </span>
                        <span>{(asset.recent[PRIMARY_METRIC] / 1024).toFixed(1)}</span>
                        <span className="asset-unit">kb</span>
                    </div>
                    <div className="asset-sparkline">
                        <Sparkline data={asset.history.filter((asset) => !asset.isDeleted).map((asset) => asset[PRIMARY_METRIC])}
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
