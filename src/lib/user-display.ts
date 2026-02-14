const avatars = (seed: string) => `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}`;

const USER_DISPLAY: Record<string, { name: string; avatar: string }> = {
  rahul: { name: "Rahul", avatar: avatars("Rahul") },
  sneha: { name: "Sneha", avatar: avatars("Sneha") },
  priya: { name: "Priya", avatar: avatars("Priya") },
  ananya: { name: "Ananya", avatar: avatars("Ananya") },
  vikram: { name: "Vikram", avatar: avatars("Vikram") },
  girisha: { name: "Girisha", avatar: avatars("Girisha") },
};

export function getUserDisplay(username: string): { name: string; avatar: string } {
  return (
    USER_DISPLAY[username.toLowerCase()] ?? {
      name: username,
      avatar: avatars(username),
    }
  );
}
