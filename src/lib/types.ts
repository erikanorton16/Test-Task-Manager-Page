export type Tag = { id: string; name: string };

export type MealLog = {
  id: string;
  passengerId: string;
  date: string;
  item: string;
  notes: string | null;
  createdBy: string | null;
  createdAt: string;
};

export type FlightLog = {
  id: string;
  passengerId: string;
  date: string;
  flightInfo: string | null;
  notes: string | null;
  createdBy: string | null;
  createdAt: string;
};

export type Passenger = {
  id: string;
  name: string;
  photoUrl: string | null;
  relationship: string | null;
  dietaryPreferences: string | null;
  allergies: string | null;
  seatingPreference: string | null;
  temperaturePreference: string | null;
  favoriteSnack: string | null;
  drinkOfChoice: string | null;
  blanketPillowPreference: string | null;
  notes: string | null;
  archived: boolean;
  updatedBy: string | null;
  updatedAt: string;
  createdBy: string | null;
  createdAt: string;
  tags: Tag[];
  mealLogs?: MealLog[];
  flightLogs?: FlightLog[];
};

export type FlightLogWithPassenger = FlightLog & {
  passenger: { id: string; name: string; photoUrl: string | null };
};
