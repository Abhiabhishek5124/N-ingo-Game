
let doneButton = document.getElementById("done");
let fillButton = document.getElementById("fill");
let fields = document.querySelectorAll(".fields");
let audio = document.querySelector("#audioButton");
let gameAudio = document.querySelector("#gameAudio");
// Makes the input field read only.

$(".fields").prop('readonly', true);


var isFilled = false;
var isDone= false;        
//isDone checks whether the elements are set to non editable or not.
//code to set the numbers when clicked on the done button. This will not let change the numbers 
// we will store the indexes of the crossed 

doneButton.addEventListener('click', function(){
    if (isFilled){
        done();
    }
    else {

        alert(`<h3>This is test<h3>`)
    }
});
function done(){ 
    $(".fill").css("display","none");
    $(".done").css("display","none");
    $("#audioButton").css("display","none");
    isDone = true;
    for (let i= 0; i<25; i++){
        fields[i].setAttribute('readonly', true);
    }
    console.log(isDone + " inside the blockj")
 
    // this block of code is to cross the numbers whenever the users clicks on the numbers,or we can just change the color of the blocks.
    // First we have to make sure, the numbers are set Done i.e they are read only afer we click the done button, or the Done button and we have to store the numbers click on some sort of grid.

console.log( isDone + " isdone out side the block")
if(isDone){ 
    for(let i = 0; i < fields.length; i++){  
        fields[i].addEventListener('click',function(){
                fields[i].style.backgroundColor = 'purple';
                audio.playbackRate = 3;
                audio.play();
                
            });
    }
} }

// Fills the numbers randomly generated in the database
fillButton.addEventListener('click',fill);
function fill(){
    isFilled = true;
    gameAudio.play();
    axios.get('/game/getNumbers')
    .then(function(response){
        console.log(response);
        let listOfNumbers = response.data;
        console.log(listOfNumbers);
        console.log(typeof(listOfNumbers));
        for (let i= 0; i<25; i++){
            //inputs[i].value='0';
            fields[i].setAttribute('value',listOfNumbers[i]);
        }
    }).catch(function(error){
        console.log(error);
        console.log("Error in fill function")
    })
}
