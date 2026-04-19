import React, { createContext, ReactNode, useState } from 'react';

export type Pet = {
  id: string;
  name: string;
  type: 'Dog' | 'Cat';
  breed: string;
  age: string;
  weight: string;
  image?: string | null;
};

type PetContextType = {
  pets: Pet[];
  addPet: (pet: Pet) => void;
};

export const PetContext = createContext<PetContextType>({
  pets: [],
  addPet: () => {},
});

export const PetProvider = ({ children }: { children: ReactNode }) => {
  const [pets, setPets] = useState<Pet[]>([]);

  const addPet = (pet: Pet) => {
    setPets((prev) => [...prev, pet]);
  };

  return (
    <PetContext.Provider value={{ pets, addPet }}>
      {children}
    </PetContext.Provider>
  );
};    