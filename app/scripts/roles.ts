export function getRoleLabel(role?: string) {
  switch (role) {
    case "admin":
      return "Администратор";
    case "moderator":
      return "Модератор";
    case "user":
      return "Пользователь";
    default:
      return "Пользователь";
  }
}