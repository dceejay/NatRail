
module.exports = function(RED) {
    "use strict";
    var Rail = require('national-rail-darwin')

    function NatRailNode(n) {
        RED.nodes.createNode(this,n);
        this.property = n.property||"payload";
        this.scode = n.scode || "WIN";
        var credentials = this.credentials;
        if ((credentials) && (credentials.hasOwnProperty("apikey"))) { this.apikey = credentials.apikey; }
        else { this.error("No API key set"); }
        var rail = new Rail(this.apikey);
        var node = this;

        this.on("input", function(msg) {
            var value = RED.util.getMessageProperty(msg,node.property);
            if (value !== undefined) {
                var stationcode = node.scode || msg.station;
                rail.getDepartureBoard(stationcode, {}, function(err,result) {
                    if (err) {
                        if (err.statusCode === 401) {
                            node.error("Unauthorised - Is API key correct ?",msg);
                        }
                        else {
                            node.error("Error :"+err.statusCode,msg);
                        }
                    }
                    else {
                        if (result.hasOwnProperty("trainServices")) {
                            value = result.trainServices;
                            RED.util.setMessageProperty(msg,node.property,value);
                            msg.topic = stationcode;
                            node.send(msg);
                        }
                        else {
                            node.warn("Odd return from Train API call");
                        }
                    }
                })
            }
            else { node.send(msg); }
        });
    }
    RED.nodes.registerType("natrail",NatRailNode, {
        credentials: { apikey: {type:"text"} }
    });
}
