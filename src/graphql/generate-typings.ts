import { GraphQLDefinitionsFactory } from '@nestjs/graphql';
import { join } from 'path';

const definitionsFactory = new GraphQLDefinitionsFactory();
definitionsFactory.generate({
  typePaths: ['./src/**/*.graphql'],
  path: join(process.cwd(), 'src/graphql/graphql-schema.ts'),
  customScalarTypeMapping: {
    DateTime: 'Date',
  },
  outputAs: 'class',
});