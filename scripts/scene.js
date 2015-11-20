
var widthsegments = 10;
var heightsegments = 10;
function buildElevations( latStart, lngStart, latPoints, lngPoints) {
    var positions = [];
    // create an array of latlng objects
    for (var y=0;y<latPoints;y++) {
        var ym = y * 0.001;
        var curLat = latStart - ym;
        var curLat = round(curLat,7);
        for (var x=0;x<lngPoints;x++) {
            var xm = x * 0.001;
            var curLng = lngStart - xm;
            var curLng = round(curLng,7);
            var pos = new google.maps.LatLng(curLat,curLng);
            console.log(curLat+", "+curLng);
            positions.push(pos);

        }
    }

    var elev = [];

    var positions_latlng = { 'locations':positions };
    var elevationService = new google.maps.ElevationService();
    var geometry = new THREE.PlaneGeometry(70, 70, widthsegments-1, heightsegments-1);
    elevationService.getElevationForLocations(positions_latlng, function(results, status) {
        if (status == google.maps.ElevationStatus.OK) {
            if (results[0]) {
                for (var i=0;i<results.length;i++) {
                    var el = parseFloat(results[i].elevation.toFixed(4));
                    console.log(el);

                    var pos = results[i].location;
                    elev.push(el);
                    geometry.vertices[i].z = parseFloat(el);

                }

                makeplane(geometry);

            }
        }
    });
    console.log(elev.length);



}
function makeplane(geometry) {
    var material = new THREE.MeshPhongMaterial({
        color: 0xdddddd,
        wireframe: true
    });
   material = new THREE.MeshBasicMaterial( {color:0xffffff, map: THREE.ImageUtils.loadTexture( 'images/grass.jpg') } );

    //material = new THREE.MeshLambertMaterial( { color: 0x00ff00 } );
    //var geometry = new THREE.BoxGeometry( 50, 50, 1 );
    var plane_ = new THREE.Mesh(geometry, material);
    plane_.geometry.dynamic = true;

// changes to the vertices
    plane_.geometry.verticesNeedUpdate = true;

// changes to the normals
    plane_.geometry.normalsNeedUpdate = true;
   plane_.rotation.x=parseFloat(-90*0.0174533);
   // plane_.rotation.z=parseFloat(45*0.0174533);
  //plane_.position.y=-3;
    plane_.position.z=-20;
    plane_.position.y=-299;
    console.log(plane_.position);
    scene.add(plane_);
    //return plane_;
    render();
}
function round(value, decimals) {
    return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}
// actionable code begins here-------------------------------------------------

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.01, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

//var geometry = new THREE.BoxGeometry( 1, 1, 1 );
//var material = new THREE.MeshLambertMaterial( { color: 0x00ff00 } );
//var cube = new THREE.Mesh( geometry, material );
//scene.add( cube );

camera.position.z = 5;
var light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
scene.add( light );

var light2 = new THREE.AmbientLight( 0x404040 ); // soft white light
scene.add( light2 );

buildElevations( 41.7469857, -93.618275, widthsegments, heightsegments);



function render() {
    requestAnimationFrame( render );
    //cube.rotation.x += 0.01;
    //cube.rotation.y += 0.01;
    renderer.render( scene, camera );
}




