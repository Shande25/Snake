export type RootStackParamList = {
  Login: undefined;
  Welcome: { username: string }; 
  Register: undefined;
  Game: { gameId: number }; 
  Puntuacion: { score: number };
};