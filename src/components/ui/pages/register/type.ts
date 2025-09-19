export type RegisterUIProps = {
  errorText: string;
  email: string;
  userName: string;
  password: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  setUserName: React.Dispatch<React.SetStateAction<string>>;
  handleSubmit: (e: React.FormEvent) => void;
  loading?: boolean; // Добавляем опциональный пропс loading
};
