import { Particle, Circle, Pt, Num, Line, Group } from "pts";
import { addToWorld, space, edges, form } from "./world.service";
import { allCircles } from "./game.service";

const CIRCLE_MASS = 1;
const DIST_OFFSET = 15;


function getRandomPoint(){
    const point = new Pt({
        x: Num.randomRange(DIST_OFFSET, space.size.x - DIST_OFFSET),
        y: Num.randomRange(DIST_OFFSET, space.size.y - DIST_OFFSET)
    });


    const isInAnotherCircle = allCircles.some((circle) => {

        const circleWithBorder = Circle.fromCenter(circle.point, circle.particle.radius);

        const isWithin = Circle.withinBound(circleWithBorder, point);

        return isWithin;
    });



    return isInAnotherCircle ? getRandomPoint() : point;
}

function createParticle(pt, radius){
    const particle = new Particle(pt);
    particle.radius = radius;
    particle.mass = CIRCLE_MASS;

    return particle;
}

function getClosestDistance(pt){

    const edgeDistances = edges.map((edge) => Line.distanceFromPt(edge, pt));

    const circleDistances = allCircles.map((circle) => {

        const lineFromCircleToPt = new Group(circle.point, pt);
        window.lineFrom = lineFromCircleToPt;

        const intersectOnCircle = Circle.intersectLine2D(circle.circle, lineFromCircleToPt);
        window.intersectOn = intersectOnCircle;

        const subt = pt.$subtract(intersectOnCircle[0]);
        const dist = subt.magnitude();

        return dist;
    });

    const closest = edgeDistances.concat(circleDistances).sort((a, b) => a - b);

    return closest[0];
}

const colors = ["ffa630","6124d4","90d909","db3b53","66d7d1"];
function getRandomColor(idx){
    return '#' + colors[idx - 1];
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }

export function createCircle(hitPoints){

    const point = getRandomPoint();

    const radius = getClosestDistance(point);

    const circle = Circle.fromCenter(point, radius);

    const particle = createParticle(point, radius);

    const color = getRandomColor(hitPoints);

    const rotation = getRandomArbitrary(-30, 30);
    addToWorld(particle);

    return {
        point,
        circle,
        particle,
        game: {
            hitPoints
        },
        render: {
            color,
            rotation
        }
    }
}