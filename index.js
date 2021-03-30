const express = require('express');
const { request } = require('http');
const jsforce = require('jsforce');
const nforce = require('nforce');
var sf = require('node-salesforce');
var Client = require('ftp');
const bodyParser = require('body-parser');
var parser = require('xml2json-light');
var dataStr;
fs = require('fs')

require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const { SF_LOGIN_URL, CLIENT_ID, REDIRECT_URI, CLIENT_SECRET, SF_USERNAME, SF_PASSWORD, SF_TOKEN } = process.env
var conn = new sf.Connection({
    oauth2: {
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        redirectUri: REDIRECT_URI,
    },
    version: '50.0'
})

let port = process.env.PORT;
if (port == null || port == "") {
    port = 8000;
}
app.listen(port);
app.get('/', (req, res) => { 
    res.send("Hello!");
});
app.post('/testxml', (req, res) => {
    
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
    <breakfast_menu>
    <food>
        <name>Belgian Waffles</name>
        <price>$5.95</price>
        <description>
       Two of our famous Belgian Waffles with plenty of real maple syrup
       </description>
        <calories>650</calories>
    </food>
    <food>
        <name>Strawberry Belgian Waffles</name>
        <price>$7.95</price>
        <description>
        Light Belgian waffles covered with strawberries and whipped cream
        </description>
        <calories>900</calories>
    </food>
    <food>
        <name>Berry-Berry Belgian Waffles</name>
        <price>$8.95</price>
        <description>
        Belgian waffles covered with assorted fresh berries and whipped cream
        </description>
        <calories>900</calories>
    </food>
    <food>
        <name>French Toast</name>
        <price>$4.50</price>
        <description>
        Thick slices made from our homemade sourdough bread
        </description>
        <calories>600</calories>
    </food>
    <food>
        <name>Homestyle Breakfast</name>
        <price>$6.95</price>
        <description>
        Two eggs, bacon or sausage, toast, and our ever-popular hash browns
        </description>
        <calories>950</calories>
    </food>
    </breakfast_menu>`;
    dataStr = parser.xml2json(xml);

    conn.login(SF_USERNAME, SF_PASSWORD + SF_TOKEN, (error, userInfo) => {
        if (error) {
            console.error(error);
        } else {
            console.log("Org Id:", userInfo.organizationId);
            console.log("Access Token:", conn.accessToken);
            console.log("URL: ", conn.instanceUrl);
            let eventData = {
                "Data__c": JSON.stringify(dataStr)
            };

            conn.sobject("DataEvent__e").create(eventData, function (err, ret) {
                if (err) {
                    console.error(err);
                    res.send(err);
                    res.end();

                } else {
                    res.send("DataEvent__e published");
                    console.log(eventData);
                    console.log("DataEvent__e published");
                    res.end();
                }
            });
        }
    });
});

app.post('/getAssets', (req, res) => {
    conn.login(SF_USERNAME, SF_PASSWORD + SF_TOKEN, (error, userInfo) => {
        if (error) {
            console.error(error);
        } else {
            console.log("Org Id:", userInfo.organizationId);
            console.log("Access Token:", conn.accessToken);
            console.log("URL: ", conn.instanceUrl);
            let eventData = {
                "Data__c": JSON.stringify(req.body)
            };

            conn.sobject("DataEvent__e").create(eventData, function (err, ret) {
                console.log("Length:", JSON.stringify(req.body).length);
                console.log("messageInfo:", ret);
                if (err) {
                    console.error(err);
                    res.send(err);
                    res.end();

                } else {
                    res.send("DataEvent__e published");
                    console.log(eventData);
                    console.log("DataEvent__e published");
                    res.end();
                }
            });
        }
    });
})


