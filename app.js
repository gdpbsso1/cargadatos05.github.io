const SHEET_ID = '1iVVnO9rtg_h5BD2ZacX6R_vPYbRNyCnRLCB4rBp_Epg'; // Reemplaza con tu ID de hoja
const API_KEY = 'AIzaSyAk5SNYAHZsgiBCTf1CeWzfceJXL-6aKio'; // Reemplaza con tu clave de API


// const SHEET_ID = 'TU_SHEET_ID_AQUI'; // Reemplaza con tu ID de hoja
// const API_KEY = 'TU_API_KEY_AQUI'; // Reemplaza con tu clave de API

function initClient() {
    gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4"]
    }).then(() => {
        console.log('API client initialized.');
    }).catch(error => {
        console.error('Error initializing API client:', error);
    });
}

function loadData() {
    const nro = document.getElementById('nro').value;
    if (!nro) {
        alert('Por favor, ingresa un número.');
        return;
    }

    gapi.client.load('sheets', 'v4', () => {
        gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_ID,
            range: 'misdatos!A:C'
        }).then(response => {
            console.log('Data retrieved:', response.result.values);
            const data = response.result.values;
            const row = data.find(row => row[0] === nro);
            if (row) {
                document.getElementById('ape').value = row[1];
                document.getElementById('nom').value = row[2];
                document.getElementById('formFields').style.display = 'block';
            } else {
                document.getElementById('ape').value = '';
                document.getElementById('nom').value = '';
                document.getElementById('formFields').style.display = 'block';
            }
        }).catch(error => {
            console.error('Error retrieving data:', error);
        });
    });
}

function saveData() {
    const nro = document.getElementById('nro').value;
    const ape = document.getElementById('ape').value;
    const nom = document.getElementById('nom').value;
    if (!nro || !ape || !nom) {
        alert('Por favor, completa todos los campos.');
        return;
    }

    gapi.client.load('sheets', 'v4', () => {
        gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_ID,
            range: 'misdatos!A:A'
        }).then(response => {
            const data = response.result.values;
            const rowIndex = data.findIndex(row => row[0] === nro);
            if (rowIndex !== -1) {
                gapi.client.sheets.spreadsheets.values.update({
                    spreadsheetId: SHEET_ID,
                    range: `misdatos!B${rowIndex + 1}:C${rowIndex + 1}`,
                    valueInputOption: 'RAW',
                    resource: {
                        values: [[ape, nom]]
                    }
                }).then(() => {
                    alert('Datos actualizados.');
                }).catch(error => {
                    console.error('Error updating data:', error);
                });
            } else {
                gapi.client.sheets.spreadsheets.values.append({
                    spreadsheetId: SHEET_ID,
                    range: 'misdatos!A:C',
                    valueInputOption: 'RAW',
                    resource: {
                        values: [[nro, ape, nom]]
                    }
                }).then(() => {
                    alert('Datos guardados.');
                }).catch(error => {
                    console.error('Error appending data:', error);
                });
            }
        }).catch(error => {
            console.error('Error checking data:', error);
        });
    });
}

gapi.load('client', initClient);
