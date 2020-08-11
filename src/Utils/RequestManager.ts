import axios, { AxiosRequestConfig } from 'axios';
import { IAddVideoRequestBody, IUpdateVideoRequestBody, IAddScreenRequestBody, IUpdateScreenRequestBody } from '../Interfaces/IRequestData';


export default class RequestManager {
    static baseUrl = 'https://v2lu4dcv0l.execute-api.us-east-1.amazonaws.com/dev/'

    

    static async getVideos() {
        return await this.get(`${this.baseUrl}/videos`);
    }

    static async getScreens() {
        return await this.get(`${this.baseUrl}/screens`);
    }

    private static get = async (url: string) => {
        let config: AxiosRequestConfig = {
            headers: {
                'Content-Type': 'application/json'
            }
        }       
        return await axios.get(url, config);
    }

    private static post = async (url: string, data: object ) => {
        const d = JSON.stringify(data); 
        let config: AxiosRequestConfig = {
            headers: {
                'Content-Type': 'application/json'
            }
        }                                                                                      
        return await axios.post(url, d, config);
    }
}