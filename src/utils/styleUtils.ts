import { ViewStyle, TextStyle, ImageStyle } from 'react-native';

type SingleStyle = ViewStyle | TextStyle | ImageStyle;
export type StyleItem = SingleStyle | null | undefined | false | StyleItem[];

/**
 * Hàm gộp Style thủ công (Manual Style Merger):
 * 1. Tự động bỏ qua các giá trị falsy (false, null, undefined).
 * 2. Xử lý truyền tham số đơn hoặc mảng style (kể cả mảng lồng nhau).
 * 3. Style đứng SAU sẽ GHI ĐÈ (override) thuộc tính trùng tên của style đứng TRƯỚC.
 *
 * @param styles Các đối tượng style hoặc mảng style truyền vào
 * @returns SingleStyle Đối tượng style duy nhất đã được gộp
 */
export function mergeStyles(...styles: StyleItem[]): SingleStyle {
  const result: Record<string, any> = {};

  function process(item: StyleItem) {
    // Nếu là mảng (kể cả mảng lồng nhau) -> duyệt qua từng phần tử
    if (Array.isArray(item)) {
      for (const subItem of item) {
        process(subItem);
      }
      return;
    }

    // Bỏ qua null, undefined, false hoặc các kiểu không phải object
    if (!item || typeof item !== 'object') {
      return;
    }

    // Gộp thuộc tính: style sau sẽ ghi đè lên style trước
    Object.assign(result, item);
  }

  for (const style of styles) {
    process(style);
  }

  return result as SingleStyle;
}
