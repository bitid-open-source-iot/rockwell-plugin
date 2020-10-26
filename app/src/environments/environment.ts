export const environment = {
    'api': 'http://127.0.0.1:8000',
    'auth': 'https://auth.bitid.co.za',
    'appId': '000000000000000000000027',
    'appName': 'Rockwell Plugin',
    'telemetry': 'https://telemetry.bitid.co.za',
    'production': false,
    'scopes': [
        { 'url': '/telemetry/devices/get', 'role': 4 },

        { 'url': '/api/config/get', 'role': 4 },
        { 'url': '/api/config/update', 'role': 4 },
        { 'url': '/api/config/status', 'role': 4 }
    ]
};