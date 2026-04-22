import { Bug } from "lucide-react";

import { GameComingSoon } from "../../../../components/games/game-coming-soon";

export default function DebugHuntPage() {
  return (
    <GameComingSoon
      title="Debug Hunt"
      description="Line selection, syntax highlighting, and AI bug validation land in the next DevPlay slice."
      icon={Bug}
    />
  );
}
