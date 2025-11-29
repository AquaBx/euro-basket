import { Point, Polygon, Secteur } from '$lib/polygon';
import type { Transport } from '@sveltejs/kit';

export const transport: Transport = {
    Secteur: {
        encode: (value) => {
            if (value instanceof Secteur) {
                return [value.id, value.polygon, value.points]; 
            }
            return false;
        },
        decode: ([id, polygon, points]) => {
            let s = new Secteur(id, polygon);
            s.points = points
            return s
        }
    },
    Polygon: {
        encode: (value) => {
            if (value instanceof Polygon) {
                return [value.points]; 
            }
            return false;
        },
        decode: ([points]) => {
            return new Polygon(points);
        }
    },
    Point: {
        encode: (value) => {
            if (value instanceof Point) {
                return [value.lat,value.lng]; 
            }
            return false;
        },
        decode: ([lat,lng]) => {
            return new Point(lat,lng);
        }
    }
}