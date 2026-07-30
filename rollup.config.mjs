import resolve from '@rollup/plugin-node-resolve';
import clear from 'rollup-plugin-clear';
import 'dotenv/config';

const screepsClientPath = process.env.SCREEPS_CLIENT_PATH;

if (!screepsClientPath) {
    console.warn('⚠️ WARNING: SCREEPS_CLIENT_PATH is not defined in your .env file. Skipping local deployment build.');
}

const outputTargets = [
    // Output => publish to dist folder
    {
        file: 'dist/main.js',
        format: 'cjs',
        sourcemap: false,
        globals: {
            lodash: '_'
        }
    }
];

if (screepsClientPath) {
    // Output => add extra output to copy dist/main.js to local screeps client folder
    outputTargets.push({        
        file: screepsClientPath,
        format: 'cjs',
        sourcemap: false,
        globals: {
            lodash: '_'
        }
    });
}

export default {
    // 1. Point to your main local file
    input: 'src/main.js',

    external: ['lodash'],

    output: outputTargets,

    plugins: [
        // Clears the old build before making a new one
        clear({ targets: ['dist'] }),
        // Allows Rollup to find files across your folders
        resolve()
    ],

    watch: {
        clearScreen: false
    }
};