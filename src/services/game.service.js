import { createCircle } from "./body.service";
import { space } from "./world.service";

const INITIAL_PTS_COUNT = 5;

export const allCircles = [];
export let launchCircle;
export function gameInit(){

    const launchCircleRadius = 80;

    launchCircle = createCircle(0, launchCircleRadius, {
        position: {
            x: space.size.x / 2,
            y: space.size.y,
        },
        color: 'red'
    });
    launchCircle.width = 1;
    launchCircle.radius = launchCircleRadius;

    for(let i = INITIAL_PTS_COUNT; i > 0; i--){

        const circle = createCircle(i);


        allCircles.push(circle);
    }
}


export default {
    gameInit,
    allCircles
}