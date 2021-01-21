export default {
  input: 'src/js/index.js',
  output: {
    file: 'dist/i-storyline.js',
    //format: 'umd',
    name: 'iStorylineJS',
    external: ['d3-fetch', 'mathjs', 'xml2js'], // <-- suppresses the warning
  },
}
