import { form, space, edges } from "./world.service";
import { launchCircle, allCircles } from "./game.service";
import { Rectangle, Line, Group, Circle } from "pts";

export function renderLaunchCircle(){
    form.strokeOnly(launchCircle.render.color, launchCircle.width).point(launchCircle.point, launchCircle.radius, 'circle');
}

export function renderCircles(){
    allCircles.forEach((circle, i) => {

        let { color } = circle.render;

        const textSize = circle.particle.radius * 0.9;
        const strokeSize = textSize * 0.1;

        form.strokeOnly(color, strokeSize).point( circle.point, circle.particle.radius - (strokeSize / 2), "circle" );

        const ptCenterText = Rectangle.fromCenter(circle.point, textSize);

        form.strokeOnly('white', 1).rect(ptCenterText);

        form.fill(color).font(textSize).alignText('center').textBox(ptCenterText, circle.game.hitPoints);
    });
}

function distanceFromPt(pt, pt2 = launchCircle.point){
    return pt2.$subtract(pt).magnitude();
}

function getClosestCircleIntersections(line){
    let closestIntersection, closestCircle;
    allCircles.forEach(circle => {
        const intersections = Circle.intersectLine2D(circle.circle, line);
        intersections.forEach(intersect => {
            if(!closestIntersection || (distanceFromPt(intersect) < distanceFromPt(closestIntersection))){
                closestIntersection = intersect;
                closestCircle = circle;
            }
        });
    });

    return [closestIntersection, closestCircle];
}

function getReflectedLineFromCircle(line, closestIntersection, closestCircle){
    const intersectPt = closestIntersection.clone();
    const fromCenterToIntersect = new Group(closestCircle.point, intersectPt).scale(1.5);
    const finalLine = buildWholeGuideLine(line, closestIntersection, fromCenterToIntersect);

    return finalLine;
}

function getWallIntersection(line, isRay, should){

    let intersectPt, intersectedWall;
    edges.forEach(edge => {
        const intersection = Line.intersectLine2D(line, edge.line, should);
        if(edge.direction !== 'bottom' && intersection){
            intersectPt = intersection.clone();
            intersectedWall = edge;
        }
    });

    return [intersectPt, intersectedWall];
}

function getSmallReflectedPoint(line, intersectPt, perpendicular){

    const reflected = line.clone();
    reflected.reflect2D(perpendicular);

    const intersectCircle = Circle.fromCenter(intersectPt, 60);
    const endOfReflectedLine = Circle.intersectLine2D(intersectCircle, reflected)[1];

    return endOfReflectedLine;
}

function getReflectedLineFromWall(line, intersectPt, intersectedWall){

    const isSideWall = intersectPt.x === 0 || intersectPt.x === space.size.x;
    const pointAcrossIntersection = intersectPt.clone();
    pointAcrossIntersection[isSideWall ? 'x' : 'y'] = (isSideWall ? space.size.x / 2 : 0);

    const perpendicular = Group.fromArray([intersectPt, pointAcrossIntersection]);
    const finalLine = buildWholeGuideLine(line, intersectPt, perpendicular);

    return finalLine;
}

function buildWholeGuideLine(line, intersectPt, perpendicular){

    const endOfReflectedLine = getSmallReflectedPoint(line, intersectPt, perpendicular);

    const finalLine = Group.fromArray([launchCircle.point, intersectPt, endOfReflectedLine]);

    return finalLine;
}

export function renderLauncherGuide(){
    const line = new Group(launchCircle.point, space.pointer).scale(10);

    const [closestIntersection, closestCircle] = getClosestCircleIntersections(line);

    let ballProjectionPt = closestIntersection;
    let calculatedLine = line;

    if(closestCircle){
        calculatedLine = getReflectedLineFromCircle(line, closestIntersection, closestCircle);
    } else {
        const [mwallIntersectionPt, mintersectedWall] = getWallIntersection(line);

        if(!mintersectedWall){

            debugger;

        }

        const [wallIntersectionPt, intersectedWall] = getWallIntersection(line, false, !mintersectedWall);



        if(wallIntersectionPt){
            calculatedLine = getReflectedLineFromWall(line, wallIntersectionPt, intersectedWall);
            ballProjectionPt = wallIntersectionPt;
        }
    }

    form.dash().strokeOnly('yellow', 1).line(calculatedLine);

    // closest intersection point
    form.alpha(0.8).fillOnly('white').point(ballProjectionPt, 8, 'circle');

}