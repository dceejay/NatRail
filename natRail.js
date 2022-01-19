
module.exports = function (RED) {
    "use strict";
    var Rail = require('national-rail-darwin')

    function NatRailNode(n) {
        RED.nodes.createNode(this, n);
        this.property = n.property || "payload";
        this.scode = n.scode || "";
        this.destscode = n.destscode || "";

        // grab API key from configuration node
        this.api = RED.nodes.getNode(n.api);
        if (this.api) {
            this.apikey = this.api.credentials.apiKey;
        } else {
            this.error("No API key set");
        }

        var rail = new Rail(this.apikey);
        var node = this;

        this.on("input", function (msg) {
            var stationcode = node.scode || msg.station;
            var destinationstationcode = node.destscode || msg.destination_station;
            var options = {};
            if (destinationstationcode) {
                options.destination = destinationstationcode;
            }
            rail.getDepartureBoard(stationcode, options, function (err, result) {
                if (err) {
                    if (err.statusCode === 401) {
                        node.error("Unauthorised - Is API key correct ?", msg);
                    }
                    else {
                        node.error("Error :" + err.statusCode, msg);
                    }
                }
                else {
                    if (result.hasOwnProperty("trainServices")) {
                        let value = result.trainServices;
                        RED.util.setMessageProperty(msg, node.property, value);
                        msg.topic = stationcode;
                        node.send(msg);
                    }
                    else {
                        node.warn("Odd return from Train API call");
                    }
                }
            })
        });
    }
    RED.nodes.registerType("natrail", NatRailNode);
}
