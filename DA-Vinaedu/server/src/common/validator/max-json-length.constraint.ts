import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'maxJsonLength', async: false })
export class MaxJsonLengthConstraint implements ValidatorConstraintInterface {
  validate(value: any): boolean {
    try {
      const jsonString = JSON.stringify(value);
      return jsonString.length <= 255;
    } catch {
      return false;
    }
  }

  defaultMessage(): string {
    return `The JSON representation of the value exceeds 255 characters.`;
  }
}
