import { createUserSchema, createUserFromAuthSchema } from '../user.schema'

describe('User Validation Schemas', () => {
  describe('createUserSchema', () => {
    const validUserData = {
      id: 'firebase-uid-123',
      email: 'user@example.com',
      firstName: 'John',
      lastName: 'Doe',
    }

    it('valida correctamente datos de usuario completos', () => {
      const result = createUserSchema.safeParse(validUserData)
      expect(result.success).toBe(true)
    })

    it('valida con campos opcionales', () => {
      const userData = {
        ...validUserData,
        phone: '+1234567890',
        birthday: new Date('1990-01-01'),
        note: 'Some note',
        description: 'User description',
        pictureFullPath: 'https://example.com/picture.jpg',
        timeZone: 'America/New_York',
        status: 'visible' as const,
        type: 'customer' as const,
      }

      const result = createUserSchema.safeParse(userData)
      expect(result.success).toBe(true)
    })

    it('falla cuando el email es inválido', () => {
      const invalidData = {
        ...validUserData,
        email: 'invalid-email',
      }

      const result = createUserSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Invalid email format')
      }
    })

    it('falla cuando el ID está vacío', () => {
      const invalidData = {
        ...validUserData,
        id: '',
      }

      const result = createUserSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('User ID is required')
      }
    })

    it('falla cuando firstName está vacío', () => {
      const invalidData = {
        ...validUserData,
        firstName: '',
      }

      const result = createUserSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('First name is required')
      }
    })

    it('falla cuando lastName está vacío', () => {
      const invalidData = {
        ...validUserData,
        lastName: '',
      }

      const result = createUserSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Last name is required')
      }
    })

    it('acepta valores null para campos opcionales', () => {
      const userData = {
        ...validUserData,
        phone: null,
        birthday: null,
        note: null,
        description: null,
        pictureFullPath: null,
        timeZone: null,
      }

      const result = createUserSchema.safeParse(userData)
      expect(result.success).toBe(true)
    })

    it('valida enumeraciones de status correctamente', () => {
      const statuses = ['hidden', 'visible', 'disabled', 'blocked']

      statuses.forEach(status => {
        const result = createUserSchema.safeParse({
          ...validUserData,
          status,
        })
        expect(result.success).toBe(true)
      })
    })

    it('falla con status inválido', () => {
      const invalidData = {
        ...validUserData,
        status: 'invalid-status',
      }

      const result = createUserSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('valida enumeraciones de type correctamente', () => {
      const types = ['customer', 'provider', 'manager', 'admin']

      types.forEach(type => {
        const result = createUserSchema.safeParse({
          ...validUserData,
          type,
        })
        expect(result.success).toBe(true)
      })
    })
  })

  describe('createUserFromAuthSchema', () => {
    const validAuthData = {
      id: 'firebase-uid-123',
      email: 'user@example.com',
      firstName: 'John',
      lastName: 'Doe',
    }

    it('valida correctamente datos mínimos de autenticación', () => {
      const result = createUserFromAuthSchema.safeParse(validAuthData)
      expect(result.success).toBe(true)
    })

    it('valida con pictureFullPath como URL', () => {
      const userData = {
        ...validAuthData,
        pictureFullPath: 'https://example.com/avatar.jpg',
      }

      const result = createUserFromAuthSchema.safeParse(userData)
      expect(result.success).toBe(true)
    })

    it('acepta pictureFullPath como null', () => {
      const userData = {
        ...validAuthData,
        pictureFullPath: null,
      }

      const result = createUserFromAuthSchema.safeParse(userData)
      expect(result.success).toBe(true)
    })

    it('falla cuando pictureFullPath no es una URL válida', () => {
      const invalidData = {
        ...validAuthData,
        pictureFullPath: 'not-a-url',
      }

      const result = createUserFromAuthSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('requiere todos los campos obligatorios', () => {
      const missingFields = [
        { ...validAuthData, id: undefined },
        { ...validAuthData, email: undefined },
        { ...validAuthData, firstName: undefined },
        { ...validAuthData, lastName: undefined },
      ]

      missingFields.forEach(data => {
        const result = createUserFromAuthSchema.safeParse(data)
        expect(result.success).toBe(false)
      })
    })
  })
})
