const positiveKeywords = ["幸せ", "成功", "いいね!", "カワイイ"];
const negativeKeywords = ["悲しい", "失敗", "やっちゃった", "ゴメンナサイ"];
const inspirationalKeywords = ["勉強になった", "夢", "あの人", "ちょっとイイ"];

export const getBackgroundColorByTheme = (theme) => {

  if (!theme || typeof theme !== 'string') {
    return "#ffffff"; // デフォルト
  }

  if (positiveKeywords.some(keyword => theme.includes(keyword))) {
    return "#ffeff7";
  } else if (negativeKeywords.some(keyword => theme.includes(keyword))) {
    return "#eff7ff";
  } else if (inspirationalKeywords.some(keyword => theme.includes(keyword))) {
    return "#ffffef";
  } else {
    return "#ffffff";
  }
};