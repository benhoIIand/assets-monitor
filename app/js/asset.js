require('firebase');
var React = require('react');
var ReactFireMixin = require('reactfire');

console.log(ReactFireMixin);

var asset = React.createClass({

    mixins: [ReactFireMixin],

    getInitialState: function() {
        return {
            items: []
        };
    },

    componentWillMount: function() {
        this.bindAsArray(new Firebase('https://asset-monitor.firebaseio.com/assets/css/'), 'items');
    },

    render: function() {
        var blocks;

        if(!this.state.items[0]) {
            blocks = <p>Loading...</p>;
        } else {
            blocks = this.state.items[0].map(function (block) {
                return (
                    <div className="block">
                        <h1 className="block-title">{block.filename}</h1>
                        <div className="block-data">{(block.uncompressed / 1024).toFixed(1)}kb</div>
                    </div>
                );
            });
        }

        return <div>{blocks}</div>;
    }

});

module.exports = asset;
