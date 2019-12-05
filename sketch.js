var center = null, cercle = null, drawCircles = true;
var centers = [], rayons = [], avancee = [], points = [];
var zoom = 1, speed = 1;

function setup() {
    createCanvas(windowWidth, windowHeight);
    frameRate(1000);
}

function draw() {
    if (frameCount % parseInt(speed) == 0) background(0);

    translate(width / 2, height / 2);
    scale(zoom, zoom);
    translate( - width / 2, -height / 2);

    noFill();
    strokeWeight(1);
    stroke(255, 255, 255, 125);
    let avancee = (10 * millis()) / (1000 * pow(2, centers.length));
    let translateX = 0, translateY = 0;
    for (let i = 0; i < centers.length; i++)
    {

        if (i) {
            var dx = cos(avancee) * rayons[i - 1];
            var dy = sin(avancee) * rayons[i - 1];
            translateX += dx
            translateY += dy
        }
        else
        {
            translateX = centers[0].x;
            translateY = centers[0].y;
        }
        push();
        translate(translateX, translateY);

        if (drawCircles && frameCount % parseInt(speed) == 0) {
            strokeWeight(5);
            point(0, 0);
            if (typeof dx != "undefined") {
                strokeWeight(3);
                line(-dx, -dy, 0, 0);
            }
            strokeWeight(1);
            ellipse(0, 0, rayons[i] * 2, rayons[i] * 2);
        }

        avancee *= 1.7;
        pop();
    }

    if (centers.length) {
        var tx = cos(avancee) * rayons[centers.length - 1];
        var ty = sin(avancee) * rayons[centers.length - 1];
        points.push(createVector(translateX + tx, translateY + ty));
        strokeWeight(5);
        point(tx, ty);
    }

    if (points.length > 2000)
        points = points.slice(1);
    points.add

    if (center) {
        strokeWeight(5);
        point(0, 0);
    }

    if (cercle) {

    /*    rayon = centers.length ? centers[centers.length - 1].dist(createVector(mouseX - rayons[centers.length - 1], mouseY)) : center.dist(createVector(mouseX, mouseY));
        stroke(255, 255, 0);
        strokeWeight(1);
        ellipse(centers.length ? rayons[centers.length - 1] : 0, 0, rayon * 2, rayon * 2);*/

        strokeWeight(5);
        point(mouseX, mouseY);

    }

    if (points.length && frameCount % parseInt(speed) == 0)
    {
        for (let i = 1; i < points.length; i++)
        {
            strokeWeight(2);
            stroke(0x22, 0xba, 0xba);
            let c1 = points[i - 1], c2 = points[i];
            line(c1.x, c1.y, c2.x, c2.y);
        }
    }

    //filter(BLUR, 2);
}

function mouseWheel(e)
{
    if (e.delta > 0)
        zoom += 0.2;
    else
        zoom -= 0.2;

    zoom = constrain(zoom, 0.2, 4);

    //console.log(e, zoom);
}

function mouseMoved()
{
    newCenter = createVector(mouseX, mouseY);
    cercle = [center, center.dist(newCenter)];
    //center = newCenter;
}

function keyPressed()
{
    if (key == ' ')
        drawCircles = ! drawCircles;
    else if (key == 'l')
        speed *= 2;
    else if (key == 'k')
        speed *= 0.5;

    speed = constrain(speed, 0.25, 10);
}

function mouseReleased()
{
    if (center == null)
        center = createVector(mouseX, mouseY);
    else {
        newCenter = createVector(mouseX, mouseY);
        centers.push(center);
        rayons.push(center.dist(newCenter));
        center = newCenter;
        points = [];
    }
    cercle = null;
}
