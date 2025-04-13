import { User } from '../../domain/entities/User';
import { UserRepository } from '../../domain/repositories/UserRepository';
import { db } from '../config/firebase';
import { UserValidator } from '../../application/validators/UserValidator';

export class FirestoreUserRepository implements UserRepository {
  private readonly collection = 'users';

  async create(user: User): Promise<User> {
    const validation = UserValidator.validateUser({
      userId: user.userId,
      name: user.name,
      lastName: user.lastName,
      dateBirth: user.dateBirth
    });

    if (!validation.isValid || !validation.dateBirth) {
      throw new Error(JSON.stringify(validation.errors));
    }

    const userRef = await db.collection(this.collection).add({
      ...user,
      dateBirth: validation.dateBirth,
      createdAt: new Date()
    });
    
    return {
      ...user,
      dateBirth: validation.dateBirth,
      id: userRef.id
    };
  }

  async findById(id: string): Promise<User | null> {
    const doc = await db.collection(this.collection).doc(id).get();
    if (!doc.exists) return null;
    
    return {
      id: doc.id,
      ...doc.data()
    } as User;
  }

  async findAll(): Promise<User[]> {
    const snapshot = await db.collection(this.collection).get();
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as User[];
  }

  async update(id: string, user: Partial<User>): Promise<User | null> {
    if (user.userId || user.name || user.lastName || user.dateBirth) {
      const validation = UserValidator.validateUser({
        userId: user.userId || '',
        name: user.name || '',
        lastName: user.lastName || '',
        dateBirth: user.dateBirth || ''
      });

      if (!validation.isValid) {
        throw new Error(JSON.stringify(validation.errors));
      }

      if (validation.dateBirth) {
        user.dateBirth = validation.dateBirth;
      }
    }

    const userRef = db.collection(this.collection).doc(id);
    const doc = await userRef.get();
    
    if (!doc.exists) return null;
    
    await userRef.update(user);
    
    const updatedDoc = await userRef.get();
    return {
      id: updatedDoc.id,
      ...updatedDoc.data()
    } as User;
  }

  async delete(id: string): Promise<boolean> {
    const userRef = db.collection(this.collection).doc(id);
    const doc = await userRef.get();
    
    if (!doc.exists) return false;
    
    await userRef.delete();
    return true;
  }
} 