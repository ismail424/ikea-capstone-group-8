import type { PageServerLoad } from './$types';

let x : number = 0;
export const load = (async () => {

    x += 1;
    console.log(x);


    return {};
}) satisfies PageServerLoad;