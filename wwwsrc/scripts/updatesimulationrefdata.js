const fs = require('fs');
const path = require('path');
const request = require("request-promise-native");

const requestOpts = {
    json: true,
    qs: {
        env: 'test'
    },
    'auth': {
        'user': 'fapp_user',
        'pass': 'P@s$w0rd01!',
        'sendImmediately': false
    }
};

async function getList() {
    return await request.get('https://dt.pulsenow.co.uk/fapp/engineers/v1/referencedata/list', requestOpts);
};

async function getCatalog(catalogName) {
    return await request.get('https://dt.pulsenow.co.uk/fapp/engineers/v1/referencedata/' + catalogName, requestOpts);
};

async function createSimulationScenario(documentName, catalog) {
    let writeDir = path.join(__dirname, "../assets/scenarios/engineers/v1/referencedata", documentName);
    let scenario = {
        "status": 200,
        "data": catalog
    };

    let utf8 = JSON.stringify(scenario, null, 2, 2);
    if (!fs.existsSync(writeDir)) {
        fs.mkdirSync(writeDir);
    }
    fs.writeFileSync(path.join(writeDir, "scenario.json"), utf8, 'utf8');
};

async function cleanLocalReferenceData(documentName, catalog) {
    Object.keys(catalog.data).forEach(catalogName => {
        let deleteDir = path.join(__dirname, "../assets/services/reference", catalogName + ".json");
        if (fs.existsSync(deleteDir)) {
            console.log('local table', catalogName, ' is not on the remote. Removing...');
            fs.unlinkSync(deleteDir);
        }
    });
}

async function processRefData() {
    let list;

    try {
        list = await getList();
    } catch (e) {
        console.log('failed to retrieve list');
        throw e;
    }

    if (!list) {
        console.log('list empty');
        return;
    }

    const red = '\x1b[31m';
    const white = '\x1b[0m';

    console.log('Getting documents...');

    for (let doc of list.data.listObjects) {
        let documentName = doc.documentName.replace(/\..+$/, '');
        console.log(documentName);

        try {
            let catalog = await getCatalog(documentName);
            createSimulationScenario(documentName, catalog);
            cleanLocalReferenceData(documentName, catalog);
        } catch (e) {
            console.log(red, 'Failed to get document', documentName, 'from endpoint', white);
        }
    }
    createSimulationScenario("list", list);
}

processRefData();