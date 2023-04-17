import { database } from "./database.js";
let documentId = "1083471290496729088"
var endpoint = 'https://jsonblob.com/api/jsonBlob/1083471290496729088'
axios.put(`${endpoint}`,database);
export function apiCall(row,column){
    axios.get(`${endpoint}`).then(function(response){
       let jsonObject = response.data;
       const players = jsonObject.players
       players.forEach(player => {
        const playerState = player.playerState; // playerState is an multidimensional array
         //that represents the game state for each player.
        console.log(playerState);
    } );
       // change the way we set the objects value. 
    //    jsonObject.user1[key] = 1;
    
        axios.put(`${endpoint}`, jsonObject)
        .then(function(response){
            console.log(response);
        })
        .catch(function(error){
            console.log(error)
        });
    })
    .catch(function(error){
        console.log(error)
    });
}