export const getFlagUrl = (country: string): string => {
  let url = "https://osu.ppy.sh/assets/images/flags/";

  for (let idx = 0; idx < country.length; idx++) {
    let char = country.charCodeAt(idx);
    url += (char + 127397).toString(16);
    url += idx !== country.length - 1 ? "-" : ".svg";
  }

  return url;
};
