import fs from 'fs';
import axios, { AxiosRequestConfig } from "axios";
import FormData from 'form-data';

const STRAPI_TOKEN = process.env.STRAPI_KEY;
const STRAPI_URL = process.env.STRAPI_API_URL;

const uploadToStrapi = async (filePath: any) => {
    try {
        const config: AxiosRequestConfig = {
          method: "post",
          url: `${STRAPI_URL}/api/upload`,
          headers: {
            Authorization: `Bearer ${STRAPI_TOKEN}`,
            ...filePath.getHeaders()
          },
          data:filePath
          
        };
        //console.log(filePath)
        const response = await axios(config);
        if (response.data && response.data[0]?.url) {
          return response.data[0].url; // Retornar solo el URL del archivo cargado
        } else {
          console.log('No URL found in the response');
          return null;
        }
      } catch (e) {
        console.log(e);
        return null;
      }
    
};

export {uploadToStrapi}


