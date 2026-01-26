import axios from 'axios';


export const getAccessToken = async ():Promise<any> => {
    try {
        const response = await axios.post('https://api.heygen.com/v1/streaming.create_token', {}, {
            headers: {
                'x-api-key': "MGRmOTdkNjMzNWYxNDJhNmIxYjQ2OWQxY2Y2NDdmM2ItMTczNTYzOTA1NQ=="
            }
        });
        if(response) {
            return response;
        }
    } catch(err) {
        throw err;
    }
}