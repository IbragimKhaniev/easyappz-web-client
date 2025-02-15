module.exports = {
  core: {
    prettier: true,
    output: {
      target: 'main.ts',
      clean: true,
      mode: 'tags',
      workspace: '../src/api/core',
      schemas: 'types',
      client: 'react-query',
      mock: false,
      override: {
        mutator: '../axios.ts',
        name: 'customInstance',
      },
    },
    input: {
      target: './swagger.json',
    },
  },
};