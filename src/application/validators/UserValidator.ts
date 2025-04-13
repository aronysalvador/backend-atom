export class UserValidator {
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  private static readonly MIN_NAME_LENGTH = 3;
  private static readonly MAX_NAME_LENGTH = 50;
  private static readonly DATE_REGEX = /^\d{2}\/\d{2}\/\d{4}$/;

  private static isEmptyString(value: string): boolean {
    return !value || value.trim().length === 0;
  }

  static validateEmail(email: string): string | null {
    if (this.isEmptyString(email)) return 'Email is required';
    if (!this.EMAIL_REGEX.test(email.trim())) return 'Invalid email format';
    return null;
  }

  static validateName(name: string): string | null {
    if (this.isEmptyString(name)) return 'Name is required';
    const trimmedName = name.trim();
    if (trimmedName.length < this.MIN_NAME_LENGTH) return `Name must be at least ${this.MIN_NAME_LENGTH} characters`;
    if (trimmedName.length > this.MAX_NAME_LENGTH) return `Name must not exceed ${this.MAX_NAME_LENGTH} characters`;
    return null;
  }

  static validateLastName(lastName: string): string | null {
    if (this.isEmptyString(lastName)) return 'Last name is required';
    const trimmedLastName = lastName.trim();
    if (trimmedLastName.length < this.MIN_NAME_LENGTH) return `Last name must be at least ${this.MIN_NAME_LENGTH} characters`;
    if (trimmedLastName.length > this.MAX_NAME_LENGTH) return `Last name must not exceed ${this.MAX_NAME_LENGTH} characters`;
    return null;
  }

  static validateDateBirth(dateBirth: string | Date): { error: string | null; date: Date | null } {
    if (dateBirth instanceof Date) {
      if (dateBirth > new Date()) return { error: 'Birth date cannot be in the future', date: null };
      return { error: null, date: dateBirth };
    }

    if (this.isEmptyString(dateBirth)) return { error: 'Birth date is required', date: null };
    const trimmedDate = dateBirth.trim();
    if (!this.DATE_REGEX.test(trimmedDate)) return { error: 'Invalid date format. Use DD/MM/YYYY', date: null };
    
    const [day, month, year] = trimmedDate.split('/').map(Number);
    const date = new Date(year, month - 1, day);
    
    if (isNaN(date.getTime())) return { error: 'Invalid date', date: null };
    if (date > new Date()) return { error: 'Birth date cannot be in the future', date: null };
    
    return { error: null, date };
  }

  static validateUser(user: { userId: string; name: string; lastName: string; dateBirth: string | Date }): { isValid: boolean; errors: Record<string, string>; dateBirth: Date | null } {
    const errors: Record<string, string> = {};
    
    const emailError = this.validateEmail(user.userId);
    if (emailError) errors.userId = emailError;
    
    const nameError = this.validateName(user.name);
    if (nameError) errors.name = nameError;
    
    const lastNameError = this.validateLastName(user.lastName);
    if (lastNameError) errors.lastName = lastNameError;
    
    const dateBirthValidation = this.validateDateBirth(user.dateBirth);
    if (dateBirthValidation.error) {
      errors.dateBirth = dateBirthValidation.error;
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors,
      dateBirth: dateBirthValidation.date
    };
  }
}