node-red-contrib-uk-national-rail
=================================

A <a href="http://nodered.org" target="_new">Node-RED</a> node to provide a list
of upcoming train departures.

### Pre-requisites

To use this node you will require an API key from the <a target="_new" href="http://realtime.nationalrail.co.uk/OpenLDBWSRegistration/">
UK National Rail Developers web site</a>.

### Install

Install using the Manage Palette menu option, or manually run the following command in your Node-RED user directory - typically `~/.node-red`

        npm i --save dceejay/node-red-contrib-uk-national-rail


### Usage

**Outputs**

 - **payload** contains an array of upcoming train departure objects.
 - **topic** set to the station code of the station requested.

**Inputs**

 - **station** a station code string that can be used if one is not specified in the configuration. The configuration has precedence.
