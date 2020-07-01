import { CanvasSpace, World, Line, Pt, Group, Rectangle, Geom, Circle } from "pts";
import { gameInit, allCircles } from './game.service';

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

            const topEdge = Group.fromArray([[0, 0], [x, 0]]);
            const bottomEdge = Group.fromArray([[0, y], [x, y]]);
            const leftEdge = Group.fromArray([[0,0], [0, y]]);
            const rightEdge = Group.fromArray([[x,0], [x,y]]);

            edges = [
                topEdge,
                bottomEdge,
                leftEdge,
                rightEdge
            ];

            world = new World(space.innerBound, 0.95, 0);
            gameInit();
        },
        animate: (time, fTime) => {


            allCircles.forEach((circle, i) => {

                let { color } = circle.render;

                const textSize = circle.particle.radius * 0.9;
                const strokeSize = textSize * 0.1;

                form.strokeOnly(color, strokeSize).point( circle.point, circle.particle.radius - (strokeSize / 2), "circle" );

                const ptCenterText = Rectangle.fromCenter(circle.point, textSize);

                form.strokeOnly('white', 1).rect(ptCenterText);

                form.fill(color).font(textSize).alignText('center').textBox(ptCenterText, circle.game.hitPoints);
            });

            world.update(fTime);
        }
    });

    space.play();


}

export function addToWorld(body){

    world.add(body);
}

export default {
    worldInit,
    addToWorld,
    space,
    form
}