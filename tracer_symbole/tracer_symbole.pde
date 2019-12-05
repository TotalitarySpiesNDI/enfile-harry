import java.util.*;

PImage fond;
List<PVector> points = new ArrayList<PVector>();

void setup()
{
   size(400, 400);
    strokeWeight(3);
    stroke(255);
   fond = loadImage("fond.png");
}

void draw()
{
  background(0);
  tint(255, 255, 255, 120);
  image(fond, 0, 0);
  for (int i = 1; i < points.size(); i++)
  {
    line(points.get(i - 1).x, points.get(i - 1).y, points.get(i).x, points.get(i).y);
  }
}

void keyPressed()
{
  if (key == 'd')
    getXY();
}

void getXY()
{
  List<Float> x = new ArrayList<Float>(), y = new ArrayList<Float>();
  
  for (PVector p : points) {
    x.add(p.x / width);
    y.add(p.y / height);
  }
  
  System.out.println("X\n" + x + "\n");
  System.out.println("Y\n" + y + "\n");
}

void mouseDragged()
{
  points.add(new PVector(mouseX, mouseY));
}
