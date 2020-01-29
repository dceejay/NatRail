module.exports = function(RED) {
    function NationalRailConfigNode(config) {
        RED.nodes.createNode(this, config);
        this.name = config.name;
    }

    RED.nodes.registerType("natRail-config", NationalRailConfigNode, {
        credentials: { apiKey: {type:"text"} }
    });
}