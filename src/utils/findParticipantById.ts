import { UserMainInfo } from "@/interfaces/user";

export function findParticipantById(
  participants: UserMainInfo[] | undefined,
  id: string,
): UserMainInfo | undefined {
  return participants?.find((p) => p.id === id);
}
