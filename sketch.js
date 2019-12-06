var center = null, cercle = null, drawCircles = true;
var rayons = [], angles = [], points = [], frequences = [];
var zoom = 1, speed = 1;

function createCircles(complexes)
{
    let rayons = [], angles = [];

    for (let c of complexes)
    {
        vect = createVector(c[0], c[1]);
        rayons.push(10 * vect.mag());
        angles.push(vect.heading());
    }
    return [rayons, angles];
}

function createCirclesMagAngle(magAngle)
{
    let rayons = [], angles = [], frequences = [];

    for (let ma of magAngle)
    {
        rayons.push(10  * ma[0]);
        angles.push(ma[1]);
        frequences.push(ma[2]);
    }
    return [rayons, angles, frequences];
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    frameRate(1000);

    let cercleComplexe = [[
            [3.00000000000000, + 0.00000000000000],
            [-1.41137038857682, + 1.18428037250934],
            [-2.77555756156289e-17, - 6.16790569236198e-17],
            [-0.222222222222222, - 0.384900179459750],
            [-3.70074341541719e-17, + 0.00000000000000],
            [.0889621721272462, - 0.0323795826299840],
            [0.00000000000000, + 0.00000000000000],
            [-0.0109251168837614, - 0.0619594167600749],
            [9.86864910777917e-17, + 0.00000000000000]
        ],
        [
            [4.00000000000000, + 0.00000000000000],
            [-1.52248149968793, - 1.81442279691131],
            [-9.86864910777917e-17, - 3.08395284618099e-17],
            [-0.333333333333333, + 0.192450089729875],
            [6.16790569236198e-18, - 1.23358113847240e-17],
            [-0.0221489389838650, - 0.0608537097230471],
            [-2.46716227694479e-17, + 3.70074341541719e-17],
            [-0.122036227994873, + 0.0215182796193858],
            [9.86864910777917e-17, + 1.97372982155583e-16]
        ]
    ];
    cercleComplexe = [[
            [3.00000000000000, + 0.00000000000000],
            [-1.41137038857682, + 1.18428037250934],
            [-2.77555756156289e-17, - 6.16790569236198e-17],
            [-0.222222222222222, - 0.384900179459750],
            [-3.70074341541719e-17, + 0.00000000000000],
            [.0889621721272462, - 0.0323795826299840],
            [0.00000000000000, + 0.00000000000000],
            [-0.0109251168837614, - 0.0619594167600749],
            [9.86864910777917e-17, + 0.00000000000000]
        ],
        [
            [4.00000000000000, + 0.00000000000000],
            [-1.52248149968793, - 1.81442279691131],
            [-9.86864910777917e-17, - 3.08395284618099e-17],
            [-0.333333333333333, + 0.192450089729875],
            [6.16790569236198e-18, - 1.23358113847240e-17],
            [-0.0221489389838650, - 0.0608537097230471],
            [-2.46716227694479e-17, + 3.70074341541719e-17],
            [-0.122036227994873, + 0.0215182796193858],
            [9.86864910777917e-17, + 1.97372982155583e-16]
        ]
    ];


    let magAngles = [
        [
            [6, 0],
            [3, -60 / 180 * PI],
            [0, 0],
            [2, 0]
        ],
        [

        ]
    ];
    magAngles = [
        [
            [6, 0, 1],
            [3, -60 / 180 * PI, 2],
            [2, 0, 4],
            [0, 0, 5]
        ],
        [
            [6, 0, 1],
            [3, 120 / 180 * PI, 2],
            [2, 0, 4],
            [0, 0, 5]
        ]
    ];

    for (let arg of magAngles)
    {
        res = createCirclesMagAngle(arg);
        rayons.push(res[0]);
        angles.push(res[1]);
        frequences.push(res[2]);
        points.push([]);
    }
}

function draw() {
    if (frameCount % parseInt(speed) == 0) background(0);

    translate(width / 2, height / 2);
    scale(zoom, -zoom);
    translate( - width / 2, -height / 2);

    noFill();
    strokeWeight(1);
    stroke(255, 255, 255, 125);
    //let avancee = (5 * millis()) / (1000 * pow(2, centers.length));

    let time = millis() / 5000;
    let translateX = [], translateY = [];
    for (let n = 0; n < rayons.length; n++)
    {
        r = rayons[n];
        a = angles[n];
        translateX.push(n ? width / 2 : width / 4);
        translateY.push(n ? height / 4 :  height / 2);

        for (let i = 0; i < r.length; i++)
        {
            freq = frequences[n][i - 1];
            if (frameCount % 100 == 0) console.log(n, i, freq);
            if (i) {
                var dx = cos(2 * PI * freq * time + a[i - 1]) * r[i - 1];
                var dy = sin(2 * PI * freq * time + a[i - 1]) * r[i - 1];
                translateX[n] += dx
                translateY[n] += dy
            }
            else
            {
                translateX[n] = n ? width / 2 : width / 4;
                translateY[n] = n ? height / 4 :  height / 2;
            }
            push();
            translate(translateX[n], translateY[n]);

            if (drawCircles) {
                strokeWeight(5);
                point(0, 0);
                if (typeof dx != "undefined") {
                    strokeWeight(3);
                    line(-dx, -dy, 0, 0);
                }
                strokeWeight(1);
                ellipse(0, 0, r[i] * 2, r[i] * 2);
            }

            pop();
        }
    }

    if (rayons.length) {
        var x = [], y = [];
        for (let i = 0; i < 2; i++)
        {
            x[i] = cos(2 * PI * rayons[i].length * time + angles[i][rayons[i].length - 1]) * rayons[i][rayons[i].length - 1];
            y[i] = sin(2 * PI * rayons[i].length * time + angles[i][rayons[i].length - 1]) * rayons[i][rayons[i].length - 1];
            point(x[i], y[i]);
            points[i].push(createVector(translateX[i] + x[i], translateY[i] + y[i]));
        }
        strokeWeight(5);
    }

    if (points.length > 2000)
        points = points.slice(1);

    if (center) {
        strokeWeight(5);
        point(0, 0);
    }

    if (points.length)
    {
        for (let n = 0; n < 2; n++)
        {
            if (n == 0)
                stroke(0x22, 0xba, 0xba);
            else
                stroke(0xba, 0xba, 0x22);

            for (let i = 1; i < points[n].length; i++)
            {
                strokeWeight(2);
                let c1 = points[n][i - 1], c2 = points[n][i];
                line(c1.x, c1.y, c2.x, c2.y);
            }
        }
    }

    if (cercle && centers.length) {
        rayon = p5.vector.add(createVector(tx, ty), centers[centers.length - 1]).dist(createVector(mouseX, mouseY));
        stroke(255, 255, 0);
        strokeWeight(1);
        ellipse(centers[centers.length - 1].x, centers[centers.length - 1].y, rayon * 2, rayon * 2);

        resetMatrix();
        strokeWeight(5);

        point(mouseX, mouseY);

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

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
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
