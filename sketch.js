var center = null, cercle = null, drawCircles = true;
var centers = [], avancee = [], points = [];
var zoom = 1, speed = 1, last;

function setup() {
    createCanvas(windowWidth, windowHeight);
    frameRate(1000);
    last = millis();
}

function draw() {
    background(0);

    translate(width / 2, height / 2);
    scale(zoom, zoom);
    translate( - width / 2, -height / 2);

    noFill();
    strokeWeight(1);
    stroke(255, 255, 255, 125);
    now = millis();
    let step = (10 * (now - last)) / (1000 * pow(2, centers.length));
    last = now;
    for (let i = 1; i < centers.length; i++)
    {
        centers[i].argument += step; //avancee / frequence[i]
        avancee *= 1.7;
    }

    let translateX = 0, translateY = 0;
    if (drawCircles && frameCount % parseInt(speed) == 0) {
        for (let i = 0; i < centers.length - 1; i++)
        {
            centre = centers[i];
            translateX += centre.getX();
            translateY += centre.getY();
            //push();
            translate(translateX, translateY);

            strokeWeight(5);
            point(0, 0);
            strokeWeight(3);
            line(-centre.getX(), -centre.getY(), 0, 0);
            strokeWeight(1);
            ellipse(0, 0, centers[i + 1].module * 2, centers[i + 1].module * 2);
            //pop();
        }
    }

    /*if (centers.length) {
        var tx = rayons[centers.length - 1].x;
        var ty = rayons[centers.length - 1].y;
        points.push(createVector(translateX + tx, translateY + ty));
        strokeWeight(5);
        point(tx, ty);
    }*/

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
}

function mouseWheel(e)
{
    if (e.delta > 0)
        zoom += 0.2;
    else
        zoom -= 0.2;

    zoom = constrain(zoom, 0.2, 4);
}

function mouseMoved()
{
    newCenter = createVector(mouseX, mouseY);
    cercle = [center, center.dist(newCenter)];
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
        centers.push(cartesienVersComplexe(center));
        center = newCenter;
        points = [];
    }
    cercle = null;
}
