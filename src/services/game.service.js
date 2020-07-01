import { createCircle } from "./body.service";

const INITIAL_PTS_COUNT = 5;

export const allCircles = [];

export function gameInit(){

    for(let i = INITIAL_PTS_COUNT; i > 0; i--){

        const circle = createCircle(i);


        allCircles.push(circle);
    }
}


export default {
    gameInit,
    allCircles
}