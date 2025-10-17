import axios, { AxiosRequestConfig } from "axios";

const token = process.env.MAPBOX_TOKEN;
const url = process.env.MAPBOX_API_URL;


const getCordinades = async (numero, calle): Promise<any | null> => {
   try {
        const config: AxiosRequestConfig = {
            method: "get",
            maxBodyLength: Infinity,
            url: `${url}?country=pe&region=cajamarca&postcode=06000&place=cajamarca&address_number=${numero}&street=${calle}&access_token=${token}`,
        };

        const response = await axios.request(config);
        //console.log(response.data.features[0])
        return response.data;
    } catch (e) {
        console.log(e);
        return null;
    }

      
};

export { getCordinades };
