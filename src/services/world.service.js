import { CanvasSpace, World, Line, Pt, Group, Rectangle, Geom, Circle } from "pts";
import { gameInit, allCircles, launchCircle } from './game.service';
import { renderLaunchCircle, renderCircles, renderLauncherGuide } from "./renderers.service";

export let space, form, world, edges;

export function worldInit(){

    space = new CanvasSpace('#game-container').setup({
        bgcolor: '#123',
        resize: false,
        retina: false
    });
    form = space.getForm();

    space.add({
        start: (bound, space) => {

            const { x, y } = space.size;

            edges = [
                createEdgeObject('top', [[0, 0], [x, 0]]),
                createEdgeObject('bottom', [[0, y], [x, y]]),
                createEdgeObject('left', [[0,0], [0, y]]),
                createEdgeObject('right', [[x,0], [x,y]])
            ];

            world = new World(space.innerBound, 0.95, 0);
            gameInit();
        },
        animate: (time, fTime) => {

            renderLaunchCircle();
            renderCircles();


            Object.values(edges).forEach(edge => {
                form.strokeOnly('red', 5).line(edge.line);
            })

            renderLauncherGuide();

            world.update(fTime);
        }
    });

    space.play().bindMouse().bindTouch();
}

export function addToWorld(body){

    world.add(body);
}

function createEdgeObject(direction, coords){
    return {
        direction,
        line: Group.fromArray(coords)
    }
}

export default {
    worldInit,
    addToWorld,
    space,
    form
}