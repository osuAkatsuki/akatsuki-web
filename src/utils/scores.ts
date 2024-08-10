import ReplayBackground0 from "../components/images/replay-backgrounds/replay_background0.svg"
import ReplayBackground1 from "../components/images/replay-backgrounds/replay_background1.svg"
import ReplayBackground2 from "../components/images/replay-backgrounds/replay_background2.svg"
import ReplayBackground3 from "../components/images/replay-backgrounds/replay_background3.svg"
import ReplayBackground4 from "../components/images/replay-backgrounds/replay_background4.svg"

export const getReplayBackground = (scoreId: number) => {
  const BACKGROUNDS = [
    ReplayBackground0,
    ReplayBackground1,
    ReplayBackground2,
    ReplayBackground3,
    ReplayBackground4,
  ]
  return BACKGROUNDS[scoreId % BACKGROUNDS.length]
}
