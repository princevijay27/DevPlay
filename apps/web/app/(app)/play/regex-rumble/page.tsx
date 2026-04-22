import { Search } from "lucide-react";

import { GameComingSoon } from "../../../../components/games/game-coming-soon";

export default function RegexRumblePage() {
  return (
    <GameComingSoon
      title="Regex Rumble"
      description="Live match previews and safe server-side validation will be built on top of this route."
      icon={Search}
    />
  );
}
