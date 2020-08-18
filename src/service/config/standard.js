import axios from 'axios'

const standard = axios.create({
    baseURL: 'https://instalite-backend.herokuapp.com/',
    //baseURL: 'http://localhost:9000/',
    timeout: 100000,
    transformResponse: [
        function (data) {
            return data
        }
    ]
})

export default standard
