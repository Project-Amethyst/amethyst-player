import { sveltekit } from '@sveltejs/kit/vite';

const build_time = new Date().toLocaleString("en-US", { timeZone: 'UTC' }) + " (UTC)";
const build_string = `Amethyst Player Buildtime: ${build_time}`

/** @type {import('vite').UserConfig} */
const config = {
        define: 
	{
		'__BUILD_TIME__':  JSON.stringify(build_time),
                '__BUILD_STRING__':  JSON.stringify(build_string),
	},

        plugins: [sveltekit()]
}

export default config;