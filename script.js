console.log("js running");

const URL = "https://happysamal.freewebhostmost.com/";

let toggle = true;
let songs;
let currentSong = new Audio();
let currentDiv;
let allow = true;

let welcome = document.querySelector('.welcome');
let homepage = document.querySelector(".homepage");
let signIn = document.querySelector(".signin-btn");
let cross = document.querySelector(".cross");
let singInformation = document.querySelector(".sign-in-information");
let allInput = document.querySelectorAll(".emailGet input");
let logIn = document.querySelector(".login-btn");
let updateUser = document.querySelector(".update-username");
let home = document.querySelector(".home-icon");
let playlist = document.querySelector(".playlist");
let musicSection = document.querySelector(".musicSection");
let songbar = document.querySelector(".songbar");
let backPlaylistBtn = document.querySelector(".backPlaylist-btn");
let mobileCrossBtn = document.querySelector(".mobile-cross-btn");
let musicName = document.querySelector(".musicName");
let playBtn = document.querySelector("#play-btn");
let previousBtn = document.querySelector("#previous-btn");
let nextBtn = document.querySelector("#next-btn");
let songInfo = document.querySelector(".songInfo p");
let songTime = document.querySelector(".timeVol p");
let seekbar = document.querySelector(".seekbar");
let seekPointer = document.querySelector(".seekPointer");
let musicFolders= document.querySelector(".musicFolders");
let volumeRange = document.querySelector("#volumeRange");
let volumeIcon = document.querySelector(".volume-icon");


function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

let arr = Array.from(allInput).map((el) => {
    return el.placeholder;
});

let reset = () => {
    let i = 0;
    for (let input of allInput) {
        input.value = "";
        input.placeholder = arr[i];
        input.style.borderColor = "black";
        i++;
    }
};

welcome.addEventListener("animationend", (evt) => {
    if (evt.animationName === 'anime') {
        welcome.classList.add("display");
        homepage.classList.remove("display");
        homepage.classList.add("homepageDisplay");
    }
});

let storeInformation = {
    userName: "",
    emailIN: "",
    passwordIN: "",
};

signIn.addEventListener("click", (evt) => {
    singInformation.classList.remove("display");
    for (let input of allInput) {
        input.addEventListener("change", (evt) => {
            if (evt.target.name == "userName") {
                storeInformation.userName = evt.target.value;
            } else if (evt.target.name == "emailIN") {
                storeInformation.emailIN = evt.target.value;
            } else if (evt.target.name == "passwordIN") {
                storeInformation.passwordIN = evt.target.value;
            } else {
                console.log("error");
            }
        });
    }
});

let checkInvalid = () => {
    let bol = true;
    for (let key in storeInformation) {
        if (storeInformation[key] == "") {
            for (let input of allInput) {
                if (input.name == key) {
                    input.style.borderColor = "red";
                    input.placeholder = "Invalid";
                    bol = false;
                }
            }
        } else if (!(storeInformation["emailIN"].endsWith("@gmail.com"))) {
            for (let input of allInput) {
                if (input.name == "emailIN") {
                    input.style.borderColor = "red";
                    input.placeholder = "Invalid";
                    bol = false;
                }
            }
        } else if (storeInformation["passwordIN"].length <= 5) {
            for (let input of allInput) {
                if (input.name == "passwordIN") {
                    input.style.borderColor = "red";
                    input.placeholder = "Invalid";
                    bol = false;
                }
            }
        }
    }
    return bol;
};

logIn.addEventListener("click", (evt) => {
    let bol = checkInvalid();
    if (bol) {
        signIn.style.display = "none";
        updateUser.children[0].src = "/photos/userIcon.png";
        updateUser.children[1].classList.remove("display");
        updateUser.children[1].innerText = storeInformation.userName;
        updateUser.children[1].style.color = "white";
        updateUser.children[1].style.fontSize = "10px";
        for (let input of allInput) {
            input.style.borderColor = "black";
        }
        singInformation.classList.add("display");
    }
});

cross.addEventListener("click", (evt) => {
    singInformation.classList.add("display");
    reset();
});

backPlaylistBtn.addEventListener("click", (evt) => {
        playlist.classList.remove("display");
        musicSection.classList.remove("extended");
        songbar.classList.remove("extended");
        songbar.classList.add("right");
});
 mobileCrossBtn.addEventListener("click",(evt)=>{
    playlist.classList.add("display");
    musicSection.classList.add("extended");
    songbar.classList.add("extended");
    songbar.classList.remove("right");
 })
 async function getFolders(){
    let promises = await fetch(`${URL}/folder/`);
    let data = await promises.text();
    let div = document.createElement("div");
    div.innerHTML=data;
    let as = div.querySelectorAll("a");
    as.forEach(async(a)=> {
        if(a.href.includes("/folder/")){
          let song = a.href.split("/folder/")[1];
          let response = await fetch(`${URL}/folder/${song}/info.json`);
          let data = await response.json()
          let folderDiv = document.createElement("div");
          folderDiv.classList.add("folder");
          folderDiv.innerHTML=`<a href="${a.href}"></a><img src="/folder/${song}/folderImg.jpg" alt="coverimg">
    <p class="Name">${data.name}</p>
    <p class="Description">${data.description}</p>
    <img class="circle" src="/photos/circle-icon.png" alt="">`;
        musicFolders.append(folderDiv);
        folderDiv.addEventListener("click", (evt) => {
            musicName.innerHTML=""
                let url = folderDiv.querySelector("a").href;
                main(url);
                playlist.classList.remove("display");
                musicSection.classList.remove("extended");
                songbar.classList.remove("extended");
                songbar.classList.add("right");
                resetBackground();
                folderDiv.style.border ="2px solid #8167cf";
                folderDiv.style.backgroundColor = "#302065";
                folderDiv.querySelector(".circle").style.bottom ="90px";
                folderDiv.querySelector(".circle").style.opacity="1";
            });
        }
    })
}
getFolders();
resetBackground=()=>{
    let divs = musicFolders.querySelectorAll("div");
    for (const div of divs) {
        div.style.border="2px solid #302065";
        div.style.backgroundColor= "#27175a";
        div.querySelector(".circle").style.bottom ="49";
        div.querySelector(".circle").style.opacity="0";
    }
}
function playMusic(track, div) {
    currentSong.src = track;
    currentDiv = div;

    let playImg = div.querySelector(".playImg");
    if (playImg.alt == "play") {
        borderReset();
        currentSong.play();
        div.style.border = "2px solid #8167cf";
        playImg.src = "/photos/pause-icon.png";
        playImg.alt = "pause";
        playBtn.src = "/photos/pause-icon.png";
    } else {
        currentSong.pause();
        div.style.border = "2px solid #332757";
        playImg.src = "/photos/play-icon.png";
        playImg.alt = "play";
        playBtn.src = "/photos/play-icon.png";
    }

    songInfo.innerText = `Song Name - ${div.querySelector(".songPara").innerText}`;

    currentSong.addEventListener("timeupdate", (evt) => {
        songTime.innerText = `${secondsToMinutesSeconds(currentSong.currentTime)}/${secondsToMinutesSeconds(currentSong.duration)}`;
        seekPointer.style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    });

    currentSong.addEventListener("ended", playNextSong);
}

playBtn.addEventListener("click", (evt) => {
    if (currentSong.paused) {
        currentSong.play();
        playBtn.src = "/photos/pause-icon.png";
        if (currentDiv) {
            currentDiv.style.border = "2px solid #8167cf";
            currentDiv.querySelector(".playImg").src = "/photos/pause-icon.png";
            currentDiv.querySelector(".playImg").alt = "pause";
        }
    } else {
        currentSong.pause();
        playBtn.src = "/photos/play-icon.png";
        if (currentDiv) {
            currentDiv.style.border = "2px solid #332757";
            currentDiv.querySelector(".playImg").src = "/photos/play-icon.png";
            currentDiv.querySelector(".playImg").alt = "play";
        }
    }
});

let volumeImg=true;
volumeRange.addEventListener("change",(evt)=>{
    currentSong.volume=evt.target.value/100;
    if(evt.target.value==0){
        volumeIcon.src = "/photos/mute-icon.png";
    }else{
        volumeIcon.src = "/photos/volume-icon.png"
    }
})
volumeIcon.addEventListener("click",(evt)=>{
    if(volumeImg){
        currentSong.volume=0;
        volumeIcon.src = "/photos/mute-icon.png";
        volumeImg=false;
    }else{
        currentSong.volume=0.5;
        volumeIcon.src = "/photos/volume-icon.png";
        volumeImg=true;
    }
})
async function getSongs(url) {
    let response = await fetch(url);
    let data = await response.text();
    let div = document.createElement("div");
    div.innerHTML = data;
    let as = div.querySelectorAll("li a");
    let song = [];
    for (let a of as) {
        if (a.href.endsWith(".mp3")) {
            song.push(a);
        }
    }
    return song;
}

async function main(url) {
    songs = await getSongs(url);
    for (const el of songs) {
        let div = document.createElement("div");
        div.classList.add("songNameDiv");
        div.innerHTML = '<a href=""></a><img src="/photos/music-icon.png";" alt="play"><p class="songPara">Happy - Samal</p><img class="playImg" src="/photos/play-icon.png";" alt="play"><p>Play Now</p>';
        div.querySelector("a").href = el.href;
        div.querySelector(".songPara").innerText = el.title;
        musicName.append(div);
        div.addEventListener("click", (evt) => {
            PlaySong(div);
        });
    }
}



const PlaySong = (div) => {
    let url = div.querySelector("a").href;
    playMusic(url, div);

    seekbar.addEventListener("click", (evt) => {
        let percent = (evt.offsetX / evt.target.getBoundingClientRect().width) * 100;
        seekPointer.style.left = percent + "%";
        currentSong.currentTime = (percent / 100) * currentSong.duration;
    });

    previousBtn.addEventListener("click", (evt) => {
        let divs = document.querySelectorAll(".songNameDiv");
        let urls = search();
        let index = urls.indexOf(currentSong.src);
        if (index - 1 >= 0) {
            playMusic(urls[index - 1], divs[index - 1]);
        }
    });

    nextBtn.addEventListener("click", (evt) => {
        let divs = document.querySelectorAll(".songNameDiv");
        let urls = search();
        let index = urls.indexOf(currentSong.src);
        if (index + 1 < urls.length) {
            playMusic(urls[index + 1], divs[index + 1]);
        }
    });
};

function playNextSong() {
    let divs = document.querySelectorAll(".songNameDiv");
    let urls = search();
    let index = urls.indexOf(currentSong.src);
    if (index + 1 < urls.length) {
        playMusic(urls[index + 1], divs[index + 1]);
    }
}

function search() {
    let divs = document.querySelectorAll(".songNameDiv");
    let as = [];
    for (const div of divs) {
        as.push(div.querySelector("a"));
    }
    let urls = [];
    for (const el of as) {
        urls.push(el.href);
    }
    return urls;
}

let borderReset = () => {
    let divs = document.querySelectorAll(".songNameDiv");
    for (const div of divs) {
        div.style.border = "2px solid #332757";
        let playImg = div.querySelector(".playImg");
        playImg.src = "/photos/play-icon.png";
        playImg.alt = "play";
    }
};

home.addEventListener("click", (evt) => {
    document.body.innerHTML = "";
    let div = document.createElement("div");
    div.innerHTML = "<h1>Happy Samal<h1>";
    div.classList.add("happy");
    document.body.append(div);
});

document.addEventListener('DOMContentLoaded', ()=> {
    if ('ontouchstart' in document.documentElement) {
        let folders = document.querySelectorAll('.folder');
        folders.forEach((el)=>{
            el.addEventListener('touchstart', (evt)=>{
                el.style.backgroundColor="#302065";
                el.style.border="2px solid #8167cf";
            });
        });
        let songNameDiv = document.querySelectorAll(".songNameDiv");
        songNameDiv.forEach((el)=>{
            el.addEventListener("touchstart",(evt)=>{
                el.style.border="2px solid #8167cf";
                el.style.cursor="pointer";
            })
        })
    }
});