let scene, camera, renderer;
let player, monsters=[];
let health = 100;
let score = 0;
let playerName="";

function startGame(){
    playerName = document.getElementById("playerName").value || "Brave Child";

    document.getElementById("startScreen").style.display="none";
    document.getElementById("gameUI").style.display="block";

    initGame();
}

// 🎮 INIT 3D WORLD
function initGame(){
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x000000,10,60);

    camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000);
    camera.position.set(0,5,10);

    renderer = new THREE.WebGLRenderer({canvas:document.getElementById("gameCanvas")});
    renderer.setSize(window.innerWidth,window.innerHeight);

    // 🌑 dark light
    const light = new THREE.DirectionalLight(0xffffff,0.5);
    light.position.set(0,20,10);
    scene.add(light);

    const ambient = new THREE.AmbientLight(0x404040);
    scene.add(ambient);

    // 🌍 ground
    const groundGeo = new THREE.PlaneGeometry(200,200);
    const groundMat = new THREE.MeshStandardMaterial({color:0x111111});
    const ground = new THREE.Mesh(groundGeo,groundMat);
    ground.rotation.x = -Math.PI/2;
    scene.add(ground);

    // 👧 player (temporary box, later girl model)
    const geo = new THREE.BoxGeometry(1,2,1);
    const mat = new THREE.MeshStandardMaterial({color:0xff69b4});
    player = new THREE.Mesh(geo,mat);
    player.position.y=1;
    scene.add(player);

    spawnMonsters();

    animate();
}

// 💀 spawn skeleton monsters
function spawnMonsters(){
    for(let i=0;i<5;i++){
        const geo = new THREE.BoxGeometry(1.5,2,1.5);
        const mat = new THREE.MeshStandardMaterial({color:0xffffff});
        let m = new THREE.Mesh(geo,mat);
        m.position.set(Math.random()*20-10,1,Math.random()*-20);
        scene.add(m);
        monsters.push(m);
    }
}

// ⚔️ attack
document.getElementById("attackBtn").onclick = ()=>{
    monsters.forEach((m,index)=>{
        if(player.position.distanceTo(m.position)<3){
            scene.remove(m);
            monsters.splice(index,1);
            score+=10;
            document.getElementById("score").innerText=score;
        }
    });
};

// 🎮 movement mobile + keyboard
window.addEventListener("keydown",(e)=>{
    if(e.key==="ArrowUp") player.position.z-=0.5;
    if(e.key==="ArrowDown") player.position.z+=0.5;
    if(e.key==="ArrowLeft") player.position.x-=0.5;
    if(e.key==="ArrowRight") player.position.x+=0.5;
});

// 🧠 game loop
function animate(){
    requestAnimationFrame(animate);

    // monsters follow player
    monsters.forEach(m=>{
        m.lookAt(player.position);
        m.position.x += (player.position.x - m.position.x)*0.002;
        m.position.z += (player.position.z - m.position.z)*0.002;

        if(player.position.distanceTo(m.position)<1.5){
            health -= 0.05;
            document.getElementById("health").innerText=Math.floor(health);

            if(health<0){
                alert(playerName+" was captured by darkness…");
                location.reload();
            }
        }
    });

    renderer.render(scene,camera);
}
