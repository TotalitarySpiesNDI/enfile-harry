/*
* Code permettant le dessin du code d'erreur "404" grâce à des cycloïdes.
* Responsive et (presque) intéractif
*/

// Définition et instanciation des variables (elles sont globales de par le fonctionnement de p5)

// Variables utilisée pour l'interaction utilisateur et l'affichage
var center = null, cercle = null, drawCircles = true, reset = false, zoom , speed = 1;
/* Caractéristiques des différents cycloïdes : tableaux à deux dimensions [Nombre de cycloïdes][Nombre de cercles par cycloïde]
* rayons : rayon de chaque cercle (module du coefficient de Fourier)
* angle : angles de chaque cercle (phase ou argument du coeff de Fourier)
* frequences : fréquence de rotation pour chaque cercle (= fréquence correspondant au coeff de Fourier)
* points : trace des dernières positions du bout d'un cycloïdes + des points des 4 et du 0
*/
var rayons = [], angles = [], points = [], frequences = [];
/*
* isX : tableau de booléen permettant de savoir si le cycloïde représente l'abscisse ou l'ordonnée d'un dessin
* offset : tableau de points permettant de situer les cycloïdes sur la page (le dessin correspondant est relatif aux cycloïdes)
*/
var isX = [], offset = [];


//Fonction permettant de créer les tableaux d'un cycloîde à partir des coefficients de Fourier sous forme complexe
function createCircles(complexes)
{
    let rayons = [], angles = [], frequences = [];

    let i = 1;
    for (let c of complexes.slice(0, 2))
    {
        // Le complexe c = a + ib est représenté par un tableau [a, b]
        vect = createVector(c[0], c[1]);
        // On ajoute le module du complexe amplifié pour qu'on voit qqchose
        rayons.push(10 * vect.mag());
        // On ajoute l'argument du complexe
        angles.push(vect.heading());
        //On assume que les coefficients fournis correspondent aux fréquences [1, n]
        frequences.push(i++);
    }
    return [rayons, angles, frequences];
}

// Créer les tableaux d'un cycloïde à partir des coeff de Fourier sous forme [module, argument, fréquence correspondante]
function createCirclesMagAngle(magAngle)
{
    let rayons = [], angles = [], frequences = [];

    for (let ma of magAngle)
    {
        //On ajoute le coefficient et la fréquence correspondante, en amplifiant aussi le module
        rayons.push(2 * ma[0]);
        angles.push(ma[1]);
        frequences.push(ma[2]);
    }
    return [rayons, angles, frequences];
}

// Fonction appelée par p5 pour initialiser le programme
function setup() {
    //On créer le canvas où l'on dessine, dans le container prévu à cet effet
    canvas = createCanvas(windowWidth, 0.9 * windowHeight);
    canvas.parent('container');

    //On met à jour le zoom en fonction de la taille de la fenêtre
    gererZoom();

    // Coefficient sous forme module, argument, fréquence du zero (Cycloïde x puis y)
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
    // Coefficient sous forme module, argument, fréquence des 4 (Cycloïde x puis y)
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


    //On "alloue" 3 tableaux supplémentaires pour les 3 dessins
    points.push([]);
    points.push([]);
    points.push([]);

    //On crée les cycloïdes à partir des coefficients de Fourier
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

    //On initialise les infirmations sur les cycloïdes
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

//Fonction appelée par p5 pour actualiser l'affichage
function draw() {
    // On efface tout
    background(0);

    //
    let transparencyCircle = min(255, map(frameCount, 150, 250, 0, 255));

    // On fait un zoom centré, d'un facteur `zoom`
    translate(width / 2, height / 2);
    scale(zoom, zoom);
    translate( - width / 2, -height / 2);

    //On définit les caractéristiques de dessin des cycloïdes
    noFill();
    strokeWeight(1);
    stroke(255, 255, 255, 125);

    // Variable d'avancement du temps
    let time = millis() / 1000;
    // Tableaux permettant, à chaque boucle et au final, de savoir la position du centre du cercle n de chaque cycloïde
    let translateX = [], translateY = [];
    // Pour chaque cycloïde
    for (let n = 0; n < rayons.length; n++)
    {
        // Tableaux de rayons, d'angles et de fréquences des cercles
        r = rayons[n];
        a = angles[n];
        f = frequences[n];
        translateX.push(0);
        translateY.push(0);

        // Pour chaque cercle du cycloïde
        for (let i = 0; i <= r.length; i++)
        {
            freq = f[i - 1];
            // Si le cercle n'est pas le premier, on calcule la position de son centre (qui est en rotation sur le cercle précédent)
            if (i) {
                // Effet de style pour le deuxième 4 (cycloïdes 2 et 3) : on inverse le sens de rotation (on aurait aussi pu dephaser tous les cercles)
                coeff = n == 2 || n == 3 ? -1 : 1;
                // On calcule la position du centre du cercle i par rapport au cercle i - 1
                var dx = (isX[n] ? cos : sin)(coeff * i * time - a[i - 1]) * r[i - 1];
                var dy = (isX[n] ? sin : cos)(coeff * i * time - a[i - 1]) * r[i - 1];
                translateX[n] += dx
                translateY[n] += dy
            }
            else
            {
                translateX[n] = offset[n].x;
                translateY[n] = offset[n].y;
            }
            // Le centre du cercle est notre origine
            push();
            translate(translateX[n], translateY[n]);

            /* On n'affiche le cercle que si :
             *  - Ce n'est pas le cycloïde y du 0 (pas de place graphiquement)
             *  - L'utilisateur a demandé à voir les cercles (oui par défaut)
             *  - On n'est pas au dernier cercle (qui n'est techniquement pas un cercle mais juste un point)
             *  - On a fait 150 itérations d'affichage (animation du début)
            */
            if (n != 5 && drawCircles && i < r.length - 1 && frameCount > 150) {
                // Les cercles sont blancs (avec une animation de transparence au début) et plutöt épais
                stroke(255, 255, 255, transparencyCircle);
                strokeWeight(5);

                // Centre du cercle (origine)
                point(0, 0);
                // Si on n'est pas au premier cercle, affichage du trait reliant le centre du cercle i au centre du cercle i - 1
                if (i) {
                    strokeWeight(3);
                    line(-dx, -dy, 0, 0);
                }
                // On dessine le cercle un peu moins épais (les deux derniers paramètres sont les diamètres a et b d'une ellipse)
                strokeWeight(3);
                ellipse(0, 0, r[i] * 2, r[i] * 2);
            }

            // On réinitialise les translations (depuis le dernier push())
            pop();
        }
    }

    // Si on a des cycloïdes
    if (rayons.length) {
        // On garde la trace de chaque cycloïde
        var x = [], y = [];
        for (let i = 0; i < translateX.length; i++)
        {
            points[i].push(createVector(translateX[i], translateY[i]));
        }
        // On crée les chiffres à partir des positions des bons cycloïdes
        points[translateX.length].push(createVector(translateX[0], translateY[1]));
        points[translateX.length + 1].push(createVector(translateX[2], translateY[3]));
        points[translateX.length + 2].push(createVector(translateX[4], translateY[5]));
    }

    // Pour chaque trace, on limite à 240 points
    for (let i = 0; i < points.length; i++)
    {
        if (points[i].length > 240)
            points[i] = points[i].slice(1);
    }

    // Si on a des traces
    if (points.length)
    {
        // On récupère les traces des cycloïdes et des chiffres
        derniersPoints = []
        for (let n = 0; n < 9; n++)
            derniersPoints.push(points[n][points[n].length - 1]);

        strokeWeight(4);

        // Si on doit dessiner les cycloïdes
        if (drawCircles && frameCount > 150) {
            // On dessine les traits liants les cycloïdes aux chiffres, en gardant un peu de transparence pour laisser le devant aux chiffres
            stroke(200, 200, 200, min(transparencyCircle, 180));
            line(derniersPoints[0].x, derniersPoints[0].y, derniersPoints[6].x, derniersPoints[6].y);
            line(derniersPoints[1].x, derniersPoints[1].y, derniersPoints[6].x, derniersPoints[6].y);

            line(derniersPoints[2].x, derniersPoints[2].y, derniersPoints[7].x, derniersPoints[7].y);
            line(derniersPoints[3].x, derniersPoints[3].y, derniersPoints[7].x, derniersPoints[7].y);


            stroke(200, 200, 150, min(180, transparencyCircle));
            line(derniersPoints[4].x, derniersPoints[4].y, derniersPoints[8].x, derniersPoints[8].y);
        }

        // On dessine les traces des cycloïdes (sauf pour le cycloïde y du 0) seulement si les cycloïdes sont invisibles
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

        //On affiche les chiffres
        for (let n = 6; n < 9; n++)
        {
            for (let i = 1; i < points[n].length; i++)
            {
                strokeWeight(8);
                let c1 = points[n][i - 1], c2 = points[n][i];

                let trs = 255;
                if (i < 80)
                    trs = map(i, 0, 80, 0, 255);

                stroke(0xba, 0x22, 0xba, trs);

                line(c1.x, c1.y, c2.x, c2.y);
            }
        }
    }
}

// Ancienne fonction pour zoomer (interdit en version finale)
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

// Permet de gerer le zoom en fct de la taille de la fenêtre
function gererZoom()
{
    zoomX = ((windowWidth * 0.8) / 1240) * 0.40;
    zoomY = ((windowHeight * 0.8) / 600) * 0.22;
    zoom = min(zoomX, zoomY);
}
// Gère le changement de taile de la fenêtre
function windowResized() {
  resizeCanvas(0.9 * windowWidth, 0.9 * windowHeight);

  gererZoom();
}

//Ancienne fonction pour créer un nouveau cercle
function mouseMoved()
{
    if (!reset) return;
    newCenter = createVector(mouseX, mouseY);
    cercle = [center, center.dist(newCenter)];
    //center = newCenter;
}

// Sur appareil tactile, pour voir ou non les cercles
function touchEnded()
{
    drawCircles = ! drawCircles;
}

// Sur ordi c'est la touche espace
function keyPressed()
{
    if (key == ' ')
        drawCircles = ! drawCircles;
}
