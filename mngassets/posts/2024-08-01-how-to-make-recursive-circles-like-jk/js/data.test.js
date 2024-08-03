//https://medium.com/@elysiumceleste/how-to-run-tests-for-a-specific-file-in-jest-a85e4ed31c2d
//npm test --findRelatedFiles posts/2024-08-01-how-to-make-recursive-circles-like-jk/js/data.test.js

//import {create, all} from 'https://cdn.jsdelivr.net/npm/mathjs@13.0.3/+esm';

//const config = { }
//const mathjs = create(all, config);

import {PointCircleGeoms} from './data.js';
import {Circle} from './data.js';
import {Line} from './data.js';
import {Point} from './data.js';
import {Triangle} from './data.js';

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

describe('tests for Triangle', () =>{
    let triangle = new Triangle(new Point(1,2,'testA'), new Point(3,2,'testB'), new Point(3,4,'testC'), 'testtriangle');
    //let triangleN = new Triangle(new Point(1,2,'testA'), new Point(20,2,'testB'), new Point(3,4,'testC'), 'testtriangle');
    // beforeAll(() => {
    //     this.inst = new Line(new Point(1,2,'testA'), new Point(3,2,'testB'), 'testline');
    //     //return this.line;
    // });

    test('creates a triangle: is truthy', () => {
        expect(triangle).toBeTruthy();
    });

    test('creates a triangle: given name', () => {
        //let line = this.line.run()
        expect(triangle.triangleName).toBe('testtriangle');
    });

    test('creates a triangle: error if points too far from each other', () => {
        //let line = this.line.run()
        expect(() => {new Triangle(new Point(1,2,'testA'), new Point(1,2,'testB'), new Point(3,4,'testC'), 'testtriangle')}).toThrow("Equal points");
    });

    test('creates a triangle: error if at least one point is null or undefined', () => {
        //let line = this.line.run()
        expect(() => {new Triangle(new Point(1,2,'testA'), null, new Point(3,4,'testC'), 'testtriangle')}).toThrow("Not all points");
    });
});


//TODO: Circle and PointCircleGeoms



