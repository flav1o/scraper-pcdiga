import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field(() => String)
  userId: string;

  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String)
  email: string;

  @Field(() => String)
  password: string;

  @Field(() => Boolean)
  socialAuth: boolean;
}

@ObjectType()
export class SignInResult {
  @Field(() => String)
  authToken: string;
}
