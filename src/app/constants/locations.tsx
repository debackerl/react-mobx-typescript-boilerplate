import { Location } from 'app/location';

export const LOCATION_HOME = new Location<{ language: string }>('/:language');
export const LOCATION_ABOUT = new Location<{ language: string }>('/:language/about');
