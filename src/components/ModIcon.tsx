import { Box, Typography } from "@mui/material"
import React, { forwardRef } from "react"

import ConversionModIcon from "../components/images/mod-icons/Conversion.png"
import APModIcon from "../components/images/mod-icons/mod_autopilot.png"
import DTModIcon from "../components/images/mod-icons/mod_double-time.png"
import EZModIcon from "../components/images/mod-icons/mod_easy.png"
import FLModIcon from "../components/images/mod-icons/mod_flashlight.png"
import HTModIcon from "../components/images/mod-icons/mod_half.png"
import HRModIcon from "../components/images/mod-icons/mod_hard-rock.png"
import HDModIcon from "../components/images/mod-icons/mod_hidden.png"
import MRModIcon from "../components/images/mod-icons/mod_mirror.png"
import NCModIcon from "../components/images/mod-icons/mod_nightcore.png"
import NFModIcon from "../components/images/mod-icons/mod_no-fail.png"
import PFModIcon from "../components/images/mod-icons/mod_perfect.png"
import RNModIcon from "../components/images/mod-icons/mod_random.png"
import RXModIcon from "../components/images/mod-icons/mod_relax.png"
import SOModIcon from "../components/images/mod-icons/mod_spun-out.png"
import SDModIcon from "../components/images/mod-icons/mod_sudden-death.png"
// import { AUModIcon } from "../components/images/mod-icons/AUModIcon"
import TDModIcon from "../components/images/mod-icons/mod_touchdevice.png"
import { formatMods, Mods } from "../utils/mods"

const getModIcon = (variant: Mods) => {
  switch (variant) {
    case Mods.Easy:
      return EZModIcon
    case Mods.NoFail:
      return NFModIcon
    case Mods.HalfTime:
      return HTModIcon
    case Mods.HardRock:
      return HRModIcon
    case Mods.SuddenDeath:
      return SDModIcon
    case Mods.Perfect:
      return PFModIcon
    case Mods.DoubleTime:
      return DTModIcon
    case Mods.NightCore:
      return NCModIcon
    case Mods.Hidden:
      return HDModIcon
    case Mods.Flashlight:
      return FLModIcon
    case Mods.SpunOut:
      return SOModIcon
    case Mods.TouchScreen:
      return TDModIcon
    case Mods.Relax:
      return RXModIcon
    case Mods.AutoPilot:
      return APModIcon
    case Mods.Mirror:
      return MRModIcon
    case Mods.Random:
      return RNModIcon
    case Mods.Key1:
    case Mods.Key2:
    case Mods.Key3:
    case Mods.Key4:
    case Mods.Key5:
    case Mods.Key6:
    case Mods.Key7:
    case Mods.Key8:
    case Mods.Key9:
    case Mods.KeyCoop:
    case Mods.ScoreV2:
      return ConversionModIcon
    default:
      return ""
  }
}

export const ModIcon = ({
  variant,
  width,
  height,
}: {
  key?: React.Key | null
  variant: Mods
  width: number
  height: number
}) => {
  const modIcon = getModIcon(variant)
  const NO_ICON_MODS =
    Mods.Key1 |
    Mods.Key2 |
    Mods.Key3 |
    Mods.Key4 |
    Mods.Key5 |
    Mods.Key6 |
    Mods.Key7 |
    Mods.Key8 |
    Mods.Key9 |
    Mods.KeyCoop |
    Mods.ScoreV2

  return (
    <Box
      width={width}
      height={height}
      display="flex"
      alignItems="center"
      justifyContent="center"
      color="hsl(0deg 0% 15%)"
      sx={{
        background: `url(${modIcon})`,
        backgroundSize: "cover",
      }}
    >
      {variant & NO_ICON_MODS ? (
        <Typography>{formatMods(variant)}</Typography>
      ) : null}
    </Box>
  )
}
