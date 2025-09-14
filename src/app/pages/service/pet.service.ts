import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

// Define the Pet interface based on the provided JSON structure
export interface Pet {
  id: number;
  ownerId: number;
  name: string;
  species: 'Dog' | 'Cat';
  breed: string;
  age: number;
  gender: 'MALE' | 'FEMALE';
  photoUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class PetService {
  // In-memory pet data with real image URLs of the same size (1000x1000px)
  private pets: Pet[] = [
    {
      id: 1,
      ownerId: 1,
      name: 'Bella',
      species: 'Dog',
      breed: 'Labrador Retriever',
      age: 3,
      gender: 'FEMALE',
      photoUrl: 'https://images.unsplash.com/photo-1561037404-61cd46aa615b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&h=1000&q=80'
    },
    {
      id: 2,
      ownerId: 2,
      name: 'Max',
      species: 'Dog',
      breed: 'German Shepherd',
      age: 4,
      gender: 'MALE',
      photoUrl: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&h=1000&q=80'
    },
    {
      id: 3,
      ownerId: 3,
      name: 'Luna',
      species: 'Cat',
      breed: 'Persian',
      age: 2,
      gender: 'FEMALE',
      photoUrl: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&h=1000&q=80'
    },
    {
      id: 4,
      ownerId: 4,
      name: 'Charlie',
      species: 'Dog',
      breed: 'Golden Retriever',
      age: 6,
      gender: 'MALE',
      photoUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&h=1000&q=80'
    },
    {
      id: 5,
      ownerId: 5,
      name: 'Coco',
      species: 'Dog',
      breed: 'Poodle',
      age: 5,
      gender: 'FEMALE',
      photoUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&h=1000&q=80'
    },
    {
      id: 6,
      ownerId: 6,
      name: 'Milo',
      species: 'Cat',
      breed: 'Maine Coon',
      age: 3,
      gender: 'MALE',
      photoUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&h=1000&q=80'
    },
    {
      id: 7,
      ownerId: 7,
      name: 'Daisy',
      species: 'Dog',
      breed: 'Beagle',
      age: 2,
      gender: 'FEMALE',
      photoUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&h=1000&q=80'
    },
    {
      id: 8,
      ownerId: 8,
      name: 'Rocky',
      species: 'Dog',
      breed: 'Bulldog',
      age: 4,
      gender: 'MALE',
      photoUrl: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&h=1000&q=80'
    },
    {
      id: 9,
      ownerId: 9,
      name: 'Chloe',
      species: 'Cat',
      breed: 'Siamese',
      age: 1,
      gender: 'FEMALE',
      photoUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&h=1000&q=80'
    },
    {
      id: 10,
      ownerId: 10,
      name: 'Buddy',
      species: 'Dog',
      breed: 'Border Collie',
      age: 3,
      gender: 'MALE',
      photoUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&h=1000&q=80'
    },
    {
      id: 11,
      ownerId: 11,
      name: 'Sophie',
      species: 'Dog',
      breed: 'Shih Tzu',
      age: 5,
      gender: 'FEMALE',
      photoUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&h=1000&q=80'
    },
    {
      id: 12,
      ownerId: 12,
      name: 'Oliver',
      species: 'Cat',
      breed: 'British Shorthair',
      age: 2,
      gender: 'MALE',
      photoUrl: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&h=1000&q=80'
    },
    {
      id: 13,
      ownerId: 13,
      name: 'Lucy',
      species: 'Dog',
      breed: 'Dachshund',
      age: 4,
      gender: 'FEMALE',
      photoUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&h=1000&q=80'
    },
    {
      id: 14,
      ownerId: 14,
      name: 'Toby',
      species: 'Dog',
      breed: 'Boxer',
      age: 3,
      gender: 'MALE',
      photoUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&h=1000&q=80'
    },
    {
      id: 15,
      ownerId: 15,
      name: 'Lily',
      species: 'Cat',
      breed: 'Ragdoll',
      age: 3,
      gender: 'FEMALE',
      photoUrl: 'https://images.unsplash.com/photo-1561948955-570b270e7c36?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&h=1000&q=80'
    },
    // {
    //   id: 16,
    //   ownerId: 16,
    //   name: 'Duke',
    //   species: 'Dog',
    //   breed: 'Rottweiler',
    //   age: 6,
    //   gender: 'MALE',
    //   photoUrl: 'https://images.unsplash.com/photo-1548199973-03ce768b8739?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&h=1000&q=80'
    // },
    {
      id: 17,
      ownerId: 17,
      name: 'Zoe',
      species: 'Dog',
      breed: 'Chihuahua',
      age: 2,
      gender: 'FEMALE',
      photoUrl: 'https://images.unsplash.com/photo-1561948955-570b270e7c36?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&h=1000&q=80'
    },
    // {
    //   id: 18,
    //   ownerId: 18,
    //   name: 'Simba',
    //   species: 'Cat',
    //   breed: 'Bengal',
    //   age: 4,
    //   gender: 'MALE',
    //   photoUrl: 'https://images.unsplash.com/photo-1517423440428-d53d8508a8c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&h=1000&q=80'
    // },
    {
      id: 19,
      ownerId: 19,
      name: 'Sadie',
      species: 'Dog',
      breed: 'Corgi',
      age: 3,
      gender: 'FEMALE',
      photoUrl: 'https://images.unsplash.com/photo-1583511655826-05700d52f4d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&h=1000&q=80'
    },
    {
      id: 20,
      ownerId: 20,
      name: 'Oscar',
      species: 'Cat',
      breed: 'Abyssinian',
      age: 2,
      gender: 'MALE',
      photoUrl: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&h=1000&q=80'
    }
  ];

  constructor() { }

  // Get all pets
  getPets(): Observable<Pet[]> {
    return of(this.pets);
  }

  // Get a single pet by ID
  getPetById(id: number): Observable<Pet | undefined> {
    const pet = this.pets.find(p => p.id === id);
    return of(pet);
  }

  // Add a new pet
  addPet(pet: Pet): Observable<Pet> {
    const newPet = { ...pet, id: this.pets.length + 1 }; // Auto-increment ID
    this.pets.push(newPet);
    return of(newPet);
  }

  // Update an existing pet
  updatePet(updatedPet: Pet): Observable<Pet | undefined> {
    const index = this.pets.findIndex(p => p.id === updatedPet.id);
    if (index !== -1) {
      this.pets[index] = updatedPet;
      return of(updatedPet);
    }
    return of(undefined);
  }

  // Delete a pet by ID
  deletePet(id: number): Observable<boolean> {
    const index = this.pets.findIndex(p => p.id === id);
    if (index !== -1) {
      this.pets.splice(index, 1);
      return of(true);
    }
    return of(false);
  }
}

