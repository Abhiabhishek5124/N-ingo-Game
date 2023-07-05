$("#submit").click(function(){
    const email = document.getElementById("email").innerText;
    const userName =document.getElementById("userName").innerText;
    const password = document.getElementById("password").innerText; 
})
$("#login").click(function(){
    const userNameLogin =  document.getElementById("userNameLogin").innerText;
    const passwordLogin =  document.getElementById("passwordLogin").innerText;
})


endpoint = 'https://jsonblob.com/api/jsonBlob/1083471290496729088'
email = document.getElementById("email").innerText;
userName =document.getElementById("userName").innerText;
password = document.getElementById("password").innerText; 

axios.get(`${endpoint}`,{}).then(function(response){
    var data = (response.data).players;
    let ourPlayer;
    for(let i= 0; i< data.length ; i++){
        if(data[i].username === userName && data[i].password === password){
            ourPlayer = data[i];
        }
        else {alert("Username or Password do not Match!!! name and Password Again.");}
        
    }
});

//need to optimize this function.
function winner(ourPlayer,username) {
    let Bingo = 0;
    //Traversing through row
    for(let i = 0; i< 5; i ++){
        let count = 0;
        for(let j = 0; j< 5; j++){
            if(playerData[i][j] === 1){
                count = count + 1;
            }
            else {
                break;
            }
        }
        if(count === 5){
            Bingo = Bingo +1
            if(Bingo === 5){
                break;
            }
        }
        if(Bingo === 5){
            break;
        }
        
    }
    //Traversing Through Column
    if(Bingo < 5) {
    for(let column = 0; column< 5; column++){
        let count = 0;
        for(let row = 0; row < 5; row ++){
            if(playerData[row][column]=== 1){
                count =  count + 1;
            }
            else {
                break;
            }
        }
        if(count === 5) {
            Bingo = Bingo + 1
            if(Bingo === 5){
                break;
            }
        }
        if(Bingo === 5){
            break;
        }

    }
    }
    //Traversing through the diagnols
    if(Bingo < 5 ){
        for(i= 0; i< 5 ; i++){
            let count = 0;
            if(playerData[i][i] === 1){
                count = count + 1;
            }
            else{
                break;
            }
            if(count === 5){
                Bingo = Bingo + 1
                if(Bingo == 5){
                    break;
                }
            }
        }
    }
    if(Bingo >= 5){
        console.log("We have found the winner!!!")
    }
    else {
        console.log("Winner not found!!")
    }
}
