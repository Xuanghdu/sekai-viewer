export const stringReplacements = {
  オルゴール: "orgel",
  プレゼント: "present",
  裏コード: "裏chord",
  モニタ: "monitor",
  ファイル: "file",
  アンタイトル: "untitled",
  セカイ: "世界",
  ミク: "Miku",
  バーチャル: "virtual",
  シンガー: "singer",
  ダメ: "駄目",
  ニーゴ: "25",
  サークル: "circle",
  ヤバく: "やばく",
  カップ: "cup",
  チェック: "check",
  ナイトコード: "Nightcord",
  マイク: "mic",
  ミュート: "mute",
  サムネイル: "thumbnail",
  イラスト: "illustration",
  カワイく: "可愛く",
  ラフ: "rough",
  チャット: "chat",
  ツール: "tool",
  ボロボロ: "ぼろぼろ",
  オッケー: "okay",
  ヤバ: "やば",
  ボク: "僕",
  エフェクト: "effect",
  ミックス: "mix",
  アレンジ: "arrange",
  リビング: "living",
  タグ: "tag",
  コメント: "comment",
  ファン: "fan",
  フォロワー: "follower",
  アカウント: "account",
  デザイン: "design",
  カワイイ: "可愛い",
  オウン: "own",
  クリエイター: "creator",
  マニアック: "maniac",
  キレッキレ: "kirekire",
  イメージ: "image",
  アイコン: "icon",
  スパム: "spam",
  ヤツ: "奴",
  コンクール: "concours",
  テーマ: "theme",
  クラスメイト: "classmate",
  バレ: "ばれ",
  ムリ: "無理",
  パンパン: "ぱんぱん",
  クラス: "class",
  バイト: "Arbeit",
  シフト: "shift",
  シチュー: "stew",
  アドバイス: "advice",
  イヤ: "嫌",
  キツい: "きつい",
  アップ: "up",
  タオル: "towel",
  パジャマ: "pajamas",
  キレイ: "奇麗",
  タイミング: "timing",
  スクランブル: "scramble",
  ログ: "log",
  フォルダ: "folder",
  モノ: "物",
  パソコン: "personal computer",
  ピカ: "ぴか",
  スマホ: "smartphone",
  バズり: "buzzり",
  オフ: "off",
  ファミレス: "family restaurant",
  カフェ: "cafe",
  ワイワイ: "わいわい",
  メール: "mail",
  アドレス: "address",
  リアル: "real",
  マ: "ma",
  マジ: "まじ",
  バカ: "馬鹿",
  ホント: "本当",
  ボイチャ: "voice chat",
  パース: "perspective",
  デッサン: "dessin",
  ギャーギャー: "ぎゃあぎゃあ",
  ダル: "dull",
  ドンマイ: "don't mind",
  サク: "さくっ",
  カン: "勘",
  バッチリ: "ばっちり",
  センパイ: "先輩",
  ワケ: "訳",
  ショッピング: "shopping",
  モール: "mall",
  アイライナー: "eyeliner",
  コスメ: "cosmetic",
  チーク: "cheek",
  ラメ: "lame",
  キツか: "きつかっ",
  サビ: "sabi",
  キツく: "きつく",
  ギター: "guitar",
  レトルト: "retort",
  カレー: "curry",
  スーパー: "super",
  ソング: "song",
  コンペ: "competition",
  アイディア: "idea",
  ヘン: "変",
  フレーズ: "phrase",
  カ月: "箇月",
  テスト: "test",
  ストレス: "stress",
  クライアント: "client",
  メモ: "memo",
  メロディ: "melody",
  プロ: "pro",
  ゲーセン: "game center",
  ケーキ: "cake",
  レストラン: "restaurant",
  ギスギス: "ぎすぎす",
  シワシワ: "皺々",
  ナチュラル: "natural",
  ネガ: "negative",
  パー: "ぱあっ",
  ゾワゾワ: "zowazowa",
  ヤバい: "やばい",
  メイン: "main",
  ストリングス: "strings",
  エゴ: "ego",
  スピード: "speed",
  シンセサイザー: "synthesizer",
  ムカつく: "むかつく",
  イラ: "いらっ",
  フフ: "ふふ",
  ミライ: "未来",
  クセ: "くせ",
  ムカつい: "むかつい",
  ファミリー: "family",
  フィルタ: "filter",
  タイム: "time",
  ペコペコ: "ぺこぺこ",
  チーズ: "cheese",
  アイス: "ice",
  ティー: "tea",
  ワンタン: "雲吞",
  ウーロン: "烏龍",
  テンション: "tension",
};

// export const replaceStrings = (
//   str: string,
//   replacements: Record<string, string>
// ): string => {
//   return Object.entries(replacements).reduce(
//     (acc, [key, value]) => acc.replace(new RegExp(key, "g"), value),
//     str
//   );
// };

// Utility to escape regex metacharacters in keys.
const escapeRegExp = (str: string): string =>
  str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const replaceStrings = (
  str: string,
  replacements: Record<string, string>
): string => {
  // Sort keys descending to avoid partial matching when one key is a substring of another.
  const keys = Object.keys(replacements).sort((a, b) => b.length - a.length);
  const pattern = new RegExp(keys.map(escapeRegExp).join("|"), "g");

  let lastIndex = 0;
  let result = "";
  // This will store the most recent replacement value
  let lastReplacement = "";

  // Use the callback form to handle each match in order.
  str.replace(pattern, (match, offset) => {
    // Append the text between the last match and the current one.
    result += str.slice(lastIndex, offset);
    const replacement = replacements[match];

    // Check: if the match starts immediately after the previous match
    // (i.e. no non-matching text between) then check for space boundaries.
    if (offset === lastIndex && lastReplacement) {
      if (
        lastReplacement[lastReplacement.length - 1] !== " " &&
        replacement[0] !== " "
      ) {
        result += " ";
      }
    }

    result += replacement;
    lastReplacement = replacement;
    lastIndex = offset + match.length;
    return replacement; // not used
  });

  // Append any remaining text after the last match.
  result += str.slice(lastIndex);
  return result;
};

// export const replaceStrings = (
//   str: string,
//   replacements: Record<string, string>
// ): string => {
//   const keys = Object.keys(replacements);
//   if (keys.length === 0) return str;

//   // Escape regex special characters and sort keys by length descending
//   const escapedKeys = keys.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
//   escapedKeys.sort((a, b) => b.length - a.length);

//   // Create regex to split the string into tokens of keys and non-keys
//   const regex = new RegExp(`(${escapedKeys.join("|")})`, "g");
//   const tokens = str.split(regex).filter((t) => t !== "");

//   // Process each token into its replacement or original text, noting if it was replaced
//   const processed = tokens.map((t) => ({
//     text: replacements.hasOwnProperty(t) ? replacements[t] : t,
//     replaced: replacements.hasOwnProperty(t),
//   }));

//   // Build the result string, adding spaces between consecutive replaced tokens
//   let result = "";
//   for (let i = 0; i < processed.length; i++) {
//     const current = processed[i];
//     result += current.text;

//     // Check if the next token is also replaced to add a space
//     if (i < processed.length - 1) {
//       const next = processed[i + 1];
//       if (current.replaced && next.replaced) {
//         result += " ";
//       }
//     }
//   }

//   return result;
// };

// export const replaceStrings = (
//   str: string,
//   replacements: Record<string, string>
// ): string => {
//   // Step 1: Replace each key with a marked version of its value
//   const markedStr = Object.entries(replacements).reduce((acc, [key, value]) => {
//     return acc.replace(new RegExp(key, "g"), `{{${value}}}`);
//   }, str);

//   // Step 2: Split the marked string into parts (markers and non-markers)
//   const parts = [];
//   let lastIndex = 0;
//   const markerRegex = /\{\{(.*?)\}\}/g;

//   while (lastIndex < markedStr.length) {
//     const match = markerRegex.exec(markedStr);
//     if (!match) break;

//     const before = markedStr.slice(lastIndex, match.index);
//     if (before) parts.push(before);
//     parts.push(match[0]);
//     lastIndex = match.index + match[0].length;
//   }

//   if (lastIndex < markedStr.length) {
//     parts.push(markedStr.slice(lastIndex));
//   }

//   // Step 3: Build the result, inserting spaces between adjacent markers
//   let result = "";
//   for (let i = 0; i < parts.length; i++) {
//     result += parts[i];
//     if (i < parts.length - 1) {
//       const current = parts[i];
//       const next = parts[i + 1];
//       if (current.startsWith("{{") && next.startsWith("{{")) {
//         result += " ";
//       }
//     }
//   }

//   // Step 4: Remove the markers to get the final string
//   return result.replace(/\{\{(.*?)\}\}/g, "$1");
// };
