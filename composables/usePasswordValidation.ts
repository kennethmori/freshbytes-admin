export interface PasswordValidation {
  isValid: boolean
  errors: string[]
  strength: 'weak' | 'medium' | 'strong'
}

export const usePasswordValidation = () => {
  const validatePassword = (password: string): PasswordValidation => {
    const errors: string[] = []
    let score = 0

    // Minimum length check
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long')
    } else {
      score += 1
    }

    // Uppercase letter check
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter')
    } else {
      score += 1
    }

    // Lowercase letter check
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter')
    } else {
      score += 1
    }

    // Number check
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number')
    } else {
      score += 1
    }

    // Special character check
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character')
    } else {
      score += 1
    }

    // Determine strength
    let strength: 'weak' | 'medium' | 'strong' = 'weak'
    if (score >= 4) {
      strength = 'strong'
    } else if (score >= 2) {
      strength = 'medium'
    }

    return {
      isValid: errors.length === 0,
      errors,
      strength
    }
  }

  const getPasswordStrengthColor = (strength: string): string => {
    switch (strength) {
      case 'weak':
        return 'text-red-500'
      case 'medium':
        return 'text-yellow-500'
      case 'strong':
        return 'text-green-500'
      default:
        return 'text-gray-500'
    }
  }

  return {
    validatePassword,
    getPasswordStrengthColor
  }
}