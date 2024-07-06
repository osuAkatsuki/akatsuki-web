export type Score = {
  scoreId: number;
  accountId: number;
  beatmapMd5: string;
  score: number;
  performancePoints: number;
  accuracy: number;
  highestCombo: number;
  fullCombo: boolean;
  mods: number;
  num300s: number;
  num100s: number;
  num50s: number;
  numMisses: number;
  numGekis: number;
  numKatus: number;
  grade: string;
  submissionStatus: number;
  gameMode: number;
  country: string;
  timeElapsed: number;
  createdAt: Date;
  updatedAt: Date;

  // beatmap attrs; here for convenience
  beatmapSetId: number;
  beatmapRankedStatus: number;
  beatmapArtist: string;
  beatmapTitle: string;
  beatmapVersion: string;
  beatmapCreator: string;
  beatmapMaxCombo: number;
  beatmapBpm: number;
  beatmapCs: number;
  beatmapAr: number;
  beatmapOd: number;
  beatmapHp: number;
  beatmapStarRating: number;
};
