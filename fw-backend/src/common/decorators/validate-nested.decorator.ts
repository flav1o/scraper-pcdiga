import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

export function ValidateNestedType(type: () => any) {
  return function (target: object, propertyName: string) {
    ValidateNested({ each: true })(target, propertyName);
    Type(type)(target, propertyName);
  };
}
