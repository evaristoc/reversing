import {PointCircleGeoms} from './data.js';
import {Circle} from './data.js';
import {Line} from './data.js';
import {Point} from './data.js';

//only positives for now...

describe('tests for Point', () =>{
    let point = new Point(1,2,'test');
    // beforeAll(() => {
    //     this.point = new Point(1,2,'test');
    //     //return this.point;
    // });

    test('creates a point: is truthy', () => {
        expect(point).toBeTruthy();
    });

    test('creates a point: name', () => {
        // let point = this.point.run();
        expect(point.pointName).toBe('test');
    });
    
    test('creates a point: x and y', () => {
        // let point = this.point.run();
        expect([point.x, point.y]).toEqual([1,2]);
    });

});

describe('tests for Line', () =>{
    let line = new Line(new Point(1,2,'testA'), new Point(3,2,'testB'), 'testline');
    let lineN = new Line(new Point(1,2,'testA'), new Point(3,2,'testB'));
    // beforeAll(() => {
    //     this.inst = new Line(new Point(1,2,'testA'), new Point(3,2,'testB'), 'testline');
    //     //return this.line;
    // });

    test('creates a line: is truthy', () => {
        expect(line).toBeTruthy();
    });

    test('creates a line: given name', () => {
        //let line = this.line.run()
        expect(lineN.lineName).toBe('testAtestB');
    });

    test('creates a line: no given name', () => {
        expect(line.lineName).toBe('testline');
    });
    
    test('creates a line: points A and B', () => {
        //let line = this.line.run()
        expect([line.pointA.x, line.pointB.x]).toEqual([1,3]);
    });

    test('creates a line: middle point', () => {
        //let line = this.line.run();
        expect([line.middlePoint.x, line.middlePoint.y]).toEqual([2,2]);
    });

    test('creates a line: middle point name', () => {
        //let line = this.line.run();
        expect(line.middlePoint.pointName).toBe('M');
    });

    //TODO: paramsNormal and testing angles

});

//TODO: Circle and PointCircleGeoms



