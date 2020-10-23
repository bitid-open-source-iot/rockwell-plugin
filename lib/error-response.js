class ErrorResponse {
    constructor() {
        this.error = {
            'code': 401,
            'message': 'Invaild Credentials',
            'errors': [{
                'code': 401,
                'reason': 'General Error',
                'message': 'General Error',
                'location': 'General Error',
                'locationType': 'General Error'
            }]
        };
    };
};

module.exports = ErrorResponse;