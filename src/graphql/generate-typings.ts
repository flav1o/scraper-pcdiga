import { GraphQLDefinitionsFactory } from '@nestjs/graphql';
import { join } from 'path';

const definitionsFactory = new GraphQLDefinitionsFactory();
definitionsFactory.generate({
  typePaths: ['./src/**/*.graphql'],
  path: join(process.cwd(), 'src/graphql/graphql-schema.ts'),
  outputAs: 'class',
});

//https://stackoverflow.com/questions/63989369/nestjs-graphql-federation-and-schema-first-graphqldefinitionsfactory
