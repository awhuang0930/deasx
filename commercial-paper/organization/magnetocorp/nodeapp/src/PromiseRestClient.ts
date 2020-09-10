import axios from 'axios';
import * as yaml from 'js-yaml';
import * as fs from 'fs';

export class PromiseRestClient {

    // static RestUriBase = yaml.safeLoad(fs.readFileSync('./app.config.yaml', 'utf8'))
    //                         .AppConfig.RestApiUriBase;
    

    // Find from the Rest Api
    // Param:   1.uri - string for ODataApi endpoint
    // Reviewed on 6/12/2019
    static async Get(inputUri:string) : Promise<any>  {

        //console.log(`Query: uri:${inputUri}`);

        let queryResponse;
        return axios.get(inputUri)
        .then(function (response) {
          // handle success
          queryResponse = response;
          console.log(`[Get] ${inputUri} ${inputUri} return status ${queryResponse.status}`);
          return queryResponse.data;
        })
        .catch(function (error) {
          // handle error
          console.log(error);
          return error.Message;
        })
        .finally(function () {
          // always executed
        });
      }

      
    // Post from the Rest Api
    // Param:   1.uri - string for api endpoint
    // Reviewed on 6/12/2019
    static async Post(inputUri:string, updateInfo:any) : Promise<any> {

      //console.log(`Post: uri:${inputUri}, updateInfo:` + JSON.stringify(updateInfo));

      return axios.post(inputUri, updateInfo)
      .then(function (response) {
        let queryResponse = response;
        console.log(`[Post] ${inputUri} return status ${queryResponse.status}`);
        return queryResponse.status;
      })
      .catch(function (error) {
          // handle error
          console.log(`[Post] ${inputUri} return error message: ${error.Message}`);
          return error.Message;
      });
    }
  }