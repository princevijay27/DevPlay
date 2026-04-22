import { Gauge } from "lucide-react";

import { GameComingSoon } from "../../../../components/games/game-coming-soon";

export default function CodeGolfPage() {
  return (
    <GameComingSoon
      title="Code Golf"
      description="The editor, character counter, and sandboxed test runner will plug into this route next."
      icon={Gauge}
    />
  );
}
