import { Binary } from "lucide-react";

import { GameComingSoon } from "../../../../components/games/game-coming-soon";

export default function BinaryBlitzPage() {
  return (
    <GameComingSoon
      title="Binary Blitz"
      description="The timer, question generator, and streak multipliers are queued up after the hub foundation."
      icon={Binary}
    />
  );
}
