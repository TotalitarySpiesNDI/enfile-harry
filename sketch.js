var center = null, cercle = null, drawCircles = true, reset = false;
var rayons = [], angles = [], points = [], frequences = [], isX = [], offset = [];
var zoom , speed = 1;

function createCircles(complexes)
{
    let rayons = [], angles = [], frequences = [];

    let i = 1;
    for (let c of complexes.slice(0, 2))
    {
        vect = createVector(c[0], c[1]);
        rayons.push(10 * vect.mag());
        angles.push(atan2(vect.y, vect.x));
        frequences.push(i++);
    }
    return [rayons, angles, frequences];
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
    canvas = createCanvas(windowWidth, 0.9 * windowHeight);
    canvas.parent('container');
    frameRate(1000);

    gererZoom();

    let zero = [
        [
    	[52.80275732768522,	3.554840146074072,	1	],
    	[61.57371374244089,	-0.25331723499582,	2	],
    	[70.84556595942144,	0.573584513848804,	3	],
    	[25.79775965568823,	-1.25504680819412,	4	],
    	[9.065201511498895,	1.479483468731541,	5	],
    	[10.04419511884058,	-0.41494272490242,	6	],
    	[0.884034597405031,	0.542235035796088,	7	],
    	[4.398941057279978,	0.279972490217058,	8	],
    	[1.206688828280607,	-0.71448425975047,	9	],
    	[1.665145262281476,	0.640427577289101,	10	],
    	[1.612694548866232,	-0.63702441955699,	11	],
    	[1.233199475661007,	0.134318364482278,	12	],
    	[1.274443947618680,	-0.78673452330336,	13	],
    	[0.496948379085990,	1.038131944079251,	14	],
    ],
    [
    	[60.90337392369704,	2.878075194304172,	1	],
    	[102.7554787579725,	3.573952066896512,	2	],
    	[20.52731305614782,	0.493285537931401,	3	],
    	[13.54438449784769,	0.603451265119053,	4	],
    	[12.04400111900243,	-0.81703438972499,	5	],
    	[3.904956190129332,	2.641890805031652,	6	],
    	[6.282889827221559,	-0.15917736879833,	7	],
    	[2.319888671931855,	3.833305793814664,	8	],
    	[3.208131261739943,	0.746440666532550,	9	],
    	[3.117429794689420,	-1.43876302706083,	10	],
    	[1.289624504862187,	2.318073185624593,	11	],
    	[1.523717511774538,	-0.69234139756297,	12	],
    	[1.012363613524345,	3.964701684349755,	13	],
    	[0.786716734424327,	-0.00220185166303,	14	],
    ]
];

    let quatre = [[
    [88.26861335390649,4.025077728087553,1],
    [ 53.78656292580754, 0.40663276045467334, 2 ],
    [ 30.324247495856927, 0.19083798642246638, 3 ],
    [ 3.9062714219721726, 2.087513901831077, 4 ],
    [ 10.520485917695074, -0.7716424388503551, 5],
    [ 7.539063174745894, -0.8692618859340405, 6],
    [ 6.332621852115295, 1.6738311326407116, 7],
    [ 3.44661774452008, -1.0806192077609056, 8],
    [ 4.865785823342462, 1.810144143287017, 9],
    [ 5.601933866180039, -0.2739374004208868, 10],
    [ 3.4928737389437754, -0.07483350631275212, 11],
    [ 2.2018110283022363, 3.9417867022880833, 12],
    [ 1.1830870939288143, 2.1800278293930937, 13 ],
    [ 1.4406313722218518, -0.031543777695570825, 14 ]
],
[
    [ 93.71562174294853, 2.8663064098163673, 1 ],
    [ 35.97367491307929, 4.250710354001485, 2 ],
    [ 32.981239081720986, 3.490790710921408, 3 ],
    [ 6.885972837312401, 4.008193069605024, 4 ],
    [ 13.594215756097679, 1.4725303035652177, 5],
    [ 4.538893636424327, 4.431066038212499, 6],
    [ 3.2801093524828673, -0.6881678089392308, 7],
    [ 4.946271106094789, 3.4131899324679016, 8],
    [ 3.1281127698716107, 0.8471728515840395, 9],
    [ 1.781947068649202, -0.7139675454371086, 10],
    [ 3.4048458056803788, 3.0007541405380986, 11],
    [ 2.609806239324134, -0.364966145519883, 12],
    [ 1.714332194965657, 2.3181061489957333, 13],
    [ 0.6979120970024156, 1.2016811393518327, 14 ]
],
[
    [88.26861335390649,4.025077728087553,1],
    [ 53.78656292580754, 0.40663276045467334, 2 ],
    [ 30.324247495856927, 0.19083798642246638, 3 ],
    [ 3.9062714219721726, 2.087513901831077, 4 ],
    [ 10.520485917695074, -0.7716424388503551, 5],
    [ 7.539063174745894, -0.8692618859340405, 6],
    [ 6.332621852115295, 1.6738311326407116, 7],
    [ 3.44661774452008, -1.0806192077609056, 8],
    [ 4.865785823342462, 1.810144143287017, 9],
    [ 5.601933866180039, -0.2739374004208868, 10],
    [ 3.4928737389437754, -0.07483350631275212, 11],
    [ 2.2018110283022363, 3.9417867022880833, 12],
    [ 1.1830870939288143, 2.1800278293930937, 13 ],
    [ 1.4406313722218518, -0.031543777695570825, 14 ]
],
    [
        [ 93.71562174294853, 2.8663064098163673, 1 ],
        [ 35.97367491307929, 4.250710354001485, 2 ],
        [ 32.981239081720986, 3.490790710921408, 3 ],
        [ 6.885972837312401, 4.008193069605024, 4 ],
        [ 13.594215756097679, 1.4725303035652177, 5],
        [ 4.538893636424327, 4.431066038212499, 6],
        [ 3.2801093524828673, -0.6881678089392308, 7],
        [ 4.946271106094789, 3.4131899324679016, 8],
        [ 3.1281127698716107, 0.8471728515840395, 9],
        [ 1.781947068649202, -0.7139675454371086, 10],
        [ 3.4048458056803788, 3.0007541405380986, 11],
        [ 2.609806239324134, -0.364966145519883, 12],
        [ 1.714332194965657, 2.3181061489957333, 13],
        [ 0.6979120970024156, 1.2016811393518327, 14 ]
]];


    points.push([]);
    points.push([]);
    points.push([]);
    for (let arg of quatre)
    {
        res = createCirclesMagAngle(arg);
        rayons.push(res[0]);
        angles.push(res[1]);
        frequences.push(res[2]);
        points.push([]);
    }

    for (let arg of zero)
    {
        res = createCirclesMagAngle(arg);
        rayons.push(res[0]);
        angles.push(res[1]);
        frequences.push(res[2]);
        points.push([]);
    }

    isX = [true, false, true, false, true, false];
    let unitH = 600, unitW = 850;
    offset = [
        createVector(- unitW / 2, - unitH / 2),
        createVector(- 3 * unitW / 2, unitH / 2),
        createVector( unitW, 5 * unitH / 3),
        createVector( 2 * unitW, unitH / 2),
        createVector(unitW / 4, 5 * unitH / 3),
        createVector(unitW / 4, unitH / 2)
    ];
}

function draw() {
    if (frameCount % parseInt(speed) == 0) background(0);

    let transparencyCircle = min(255, map(frameCount, 150, 250, 0, 255));

    translate(width / 2, height / 2);
    scale(zoom, zoom);
    translate( - width / 2, -height / 2);

    noFill();
    strokeWeight(1);
    stroke(255, 255, 255, 125);
    //let avancee = (5 * millis()) / (1000 * pow(2, centers.length));

    let time = millis() / 1000;
    let translateX = [], translateY = [];
    for (let n = 0; n < rayons.length; n++)
    {
        r = rayons[n];
        a = angles[n];
        translateX.push(0);
        translateY.push(0);

        for (let i = 0; i <= r.length; i++)
        {
            freq = frequences[n][i - 1];
            if (i) {
                coeff = n == 2 || n == 3 ? -1 : 1;
                var dx = (isX[n] ? cos : sin)(coeff * i * time - a[i - 1]) * r[i - 1] / 5;
                var dy = (isX[n] ? sin : cos)(coeff * i * time - a[i - 1]) * r[i - 1] / 5;
                translateX[n] += dx
                translateY[n] += dy
            }
            else
            {
                translateX[n] = offset[n].x;
                translateY[n] = offset[n].y;
            }
            push();
            translate(translateX[n], translateY[n]);

            if (n != 5 && drawCircles && i < r.length - 1 && frameCount > 150) {
                stroke(255, 255, 255, transparencyCircle);
                strokeWeight(5);
                point(0, 0);
                if (typeof dx != "undefined") {
                    strokeWeight(3);
                    line(-dx, -dy, 0, 0);
                }
                strokeWeight(3);
                ellipse(0, 0, r[i] * 2 / 5, r[i] * 2 / 5);
            }

            pop();
        }
    }

    if (rayons.length) {
        var x = [], y = [];
        for (let i = 0; i < translateX.length; i++)
        {
            points[i].push(createVector(translateX[i], translateY[i]));
        }
        points[translateX.length].push(createVector(translateX[0], translateY[1]));
        points[translateX.length + 1].push(createVector(translateX[2], translateY[3]));
        points[translateX.length + 2].push(createVector(translateX[4], translateY[5]));
    }

    for (let i = 0; i < points.length; i++)
    {
        if (points[i].length > 240)
            points[i] = points[i].slice(1);
    }
    if (points.length)
    {
        derniersPoints = []
        for (let n = 0; n < 9; n++)
            derniersPoints.push(points[n][points[n].length - 1]);

        strokeWeight(4);

        if (drawCircles && frameCount > 150) {
            stroke(200, 200, 200, min(transparencyCircle, 180));
            line(derniersPoints[0].x, derniersPoints[0].y, derniersPoints[6].x, derniersPoints[6].y);
            line(derniersPoints[1].x, derniersPoints[1].y, derniersPoints[6].x, derniersPoints[6].y);

            line(derniersPoints[2].x, derniersPoints[2].y, derniersPoints[7].x, derniersPoints[7].y);
            line(derniersPoints[3].x, derniersPoints[3].y, derniersPoints[7].x, derniersPoints[7].y);


            stroke(200, 200, 150, min(180, transparencyCircle));
            line(derniersPoints[4].x, derniersPoints[4].y, derniersPoints[8].x, derniersPoints[8].y);
        }

        for (let n = 0; n < 5 && !drawCircles; n++)
        {
            for (let i = 0; i < 50 && i < points[n].length - 1; i++)
            {
                strokeWeight(8);
                let c1 = points[n][points[n].length - i - 1], c2 = points[n][points[n].length - i - 2];

                let trs = map(i, 0, 50, 125, 0);

                stroke(0x22, 0xba, 0xba, trs);
                line(c1.x, c1.y, c2.x, c2.y);
            }
        }

        for (let n = 6; n < 9; n++)
        {
            for (let i = 1; i < points[n].length; i++)
            {
                strokeWeight(8);
                let c1 = points[n][i - 1], c2 = points[n][i];

                let trs = 255;
                if (i < 80)
                    trs = map(i, 0, 80, 0, 255);

                if (n == 0)
                    stroke(0x22, 0xba, 0xba, trs);
                else if (n == 1)
                    stroke(0xba, 0xba, 0x22, trs);
                else if (n >= 2)
                    stroke(0xba, 0x22, 0xba, trs);

                line(c1.x, c1.y, c2.x, c2.y);
            }
        }
    }

    //filter(BLUR, 2);
}

/*function mouseWheel(e)
{
    if (e.delta > 0)
        zoom *= 0.8;
    else
        zoom *= 1.4;

    zoom = constrain(zoom, 0.05, 10);

    //console.log(e, zoom);
}
*/

function gererZoom()
{
    zoomX = ((windowWidth * 0.8) / 1240) * 0.40;
    zoomY = ((windowHeight * 0.8) / 600) * 0.22;
    zoom = min(zoomX, zoomY);
}
function windowResized() {
  resizeCanvas(0.9 * windowWidth, 0.9 * windowHeight);

  gererZoom();
}


function mouseMoved()
{
    if (!reset) return;
    newCenter = createVector(mouseX, mouseY);
    cercle = [center, center.dist(newCenter)];
    //center = newCenter;
}


function touchEnded()
{
    drawCircles = ! drawCircles;
}

function keyPressed()
{
    if (key == ' ')
        drawCircles = ! drawCircles;

    speed = constrain(speed, 0.05, 10);
}
